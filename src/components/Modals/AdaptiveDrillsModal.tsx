import React, { useState, useEffect } from 'react';
import { Chess, Square, PieceSymbol } from 'chess.js';
import { InteractiveDrill, WeaknessCategory } from '../../types/learning';
import { COACH_DRILLS } from '../../data/coachDrills';
import { AdaptiveCoachService } from '../../services/adaptiveCoachService';
import { ChessBoardContainer } from '../Board/ChessBoardContainer';
import { SoundService } from '../../services/soundService';
import { BoardArrow } from '../../types/chess';
import {
  X,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AdaptiveDrillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: WeaknessCategory;
}

export const AdaptiveDrillsModal: React.FC<AdaptiveDrillsModalProps> = ({
  isOpen,
  onClose,
  initialCategory
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WeaknessCategory>(
    initialCategory || AdaptiveCoachService.getPrimaryWeakness().category
  );

  const categoryDrills = COACH_DRILLS.filter(d => d.category === selectedCategory);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const activeDrill: InteractiveDrill = categoryDrills[currentDrillIndex] || categoryDrills[0] || COACH_DRILLS[0];

  const [drillGame, setDrillGame] = useState<Chess>(new Chess(activeDrill.fen));
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [drillArrows, setDrillArrows] = useState<BoardArrow[]>([]);

  // Reset board whenever active drill changes
  useEffect(() => {
    if (activeDrill) {
      setDrillGame(new Chess(activeDrill.fen));
      setFeedback('idle');
      setShowHint(false);
      setDrillArrows([]);
    }
  }, [activeDrill]);

  if (!isOpen) return null;

  const handlePlayerMove = (from: Square, to: Square, promotion?: PieceSymbol): boolean => {
    if (feedback === 'success') return false;

    const gameCopy = new Chess(drillGame.fen());
    const move = gameCopy.move({ from, to, promotion: promotion || 'q' });

    if (!move) return false;

    // Check if move matches expected solution
    const isCorrect = from === activeDrill.expectedMove.from && to === activeDrill.expectedMove.to;

    if (isCorrect) {
      setDrillGame(gameCopy);
      setFeedback('success');
      SoundService.playCheck();
      AdaptiveCoachService.markDrillSolved(activeDrill.id);
      setDrillArrows([
        { from, to, color: '#22c55e' }
      ]);
      return true;
    } else {
      // Wrong move - show momentary feedback and revert
      setFeedback('wrong');
      SoundService.playMove();
      setTimeout(() => {
        setDrillGame(new Chess(activeDrill.fen));
      }, 700);
      return false;
    }
  };

  const handleShowHint = () => {
    setShowHint(true);
    setDrillArrows([
      { from: activeDrill.expectedMove.from, to: activeDrill.expectedMove.to, color: '#81b64c' }
    ]);
  };

  const handleReset = () => {
    setDrillGame(new Chess(activeDrill.fen));
    setFeedback('idle');
    setShowHint(false);
    setDrillArrows([]);
  };

  const handleNextDrill = () => {
    const nextIdx = (currentDrillIndex + 1) % categoryDrills.length;
    setCurrentDrillIndex(nextIdx);
  };

  const categories: { key: WeaknessCategory; label: string; icon: string }[] = [
    { key: 'piece_safety', label: 'Piece Safety', icon: '🛡️' },
    { key: 'forks_tactics', label: 'Forks & Tactics', icon: '⚔️' },
    { key: 'middlegame_planning', label: 'Middlegame Planning', icon: '🗺️' },
    { key: 'mating_patterns', label: 'Mating Patterns', icon: '👑' },
    { key: 'endgame_technique', label: 'Endgame Technique', icon: '🏰' }
  ];

  const primaryWeakness = AdaptiveCoachService.getPrimaryWeakness();
  const profile = AdaptiveCoachService.getProfile();
  const isSolved = profile.solvedDrills.includes(activeDrill.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[#21201d] border border-[#312e2b] rounded-2xl max-w-4xl w-full p-4 md:p-6 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#312e2b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#81b64c]/20 border border-[#81b64c]/40 flex items-center justify-center text-[#81b64c]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Coach Academy • Adaptive Lessons
              </h2>
              <p className="text-xs text-zinc-400">
                Personalized practice drills tailored to your game weaknesses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#312e2b] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostic Banner */}
        <div className="mt-3 p-2.5 rounded-xl bg-[#262522] border border-[#363430] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-zinc-300">
              <strong className="text-white">AI Coach Recommendation:</strong> Your current primary focus is{' '}
              <span className="text-[#81b64c] font-semibold">{primaryWeakness.title}</span> ({primaryWeakness.count} errors detected).
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
            {profile.solvedDrills.length}/{COACH_DRILLS.length} Completed
          </span>
        </div>

        {/* Category Pills */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.key;
            const isFocus = primaryWeakness.category === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setSelectedCategory(cat.key);
                  setCurrentDrillIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#81b64c] text-white shadow-sm'
                    : 'bg-[#2b2926] text-zinc-400 hover:text-zinc-200 hover:bg-[#363430]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {isFocus && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" title="Current Focus Area" />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Drill Content: 2-Column Split */}
        <div className="mt-4 flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 items-start overflow-y-auto">
          {/* Left Column: Interactive Mini Board (7 cols) */}
          <div className="md:col-span-7 flex flex-col items-center">
            <div className="w-full max-w-[420px] aspect-square rounded-lg overflow-hidden border border-black/40 shadow-xl">
              <ChessBoardContainer
                game={drillGame}
                boardOrientation={activeDrill.playerColor}
                arrows={drillArrows}
                onPlayerMove={handlePlayerMove}
                isEngineThinking={false}
                playerColor="w"
              />
            </div>

            <div className="mt-2 text-[11px] text-zinc-400 flex items-center justify-between w-full max-w-[420px] px-1">
              <span>White to move</span>
              <span>Find the best pedagogical continuation</span>
            </div>
          </div>

          {/* Right Column: Concept Lesson & Interactive Controls (5 cols) */}
          <div className="md:col-span-5 flex flex-col space-y-3.5">
            {/* Exercise Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#81b64c]">
                  {activeDrill.subtitle}
                </span>
                {isSolved && (
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">{activeDrill.title}</h3>
            </div>

            {/* Concept Lesson Card */}
            <div className="p-3 rounded-xl bg-[#262522] border border-[#363430] text-xs text-zinc-300 leading-relaxed">
              <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                <span>🎓</span>
                <span>Coach Lesson:</span>
              </div>
              <p>{activeDrill.conceptLesson}</p>
            </div>

            {/* Real-time Feedback State */}
            {feedback === 'success' && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-600/60 text-emerald-200 text-xs flex items-start gap-2 shadow-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-300 mb-0.5">Correct Solution!</div>
                  <p>{activeDrill.explanationOnSuccess}</p>
                </div>
              </div>
            )}

            {feedback === 'wrong' && (
              <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-red-300 mb-0.5">Not the best move!</div>
                  <p>That move does not solve the tactical or strategic requirement. Give it another try!</p>
                </div>
              </div>
            )}

            {showHint && (
              <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-800 text-amber-200 text-xs flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>{activeDrill.hint}</p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleShowHint}
                className="flex-1 py-2 px-3 rounded-lg bg-[#2b2926] hover:bg-[#363430] text-zinc-300 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Hint</span>
              </button>

              <button
                onClick={handleReset}
                className="p-2 rounded-lg bg-[#2b2926] hover:bg-[#363430] text-zinc-300 transition"
                title="Reset Position"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleNextDrill}
                className="flex-1 py-2 px-3 rounded-lg bg-[#81b64c] hover:bg-[#73a343] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Next Drill</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
