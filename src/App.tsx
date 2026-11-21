import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Chess, Square, PieceSymbol } from 'chess.js';
import { ChessBoardContainer } from './components/Board/ChessBoardContainer';
import { EvaluationBar } from './components/Board/EvaluationBar';
import { CoachPanel } from './components/Coach/CoachPanel';
import { VsComputerPanel } from './components/VsComputer/VsComputerPanel';
import { SettingsModal } from './components/Modals/SettingsModal';
import { GameOverModal } from './components/Modals/GameOverModal';
import {
  CoachCommentary,
  BoardArrow,
  GameSettings,
  OpeningInfo,
  MoveQuality,
  ComputerBot,
  COMPUTER_BOTS,
  PieceColor
} from './types/chess';
import { COACH_PERSONALITIES } from './data/personalities';
import { findOpeningByMoves } from './data/openings';
import { ChessAnalysisEngine } from './services/stockfishEngine';
import { CoachNarrator } from './services/coachNarrator';
import { VoiceService } from './services/voiceService';
import { SoundService } from './services/soundService';
import { getCapturedPieces, PIECE_ICONS } from './utils/chessUtils';
import {
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  GraduationCap,
  Bot
} from 'lucide-react';

interface StoredMove {
  from: Square;
  to: Square;
  san: string;
  quality?: MoveQuality;
}

const INITIAL_SETTINGS: GameSettings = {
  playerColor: 'w',
  difficulty: 3,
  personalityId: 'sophia',
  voiceEnabled: true,
  autoPlayCoach: true,
  showArrows: true,
  showThreats: true
};

export const App: React.FC = () => {
  // Navigation Tabs: 'coach' (Instructional) or 'vs-computer' (Pure Match without instructions)
  const [activeTab, setActiveTab] = useState<'coach' | 'vs-computer'>('coach');

  // ==========================================
  // COACH MODE STATE
  // ==========================================
  const [game, setGame] = useState<Chess>(new Chess());
  const [settings, setSettings] = useState<GameSettings>(INITIAL_SETTINGS);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [commentaries, setCommentaries] = useState<CoachCommentary[]>([]);
  const [arrows, setArrows] = useState<BoardArrow[]>([]);
  const [isEngineThinking, setIsEngineThinking] = useState(false);
  const [evaluation, setEvaluation] = useState<number>(0);
  const [currentOpening, setCurrentOpening] = useState<OpeningInfo | null>(null);

  const [viewingIndex, setViewingIndex] = useState<number>(0);
  const fenHistoryRef = useRef<string[]>([new Chess().fen()]);
  const movesRecordRef = useRef<StoredMove[]>([]);

  const coachTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analysisTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const postCritiqueTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isExecutingCoachMove = useRef(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [gameOver, setGameOver] = useState<{
    isOpen: boolean;
    winner: 'player' | 'coach' | 'draw' | null;
    reason: string;
  }>({ isOpen: false, winner: null, reason: '' });

  const currentPersonality = COACH_PERSONALITIES.find(p => p.id === settings.personalityId) || COACH_PERSONALITIES[0];
  const isLivePosition = viewingIndex === fenHistoryRef.current.length - 1;

  const displayGame = useMemo(() => {
    if (isLivePosition) return game;
    try {
      return new Chess(fenHistoryRef.current[viewingIndex]);
    } catch {
      return game;
    }
  }, [game, isLivePosition, viewingIndex]);

  const currentLastMove = useMemo(() => {
    if (viewingIndex === 0 || movesRecordRef.current.length === 0) return null;
    return movesRecordRef.current[viewingIndex - 1] || null;
  }, [viewingIndex]);

  // ==========================================
  // VS COMPUTER MODE STATE (Without Instructions)
  // ==========================================
  const [vsBot, setVsBot] = useState<ComputerBot>(COMPUTER_BOTS[1]); // Default Martin 1000
  const [vsPlayerColor, setVsPlayerColor] = useState<PieceColor>('w');
  const [vsGame, setVsGame] = useState<Chess>(new Chess());
  const [vsBoardOrientation, setVsBoardOrientation] = useState<'white' | 'black'>('white');
  const [vsIsEngineThinking, setVsIsEngineThinking] = useState(false);
  const [vsEvaluation, setVsEvaluation] = useState<number>(0);
  const [vsViewingIndex, setVsViewingIndex] = useState<number>(0);
  const vsFenHistoryRef = useRef<string[]>([new Chess().fen()]);
  const vsMovesRecordRef = useRef<StoredMove[]>([]);
  const vsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [vsGameOver, setVsGameOver] = useState<{
    isOpen: boolean;
    winner: 'player' | 'coach' | 'draw' | null;
    reason: string;
  }>({ isOpen: false, winner: null, reason: '' });

  const isVsLivePosition = vsViewingIndex === vsFenHistoryRef.current.length - 1;

  const vsDisplayGame = useMemo(() => {
    if (isVsLivePosition) return vsGame;
    try {
      return new Chess(vsFenHistoryRef.current[vsViewingIndex]);
    } catch {
      return vsGame;
    }
  }, [vsGame, isVsLivePosition, vsViewingIndex]);

  const vsCurrentLastMove = useMemo(() => {
    if (vsViewingIndex === 0 || vsMovesRecordRef.current.length === 0) return null;
    return vsMovesRecordRef.current[vsViewingIndex - 1] || null;
  }, [vsViewingIndex]);

  // Tab switcher
  const handleTabSwitch = (tab: 'coach' | 'vs-computer') => {
    if (tab === activeTab) return;
    if (tab === 'vs-computer') {
      VoiceService.cancel();
    }
    setActiveTab(tab);
  };

  // Captured pieces calculation
  const coachCaptured = useMemo(() => getCapturedPieces(displayGame.fen()), [displayGame]);
  const vsCaptured = useMemo(() => getCapturedPieces(vsDisplayGame.fen()), [vsDisplayGame]);

  // Aborts any pending coach move or analysis timeouts
  const clearAllPendingCoachTimers = useCallback(() => {
    if (coachTimeoutRef.current) {
      clearTimeout(coachTimeoutRef.current);
      coachTimeoutRef.current = null;
    }
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
      analysisTimeoutRef.current = null;
    }
    if (postCritiqueTimeoutRef.current) {
      clearTimeout(postCritiqueTimeoutRef.current);
      postCritiqueTimeoutRef.current = null;
    }
    VoiceService.cancel();
    isExecutingCoachMove.current = false;
    setIsEngineThinking(false);
  }, []);

  // Keyboard navigation: Arrow Keys (← → ↑ ↓) and Spacebar to skip voice
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (activeTab === 'coach') {
        if (e.code === 'Space' || e.key === ' ') {
          e.preventDefault();
          VoiceService.skip();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setViewingIndex(idx => Math.max(0, idx - 1));
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          setViewingIndex(idx => Math.min(fenHistoryRef.current.length - 1, idx + 1));
        } else if (e.key === 'ArrowUp' || e.key === 'Home') {
          e.preventDefault();
          setViewingIndex(0);
        } else if (e.key === 'ArrowDown' || e.key === 'End') {
          e.preventDefault();
          setViewingIndex(fenHistoryRef.current.length - 1);
        }
      } else {
        // Vs Computer mode keyboard navigation
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setVsViewingIndex(idx => Math.max(0, idx - 1));
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          setVsViewingIndex(idx => Math.min(vsFenHistoryRef.current.length - 1, idx + 1));
        } else if (e.key === 'ArrowUp' || e.key === 'Home') {
          e.preventDefault();
          setVsViewingIndex(0);
        } else if (e.key === 'ArrowDown' || e.key === 'End') {
          e.preventDefault();
          setVsViewingIndex(vsFenHistoryRef.current.length - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // Update evaluation
  const refreshEvaluation = useCallback((chessInstance: Chess) => {
    const score = ChessAnalysisEngine.evaluatePosition(chessInstance);
    setEvaluation(score);
  }, []);

  const refreshVsEvaluation = useCallback((chessInstance: Chess) => {
    const score = ChessAnalysisEngine.evaluatePosition(chessInstance);
    setVsEvaluation(score);
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

    coachTimeoutRef.current = setTimeout(() => {
      try {
        const gameCopy = new Chess(currentGame.fen());
        const moveNumber = Math.ceil(gameCopy.history().length / 2);

        // Coach makes master-level moves with no blunders or mistakes
        const coachMove = ChessAnalysisEngine.getCoachMove(gameCopy);
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
          movesRecordRef.current.push({
            from: executedMove.from as Square,
            to: executedMove.to as Square,
            san: executedMove.san
          });

          setViewingIndex(fenHistoryRef.current.length - 1);
          setCommentaries(prev => [...prev, coachCommentary]);

          if (settings.showArrows && coachCommentary.arrows) {
            setArrows(coachCommentary.arrows);
          }

          refreshEvaluation(gameCopy);
          refreshOpening(gameCopy);

          if (settings.voiceEnabled) {
            VoiceService.speak(`${coachCommentary.title}. ${coachCommentary.explanation}`);
          }

          if (gameCopy.isGameOver()) {
            handleGameOverCheck(gameCopy);
          }
        }
      } catch (e) {
        console.error("Coach move error:", e);
      } finally {
        setIsEngineThinking(false);
        isExecutingCoachMove.current = false;
        coachTimeoutRef.current = null;
      }
    }, 450);
  }, [settings.difficulty, settings.showArrows, settings.voiceEnabled, refreshEvaluation, refreshOpening]);

  // Handle Player Move in Coach Mode
  const handlePlayerMove = (from: Square, to: Square, promotion?: PieceSymbol): boolean => {
    if (isEngineThinking) return false;

    try {
      const currentFen = fenHistoryRef.current[viewingIndex] || game.fen();
      const gameBefore = new Chess(currentFen);

      if (gameBefore.turn() !== settings.playerColor || gameBefore.isGameOver()) {
        return false;
      }

      const gameCopy = new Chess(currentFen);
      const moveObj: { from: Square; to: Square; promotion?: PieceSymbol } = { from, to };
      if (promotion) moveObj.promotion = promotion;

      const executedMove = gameCopy.move(moveObj);
      if (!executedMove) return false;

      clearAllPendingCoachTimers();

      const truncatedFens = fenHistoryRef.current.slice(0, viewingIndex + 1);
      const truncatedMoves = movesRecordRef.current.slice(0, viewingIndex);
      const truncatedCommentaries = commentaries.slice(0, viewingIndex);

      const newFenHistory = [...truncatedFens, gameCopy.fen()];
      fenHistoryRef.current = newFenHistory;

      const currentMoveRecord: StoredMove = {
        from: executedMove.from as Square,
        to: executedMove.to as Square,
        san: executedMove.san
      };
      movesRecordRef.current = [...truncatedMoves, currentMoveRecord];
      setCommentaries(truncatedCommentaries);

      setGame(gameCopy);
      setViewingIndex(newFenHistory.length - 1);

      const moveNumber = Math.ceil(newFenHistory.length / 2);

      analysisTimeoutRef.current = setTimeout(() => {
        // Evaluate top candidate moves for human-like comparison and arrows
        const candidateMoves = ChessAnalysisEngine.getTopCandidateMoves(gameBefore, 3, 3);
        const critique = CoachNarrator.critiquePlayerMove(
          gameBefore,
          gameCopy,
          executedMove,
          gameCopy.history(),
          moveNumber,
          candidateMoves
        );

        currentMoveRecord.quality = critique.quality;
        setCommentaries(prev => [...prev, critique]);

        if (settings.showArrows && critique.arrows) {
          setArrows(critique.arrows);
        }

        refreshEvaluation(gameCopy);
        refreshOpening(gameCopy);

        // Prepare human-like spoken coaching text with alternative moves
        let speechText = `${critique.title}. ${critique.explanation}`;
        if (critique.candidateOptions && critique.candidateOptions.length > 0) {
          const best = critique.candidateOptions[0];
          speechText += ` Stronger option was ${best.san}: ${best.reason}`;
          if (critique.candidateOptions.length > 1) {
            const second = critique.candidateOptions[1];
            speechText += ` Another choice was ${second.san}: ${second.reason}`;
          }
        }

        if (gameCopy.isGameOver()) {
          if (settings.voiceEnabled) {
            VoiceService.speak(speechText);
          }
          handleGameOverCheck(gameCopy);
          return;
        }

        if (gameCopy.turn() !== settings.playerColor) {
          if (settings.voiceEnabled) {
            VoiceService.speak(speechText);
          }
          // Fast, natural GM response time (400ms) without waiting for audio speech to finish
          postCritiqueTimeoutRef.current = setTimeout(() => {
            triggerCoachMove(gameCopy);
          }, 400);
        }
      }, 16);

      return true;
    } catch {
      return false;
    }
  };

  // Check Game Over in Coach Mode
  const handleGameOverCheck = (chessInstance: Chess) => {
    let reason = '';
    let winner: 'player' | 'coach' | 'draw' | null = null;

    if (chessInstance.isCheckmate()) {
      const loser = chessInstance.turn();
      winner = loser === settings.playerColor ? 'coach' : 'player';
      reason = winner === 'player' ? 'Checkmate! You won against the coach!' : 'Checkmate! Coach won the game.';
      SoundService.playCheckmate();
    } else if (chessInstance.isDraw()) {
      winner = 'draw';
      reason = chessInstance.isStalemate()
        ? 'Draw by Stalemate!'
        : chessInstance.isThreefoldRepetition()
        ? 'Draw by Threefold Repetition!'
        : chessInstance.isInsufficientMaterial()
        ? 'Draw by Insufficient Material!'
        : 'Draw by 50-move rule!';
    }

    if (winner) {
      setGameOver({ isOpen: true, winner, reason });
    }
  };

  // Takeback in Coach Mode
  const handleTakeBack = () => {
    if (fenHistoryRef.current.length <= 1) return;

    clearAllPendingCoachTimers();

    let targetIdx = fenHistoryRef.current.length - 1;
    const currentFen = fenHistoryRef.current[targetIdx];
    const testGame = new Chess(currentFen);

    if (testGame.turn() === settings.playerColor && fenHistoryRef.current.length >= 3) {
      targetIdx -= 2;
    } else {
      targetIdx = Math.max(0, targetIdx - 1);
    }

    const newFenHistory = fenHistoryRef.current.slice(0, targetIdx + 1);
    const newMovesRecord = movesRecordRef.current.slice(0, targetIdx);
    const newCommentaries = commentaries.slice(0, targetIdx);

    fenHistoryRef.current = newFenHistory;
    movesRecordRef.current = newMovesRecord;
    setCommentaries(newCommentaries);

    const revertedGame = new Chess(newFenHistory[targetIdx]);
    setGame(revertedGame);
    setViewingIndex(targetIdx);

    refreshEvaluation(revertedGame);
    refreshOpening(revertedGame);
    setArrows([]);

    SoundService.playMove();

    if (settings.voiceEnabled) {
      VoiceService.speak("Move taken back. Try a different path!");
    }
  };

  // Hint in Coach Mode
  const handleShowHint = () => {
    if (isEngineThinking || displayGame.turn() !== settings.playerColor) return;

    const analysis = ChessAnalysisEngine.getBestMove(displayGame, 3);
    if (!analysis) return;

    const hintArrow: BoardArrow = {
      from: analysis.bestMove.from,
      to: analysis.bestMove.to,
      color: '#81b64c'
    };

    setArrows([hintArrow]);
    VoiceService.speak(`Consider ${analysis.bestMove.san} to develop your position.`);
  };

  const handleResign = () => {
    setGameOver({
      isOpen: true,
      winner: 'coach',
      reason: 'You resigned the game.'
    });
  };

  const startNewGame = useCallback((colorOverride?: 'w' | 'b') => {
    clearAllPendingCoachTimers();
    const newChess = new Chess();
    fenHistoryRef.current = [newChess.fen()];
    movesRecordRef.current = [];
    setViewingIndex(0);
    setGame(newChess);
    setCommentaries([]);
    setArrows([]);
    setGameOver({ isOpen: false, winner: null, reason: '' });
    refreshEvaluation(newChess);
    setCurrentOpening(null);

    const activeColor = colorOverride || settings.playerColor;
    setBoardOrientation(activeColor === 'w' ? 'white' : 'black');

    VoiceService.speak(`New game started. I am ${currentPersonality.name}, let's play!`);

    if (activeColor === 'b') {
      triggerCoachMove(newChess);
    }
  }, [settings.playerColor, currentPersonality.name, clearAllPendingCoachTimers, refreshEvaluation, triggerCoachMove]);

  // ==========================================
  // VS COMPUTER GAME ENGINE & HANDLERS (Clean, No Instructions)
  // ==========================================
  const triggerVsBotMove = useCallback((currentGame: Chess) => {
    if (currentGame.isGameOver()) return;

    setVsIsEngineThinking(true);

    vsTimeoutRef.current = setTimeout(() => {
      try {
        const gameCopy = new Chess(currentGame.fen());
        const botMove = ChessAnalysisEngine.getBotMove(gameCopy, vsBot.difficulty);
        if (!botMove) {
          setVsIsEngineThinking(false);
          return;
        }

        const executedMove = gameCopy.move(botMove);
        if (executedMove) {
          if (executedMove.captured) {
            SoundService.playCapture();
          } else if (gameCopy.inCheck()) {
            SoundService.playCheck();
          } else {
            SoundService.playMove();
          }

          setVsGame(gameCopy);
          vsFenHistoryRef.current.push(gameCopy.fen());
          vsMovesRecordRef.current.push({
            from: executedMove.from as Square,
            to: executedMove.to as Square,
            san: executedMove.san
          });

          setVsViewingIndex(vsFenHistoryRef.current.length - 1);
          refreshVsEvaluation(gameCopy);

          if (gameCopy.isGameOver()) {
            handleVsGameOverCheck(gameCopy);
          }
        }
      } catch (e) {
        console.error("Vs Bot move error:", e);
      } finally {
        setVsIsEngineThinking(false);
        vsTimeoutRef.current = null;
      }
    }, 450);
  }, [vsBot.difficulty, refreshVsEvaluation]);

  const handleVsPlayerMove = (from: Square, to: Square, promotion?: PieceSymbol): boolean => {
    if (vsIsEngineThinking) return false;

    try {
      const currentFen = vsFenHistoryRef.current[vsViewingIndex] || vsGame.fen();
      const gameBefore = new Chess(currentFen);

      if (gameBefore.turn() !== vsPlayerColor || gameBefore.isGameOver()) {
        return false;
      }

      const gameCopy = new Chess(currentFen);
      const moveObj: { from: Square; to: Square; promotion?: PieceSymbol } = { from, to };
      if (promotion) moveObj.promotion = promotion;

      const executedMove = gameCopy.move(moveObj);
      if (!executedMove) return false;

      if (vsTimeoutRef.current) {
        clearTimeout(vsTimeoutRef.current);
        vsTimeoutRef.current = null;
      }

      if (executedMove.captured) {
        SoundService.playCapture();
      } else if (gameCopy.inCheck()) {
        SoundService.playCheck();
      } else {
        SoundService.playMove();
      }

      const truncatedFens = vsFenHistoryRef.current.slice(0, vsViewingIndex + 1);
      const truncatedMoves = vsMovesRecordRef.current.slice(0, vsViewingIndex);

      const newFenHistory = [...truncatedFens, gameCopy.fen()];
      vsFenHistoryRef.current = newFenHistory;

      const currentMoveRecord: StoredMove = {
        from: executedMove.from as Square,
        to: executedMove.to as Square,
        san: executedMove.san
      };
      vsMovesRecordRef.current = [...truncatedMoves, currentMoveRecord];

      setVsGame(gameCopy);
      setVsViewingIndex(newFenHistory.length - 1);
      refreshVsEvaluation(gameCopy);

      if (gameCopy.isGameOver()) {
        handleVsGameOverCheck(gameCopy);
        return true;
      }

      // Computer plays response move
      if (gameCopy.turn() !== vsPlayerColor) {
        triggerVsBotMove(gameCopy);
      }

      return true;
    } catch {
      return false;
    }
  };

  const handleVsGameOverCheck = (chessInstance: Chess) => {
    let reason = '';
    let winner: 'player' | 'coach' | 'draw' | null = null;

    if (chessInstance.isCheckmate()) {
      const loser = chessInstance.turn();
      winner = loser === vsPlayerColor ? 'coach' : 'player';
      reason = winner === 'player' ? `Checkmate! You defeated ${vsBot.name}!` : `Checkmate! ${vsBot.name} won.`;
      SoundService.playCheckmate();
    } else if (chessInstance.isDraw()) {
      winner = 'draw';
      reason = chessInstance.isStalemate()
        ? 'Draw by Stalemate!'
        : chessInstance.isThreefoldRepetition()
        ? 'Draw by Threefold Repetition!'
        : chessInstance.isInsufficientMaterial()
        ? 'Draw by Insufficient Material!'
        : 'Draw by 50-move rule!';
    }

    if (winner) {
      setVsGameOver({ isOpen: true, winner, reason });
    }
  };

  const startNewVsGame = useCallback((colorOverride?: PieceColor, botOverride?: ComputerBot) => {
    if (vsTimeoutRef.current) {
      clearTimeout(vsTimeoutRef.current);
      vsTimeoutRef.current = null;
    }

    const targetBot = botOverride || vsBot;
    const targetColor = colorOverride || vsPlayerColor;

    const newChess = new Chess();
    vsFenHistoryRef.current = [newChess.fen()];
    vsMovesRecordRef.current = [];
    setVsViewingIndex(0);
    setVsGame(newChess);
    setVsEvaluation(0);
    setVsGameOver({ isOpen: false, winner: null, reason: '' });
    setVsBoardOrientation(targetColor === 'w' ? 'white' : 'black');
    setVsIsEngineThinking(false);

    if (targetColor === 'b') {
      // Bot plays first move as White
      setVsIsEngineThinking(true);
      vsTimeoutRef.current = setTimeout(() => {
        try {
          const gameCopy = new Chess();
          const firstMove = ChessAnalysisEngine.getBotMove(gameCopy, targetBot.difficulty);
          if (firstMove) {
            const ex = gameCopy.move(firstMove);
            if (ex) {
              SoundService.playMove();
              setVsGame(gameCopy);
              vsFenHistoryRef.current.push(gameCopy.fen());
              vsMovesRecordRef.current.push({
                from: ex.from as Square,
                to: ex.to as Square,
                san: ex.san
              });
              setVsViewingIndex(1);
              refreshVsEvaluation(gameCopy);
            }
          }
        } finally {
          setVsIsEngineThinking(false);
          vsTimeoutRef.current = null;
        }
      }, 500);
    }
  }, [vsBot, vsPlayerColor, refreshVsEvaluation]);

  const handleVsTakeBack = () => {
    if (vsFenHistoryRef.current.length <= 1) return;

    if (vsTimeoutRef.current) {
      clearTimeout(vsTimeoutRef.current);
      vsTimeoutRef.current = null;
    }
    setVsIsEngineThinking(false);

    let targetIdx = vsFenHistoryRef.current.length - 1;
    const currentFen = vsFenHistoryRef.current[targetIdx];
    const testGame = new Chess(currentFen);

    // If it's player's turn, revert 2 moves (bot's move + player's move)
    if (testGame.turn() === vsPlayerColor && vsFenHistoryRef.current.length >= 3) {
      targetIdx -= 2;
    } else {
      targetIdx = Math.max(0, targetIdx - 1);
    }

    const newFenHistory = vsFenHistoryRef.current.slice(0, targetIdx + 1);
    const newMovesRecord = vsMovesRecordRef.current.slice(0, targetIdx);

    vsFenHistoryRef.current = newFenHistory;
    vsMovesRecordRef.current = newMovesRecord;

    const revertedGame = new Chess(newFenHistory[targetIdx]);
    setVsGame(revertedGame);
    setVsViewingIndex(targetIdx);
    refreshVsEvaluation(revertedGame);

    SoundService.playMove();
  };

  const handleVsResign = () => {
    setVsGameOver({
      isOpen: true,
      winner: 'coach',
      reason: `You resigned against ${vsBot.name}.`
    });
  };

  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.playerColor]);

  return (
    <div className="min-h-screen bg-[#262522] text-[#c3c2be] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header with Mode Tabs */}
      <header className="border-b border-[#312e2b] bg-[#21201d] px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">♟️</span>
            <span className="font-bold text-white text-sm tracking-wide">
              CHESS <span className="text-[#81b64c]">STUDIO</span>
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-[#181715] p-1 rounded-lg border border-[#312e2b]">
            <button
              onClick={() => handleTabSwitch('coach')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'coach'
                  ? 'bg-[#81b64c] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-[#2b2926]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Play Coach</span>
            </button>

            <button
              onClick={() => handleTabSwitch('vs-computer')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'vs-computer'
                  ? 'bg-[#81b64c] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-[#2b2926]'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Vs Computer</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => (activeTab === 'coach' ? startNewGame() : startNewVsGame())}
            className="px-3 py-1 rounded bg-[#312e2b] hover:bg-[#3d3a36] text-xs font-semibold text-zinc-300 transition"
          >
            New Game
          </button>
          {activeTab === 'coach' && (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#312e2b] transition"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* ========================================= */}
        {/* LEFT SIDE: CHESSBOARD & PLAYERS (7 Cols)  */}
        {/* ========================================= */}
        <div className="xl:col-span-7 flex flex-col items-center xl:items-end xl:pr-4 w-full">
          {activeTab === 'coach' ? (
            /* COACH MODE BOARD VIEW */
            <>
              {/* Top Bar above Board: Coach Profile */}
              <div className="w-full max-w-[710px] flex items-center justify-between pb-1.5 px-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-[#312e2b] border border-zinc-700/60 flex items-center justify-center text-base shadow-sm">
                    {currentPersonality.avatar}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-xs">
                      {currentPersonality.name} ({currentPersonality.rating})
                    </span>
                    <span className="text-sm">🇮🇳</span>
                  </div>

                  {/* Captured pieces by Coach */}
                  <div className="flex items-center gap-0.5 ml-2 text-zinc-400 text-sm">
                    {coachCaptured.blackCaptured.map((p, idx) => (
                      <span key={idx} className="leading-none text-white opacity-85">
                        {PIECE_ICONS[p] || p}
                      </span>
                    ))}
                    {coachCaptured.materialAdvantage < 0 && (
                      <span className="text-[10px] font-bold text-zinc-400 ml-1">
                        +{Math.abs(coachCaptured.materialAdvantage)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="text-zinc-500 hover:text-zinc-300 p-1"
                  title="Board Settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Center: Evaluation Bar + Classic Brown Chessboard */}
              <div className="w-full max-w-[710px] flex items-stretch justify-center">
                <EvaluationBar
                  score={evaluation}
                  isFlipped={boardOrientation === 'black'}
                />

                <div className="flex-1">
                  <ChessBoardContainer
                    game={displayGame}
                    boardOrientation={boardOrientation}
                    arrows={arrows}
                    onPlayerMove={handlePlayerMove}
                    isEngineThinking={isEngineThinking}
                    playerColor={settings.playerColor}
                    lastMove={currentLastMove}
                  />
                </div>
              </div>

              {/* Bottom Bar below Board: User Profile & Arrow Navigation */}
              <div className="w-full max-w-[710px] flex items-center justify-between pt-2 px-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-[#ede182] flex items-center justify-center text-xs font-bold text-zinc-950 shadow-sm">
                    K
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-xs">
                      karthick7204
                    </span>
                    <span className="text-sm">🇮🇳</span>
                  </div>

                  {/* Captured pieces by Player */}
                  <div className="flex items-center gap-0.5 ml-2 text-zinc-400 text-sm">
                    {coachCaptured.whiteCaptured.map((p, idx) => (
                      <span key={idx} className="leading-none text-zinc-300 opacity-85">
                        {PIECE_ICONS[p] || p}
                      </span>
                    ))}
                    {coachCaptured.materialAdvantage > 0 && (
                      <span className="text-[10px] font-bold text-zinc-400 ml-1">
                        +{coachCaptured.materialAdvantage}
                      </span>
                    )}
                  </div>
                </div>

                {/* Move Navigation Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewingIndex(0)}
                    disabled={viewingIndex === 0}
                    className="p-1 rounded bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Start (Home / ↑)"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewingIndex(idx => Math.max(0, idx - 1))}
                    disabled={viewingIndex === 0}
                    className="p-1 rounded bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Previous Move (←)"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewingIndex(idx => Math.min(fenHistoryRef.current.length - 1, idx + 1))}
                    disabled={isLivePosition}
                    className="p-1 rounded bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Next Move (→)"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewingIndex(fenHistoryRef.current.length - 1)}
                    disabled={isLivePosition}
                    className="p-1 rounded bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Live Move (End / ↓)"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>

                  {!isLivePosition && (
                    <button
                      onClick={() => setViewingIndex(fenHistoryRef.current.length - 1)}
                      className="ml-2 px-2.5 py-1 text-xs font-bold bg-[#81b64c] hover:bg-[#a3d160] text-white rounded transition shadow-sm"
                    >
                      Return to Live
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* VS COMPUTER MODE BOARD VIEW (Without Instructions) */
            <>
              {/* Top Bar above Board: Opponent Bot Profile */}
              <div className="w-full max-w-[710px] flex items-center justify-between pb-1.5 px-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-[#312e2b] border border-zinc-700/60 flex items-center justify-center text-base shadow-sm">
                    {vsBot.avatar}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-xs">
                      {vsBot.name} ({vsBot.rating})
                    </span>
                    <span className="text-[10px] bg-[#363430] text-zinc-300 px-1.5 py-0.2 rounded font-semibold">
                      Bot
                    </span>
                  </div>

                  {/* Captured pieces by Bot */}
                  <div className="flex items-center gap-0.5 ml-2 text-zinc-400 text-sm">
                    {(vsPlayerColor === 'w' ? vsCaptured.blackCaptured : vsCaptured.whiteCaptured).map((p, idx) => (
                      <span key={idx} className="leading-none text-white opacity-85">
                        {PIECE_ICONS[p] || p}
                      </span>
                    ))}
                  </div>
                </div>

                {vsIsEngineThinking && (
                  <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Thinking...
                  </span>
                )}
              </div>

              {/* Center: Evaluation Bar + Classic Brown Chessboard */}
              <div className="w-full max-w-[710px] flex items-stretch justify-center">
                <EvaluationBar
                  score={vsEvaluation}
                  isFlipped={vsBoardOrientation === 'black'}
                />

                <div className="flex-1">
                  <ChessBoardContainer
                    game={vsDisplayGame}
                    boardOrientation={vsBoardOrientation}
                    arrows={[]}
                    onPlayerMove={handleVsPlayerMove}
                    isEngineThinking={vsIsEngineThinking}
                    playerColor={vsPlayerColor}
                    lastMove={vsCurrentLastMove}
                  />
                </div>
              </div>

              {/* Bottom Bar below Board: User Profile & Arrow Navigation */}
              <div className="w-full max-w-[710px] flex items-center justify-between pt-2 px-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-[#ede182] flex items-center justify-center text-xs font-bold text-zinc-950 shadow-sm">
                    K
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-xs">
                      karthick7204
                    </span>
                    <span className="text-sm">🇮🇳</span>
                  </div>

                  {/* Captured pieces by Player */}
                  <div className="flex items-center gap-0.5 ml-2 text-zinc-400 text-sm">
                    {(vsPlayerColor === 'w' ? vsCaptured.whiteCaptured : vsCaptured.blackCaptured).map((p, idx) => (
                      <span key={idx} className="leading-none text-zinc-300 opacity-85">
                        {PIECE_ICONS[p] || p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Move Navigation Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setVsViewingIndex(0)}
                    disabled={vsViewingIndex === 0}
                    className="p-1 rounded bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Start (Home / ↑)"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setVsViewingIndex(idx => Math.max(0, idx - 1))}
                    disabled={vsViewingIndex === 0}
                    className="p-1 rounded bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Previous Move (←)"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setVsViewingIndex(idx => Math.min(vsFenHistoryRef.current.length - 1, idx + 1))}
                    disabled={isVsLivePosition}
                    className="p-1 rounded bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Next Move (→)"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setVsViewingIndex(vsFenHistoryRef.current.length - 1)}
                    disabled={isVsLivePosition}
                    className="p-1 rounded bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Live Move (End / ↓)"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>

                  {!isVsLivePosition && (
                    <button
                      onClick={() => setVsViewingIndex(vsFenHistoryRef.current.length - 1)}
                      className="ml-2 px-2.5 py-1 text-xs font-bold bg-[#81b64c] hover:bg-[#a3d160] text-white rounded transition shadow-sm"
                    >
                      Return to Live
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ========================================= */}
        {/* RIGHT SIDE: SIDE PANEL (5 Cols on xl)     */}
        {/* ========================================= */}
        <div className="xl:col-span-5 w-full h-[720px] xl:h-[786px] sticky top-4">
          {activeTab === 'coach' ? (
            <CoachPanel
              personality={currentPersonality}
              commentaries={commentaries}
              currentOpening={currentOpening}
              voiceEnabled={settings.voiceEnabled}
              onToggleVoice={() => setSettings(s => ({ ...s, voiceEnabled: !s.voiceEnabled }))}
              onTakeBack={handleTakeBack}
              onShowHint={handleShowHint}
              onResign={handleResign}
              onOpenSettings={() => setIsSettingsOpen(true)}
              canTakeBack={fenHistoryRef.current.length > 1}
              viewingIndex={viewingIndex}
              onSelectMoveIndex={idx => setViewingIndex(idx)}
            />
          ) : (
            <VsComputerPanel
              currentBot={vsBot}
              onSelectBot={bot => {
                setVsBot(bot);
                startNewVsGame(vsPlayerColor, bot);
              }}
              playerColor={vsPlayerColor}
              onChangePlayerColor={color => {
                setVsPlayerColor(color);
                startNewVsGame(color, vsBot);
              }}
              moves={vsMovesRecordRef.current}
              viewingIndex={vsViewingIndex}
              onSelectMoveIndex={idx => setVsViewingIndex(idx)}
              isEngineThinking={vsIsEngineThinking}
              isGameOver={vsGameOver.isOpen}
              turn={vsGame.turn()}
              isInCheck={vsGame.inCheck()}
              onNewGame={() => startNewVsGame()}
              onTakeBack={handleVsTakeBack}
              onResign={handleVsResign}
              onFlipBoard={() =>
                setVsBoardOrientation(ori => (ori === 'white' ? 'black' : 'white'))
              }
              canTakeBack={vsFenHistoryRef.current.length > 1}
            />
          )}
        </div>
      </main>

      {/* Settings Modal (Coach Mode) */}
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
        isOpen={activeTab === 'coach' ? gameOver.isOpen : vsGameOver.isOpen}
        winner={activeTab === 'coach' ? gameOver.winner : vsGameOver.winner}
        reason={activeTab === 'coach' ? gameOver.reason : vsGameOver.reason}
        commentaries={activeTab === 'coach' ? commentaries : []}
        opponentName={activeTab === 'coach' ? currentPersonality.name : vsBot.name}
        isVsMode={activeTab === 'vs-computer'}
        onPlayAgain={() => (activeTab === 'coach' ? startNewGame() : startNewVsGame())}
      />
    </div>
  );
};

export default App;
