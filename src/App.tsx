import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess, Square, PieceSymbol } from 'chess.js';
import { ChessBoardContainer } from './components/Board/ChessBoardContainer';
import { EvaluationBar } from './components/Board/EvaluationBar';
import { CoachPanel } from './components/Coach/CoachPanel';
import { MoveHistory } from './components/History/MoveHistory';
import { SettingsModal } from './components/Modals/SettingsModal';
import { GameOverModal } from './components/Modals/GameOverModal';
import { CoachCommentary, BoardArrow, GameSettings, OpeningInfo } from './types/chess';
import { COACH_PERSONALITIES } from './data/personalities';
import { findOpeningByMoves } from './data/openings';
import { ChessAnalysisEngine } from './services/stockfishEngine';
import { CoachNarrator } from './services/coachNarrator';
import { VoiceService } from './services/voiceService';
import { SoundService } from './services/soundService';
import { Settings, RotateCcw, ArrowUpDown, Award } from 'lucide-react';

const INITIAL_SETTINGS: GameSettings = {
  playerColor: 'w',
  difficulty: 3, // Club player (~1500 ELO)
  personalityId: 'sophia',
  voiceEnabled: true,
  autoPlayCoach: true,
  showArrows: true,
  showThreats: true
};

export const App: React.FC = () => {
  const [game, setGame] = useState<Chess>(new Chess());
  const [settings, setSettings] = useState<GameSettings>(INITIAL_SETTINGS);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [commentaries, setCommentaries] = useState<CoachCommentary[]>([]);
  const [arrows, setArrows] = useState<BoardArrow[]>([]);
  const [isEngineThinking, setIsEngineThinking] = useState(false);
  const [evaluation, setEvaluation] = useState<number>(0);
  const [evalDisplay, setEvalDisplay] = useState<string>('0.0');
  const [currentOpening, setCurrentOpening] = useState<OpeningInfo | null>(null);

  // Audio Voice States
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [gameOver, setGameOver] = useState<{
    isOpen: boolean;
    winner: 'player' | 'coach' | 'draw' | null;
    reason: string;
  }>({ isOpen: false, winner: null, reason: '' });

  // Store history of game FEN snapshots for reliable takebacks
  const fenHistoryRef = useRef<string[]>([new Chess().fen()]);
  const isExecutingCoachMove = useRef(false);

  const currentPersonality = COACH_PERSONALITIES.find(p => p.id === settings.personalityId) || COACH_PERSONALITIES[0];

  // Subscribe to Voice State changes (playing, paused)
  useEffect(() => {
    const unsubscribe = VoiceService.subscribe(state => {
      setIsAudioPlaying(state.isPlaying);
      setIsAudioPaused(state.isPaused);
    });
    return unsubscribe;
  }, []);

  // Update evaluation
  const refreshEvaluation = useCallback((chessInstance: Chess) => {
    const score = ChessAnalysisEngine.evaluatePosition(chessInstance);
    setEvaluation(score);
    const pawns = (score / 100).toFixed(1);
    setEvalDisplay(score >= 0 ? `+${pawns}` : pawns);
  }, []);

  // Update recognized opening
  const refreshOpening = useCallback((chessInstance: Chess) => {
    const history = chessInstance.history();
    const opening = findOpeningByMoves(history);
    setCurrentOpening(opening);
  }, []);

  // Trigger Coach (Bot) Move
  const triggerCoachMove = useCallback((currentGame: Chess) => {
    if (currentGame.isGameOver() || isExecutingCoachMove.current) return;

    isExecutingCoachMove.current = true;
    setIsEngineThinking(true);

    // Give a realistic brief coaching pause (400 - 600ms)
    setTimeout(() => {
      try {
        const gameCopy = new Chess(currentGame.fen());
        const moveNumber = Math.ceil(gameCopy.history().length / 2);

        // Calculate coach move based on difficulty
        const coachMove = ChessAnalysisEngine.getBotMove(gameCopy, settings.difficulty);
        if (!coachMove) {
          setIsEngineThinking(false);
          isExecutingCoachMove.current = false;
          return;
        }

        const gameBefore = new Chess(gameCopy.fen());
        const executedMove = gameCopy.move(coachMove);

        if (executedMove) {
          if (executedMove.captured) {
            SoundService.playCapture();
          } else if (gameCopy.inCheck()) {
            SoundService.playCheck();
          } else {
            SoundService.playMove();
          }

          // Generate Coach's self-explanation
          const coachCommentary = CoachNarrator.explainCoachMove(
            gameBefore,
            gameCopy,
            executedMove,
            gameCopy.history(),
            moveNumber
          );

          setGame(gameCopy);
          fenHistoryRef.current.push(gameCopy.fen());
          setCommentaries(prev => [...prev, coachCommentary]);

          if (settings.showArrows && coachCommentary.arrows) {
            setArrows(coachCommentary.arrows);
          }

          refreshEvaluation(gameCopy);
          refreshOpening(gameCopy);

          // Audio speech for Coach's move
          if (settings.voiceEnabled) {
            VoiceService.speak(`${coachCommentary.title}. ${coachCommentary.explanation}`);
          }

          // Check if coach won
          if (gameCopy.isGameOver()) {
            handleGameOverCheck(gameCopy);
          }
        }
      } catch (e) {
        console.error("Coach move error:", e);
      } finally {
        setIsEngineThinking(false);
        isExecutingCoachMove.current = false;
      }
    }, 500);
  }, [settings.difficulty, settings.showArrows, settings.voiceEnabled, refreshEvaluation, refreshOpening]);

  // Handle Player Move: Explains Player Move FIRST, and ONLY after proceeds to Coach Move
  const handlePlayerMove = (from: Square, to: Square, promotion?: PieceSymbol): boolean => {
    if (game.isGameOver() || isEngineThinking) return false;

    try {
      const gameCopy = new Chess(game.fen());
      const gameBefore = new Chess(game.fen());
      const moveNumber = Math.ceil((gameCopy.history().length + 1) / 2);

      // Analyze best move before executing player's move for critique comparison
      const bestMoveBefore = ChessAnalysisEngine.getBestMove(gameBefore, 3);

      const moveObj: { from: Square; to: Square; promotion?: PieceSymbol } = { from, to };
      if (promotion) moveObj.promotion = promotion;

      const executedMove = gameCopy.move(moveObj);
      if (!executedMove) return false;

      // Critique player move
      const critique = CoachNarrator.critiquePlayerMove(
        gameBefore,
        gameCopy,
        executedMove,
        gameCopy.history(),
        moveNumber,
        bestMoveBefore
      );

      setGame(gameCopy);
      fenHistoryRef.current.push(gameCopy.fen());
      setCommentaries(prev => [...prev, critique]);

      if (settings.showArrows && critique.arrows) {
        setArrows(critique.arrows);
      }

      refreshEvaluation(gameCopy);
      refreshOpening(gameCopy);

      // Check game over
      if (gameCopy.isGameOver()) {
        if (settings.voiceEnabled) {
          VoiceService.speak(`${critique.title}. ${critique.explanation}`);
        }
        handleGameOverCheck(gameCopy);
        return true;
      }

      // Sequential Execution: Explain player move first, then make Coach move
      if (gameCopy.turn() !== settings.playerColor) {
        const speechText = `${critique.title}. ${critique.explanation}`;

        if (settings.voiceEnabled) {
          VoiceService.speakAndThen(speechText, () => {
            // Once the student's move explanation finishes completely, trigger Coach move
            setTimeout(() => {
              triggerCoachMove(gameCopy);
            }, 450);
          });
        } else {
          // If voice muted, provide a comfortable reading delay before the coach answers
          setTimeout(() => {
            triggerCoachMove(gameCopy);
          }, 800);
        }
      }

      return true;
    } catch {
      return false;
    }
  };

  const handleGameOverCheck = (g: Chess) => {
    if (g.isCheckmate()) {
      const winner = g.turn() === settings.playerColor ? 'coach' : 'player';
      setGameOver({
        isOpen: true,
        winner,
        reason: winner === 'player' ? 'Checkmate! You delivered a masterful finish.' : 'Checkmate delivered by coach.'
      });
    } else if (g.isDraw()) {
      setGameOver({
        isOpen: true,
        winner: 'draw',
        reason: g.isStalemate() ? 'Stalemate - No legal moves remain.' : 'Draw by threefold repetition or insufficient material.'
      });
    }
  };

  // Take Back functionality
  const handleTakeBack = () => {
    if (fenHistoryRef.current.length <= 1 || isEngineThinking) return;

    VoiceService.cancel();

    // Pop the coach move and user move back to the user's turn
    const newHistory = [...fenHistoryRef.current];
    const stepsToUndo = game.turn() === settings.playerColor && newHistory.length >= 3 ? 2 : 1;

    for (let i = 0; i < stepsToUndo; i++) {
      if (newHistory.length > 1) {
        newHistory.pop();
      }
    }

    fenHistoryRef.current = newHistory;
    const previousFen = newHistory[newHistory.length - 1];
    const restoredGame = new Chess(previousFen);

    setGame(restoredGame);
    setCommentaries(prev => prev.slice(0, Math.max(0, prev.length - stepsToUndo)));
    setArrows([]);
    refreshEvaluation(restoredGame);
    refreshOpening(restoredGame);

    VoiceService.speak("Takeback applied. Take your time to find a stronger move!");
  };

  // Best Move Hint
  const handleShowHint = () => {
    const analysis = ChessAnalysisEngine.getBestMove(game, 3);
    if (!analysis) return;

    const hintArrow: BoardArrow = {
      from: analysis.bestMove.from,
      to: analysis.bestMove.to,
      color: '#22c55e'
    };

    setArrows([hintArrow]);
    VoiceService.speak(`Consider ${analysis.bestMove.san} to develop your position.`);
  };

  // Threat Detector
  const handleShowThreat = () => {
    const opponentGame = new Chess(game.fen());
    const analysis = ChessAnalysisEngine.getBestMove(opponentGame, 3);

    if (analysis) {
      setArrows([{
        from: analysis.bestMove.from,
        to: analysis.bestMove.to,
        color: '#ef4444'
      }]);
      VoiceService.speak(`Watch out for moves toward ${analysis.bestMove.to}.`);
    }
  };

  // Preview recommended move
  const handlePreviewMove = (from: string, to: string) => {
    setArrows([{ from, to, color: '#22c55e' }]);
  };

  // Reset / New Game
  const startNewGame = useCallback((colorOverride?: 'w' | 'b') => {
    VoiceService.cancel();
    const newChess = new Chess();
    fenHistoryRef.current = [newChess.fen()];
    setGame(newChess);
    setCommentaries([]);
    setArrows([]);
    setGameOver({ isOpen: false, winner: null, reason: '' });
    refreshEvaluation(newChess);
    setCurrentOpening(null);

    const activeColor = colorOverride || settings.playerColor;
    setBoardOrientation(activeColor === 'w' ? 'white' : 'black');

    VoiceService.speak(`New game started. I am ${currentPersonality.name}, let's play!`);

    // If player is Black, Coach makes the first move as White
    if (activeColor === 'b') {
      triggerCoachMove(newChess);
    }
  }, [settings.playerColor, currentPersonality.name, refreshEvaluation, triggerCoachMove]);

  // Initial load or color change
  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.playerColor]);

  const handleTogglePause = () => {
    if (VoiceService.isPaused()) {
      VoiceService.resume();
    } else {
      VoiceService.pause();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 p-0.5 shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xl">
                ♟️
              </div>
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                ChessMaster <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">Coach AI</span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Live Interactive Coaching & Strategy Monologue
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => startNewGame()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition shadow-sm"
              title="New Game"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Game</span>
            </button>

            <button
              onClick={() => setBoardOrientation(o => o === 'white' ? 'black' : 'white')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 transition"
              title="Flip Board"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 transition"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side / Center: Chessboard Area (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col gap-4 items-center">
          {/* Opponent Info Bar with Coach Rating */}
          <div className="w-full max-w-[580px] flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentPersonality.avatar}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">{currentPersonality.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-0.5">
                    <Award className="w-2.5 h-2.5 text-amber-400" />
                    {currentPersonality.rating} ELO
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  Playing Level: {settings.difficulty} ({settings.difficulty === 1 ? '800' : settings.difficulty === 2 ? '1200' : settings.difficulty === 3 ? '1500' : settings.difficulty === 4 ? '1800' : '2200'} ELO)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${game.turn() !== settings.playerColor ? 'bg-sky-400 animate-ping' : 'bg-slate-700'}`} />
              <span className="font-mono text-xs text-slate-400">
                {game.turn() !== settings.playerColor ? "Coach's turn" : "Waiting for you"}
              </span>
            </div>
          </div>

          {/* Board + Evaluation Bar side by side */}
          <div className="w-full flex items-center justify-center gap-3">
            <EvaluationBar
              score={evaluation}
              scoreDisplay={evalDisplay}
              isFlipped={boardOrientation === 'black'}
            />

            <ChessBoardContainer
              game={game}
              boardOrientation={boardOrientation}
              arrows={arrows}
              onPlayerMove={handlePlayerMove}
              isEngineThinking={isEngineThinking}
              playerColor={settings.playerColor}
            />
          </div>

          {/* Player Info Bar: 'You' (Student label removed) */}
          <div className="w-full max-w-[580px] flex items-center justify-between px-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-sky-400">
                👤
              </div>
              <div>
                <span className="font-bold text-white block">You</span>
                <span className="text-[11px] text-slate-400">
                  Playing as {settings.playerColor === 'w' ? 'White ⚪' : 'Black ⚫'}
                </span>
              </div>
            </div>

            {game.inCheck() && (
              <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/40 text-xs animate-pulse">
                CHECK!
              </span>
            )}
          </div>

          {/* Notation History beneath board */}
          <div className="w-full max-w-[580px]">
            <MoveHistory commentaries={commentaries} />
          </div>
        </div>

        {/* Right Side: Live Coach Studio Panel (5 cols on lg) */}
        <div className="lg:col-span-5 h-[calc(100vh-100px)] min-h-[580px] sticky top-20">
          <CoachPanel
            personality={currentPersonality}
            commentaries={commentaries}
            currentOpening={currentOpening}
            voiceEnabled={settings.voiceEnabled}
            isAudioPaused={isAudioPaused}
            isAudioPlaying={isAudioPlaying}
            onToggleVoice={() => setSettings(s => ({ ...s, voiceEnabled: !s.voiceEnabled }))}
            onTogglePause={handleTogglePause}
            onTakeBack={handleTakeBack}
            onShowHint={handleShowHint}
            onShowThreat={handleShowThreat}
            onPreviewMove={handlePreviewMove}
            canTakeBack={fenHistoryRef.current.length > 1 && !isEngineThinking}
          />
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={newS => {
          setSettings(newS);
          VoiceService.setEnabled(newS.voiceEnabled);
        }}
      />

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={gameOver.isOpen}
        winner={gameOver.winner}
        reason={gameOver.reason}
        commentaries={commentaries}
        onPlayAgain={() => startNewGame()}
      />
    </div>
  );
};

export default App;
