import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw } from 'lucide-react';
import { CoachCommentary } from '../../types/chess';

interface GameOverModalProps {
  isOpen: boolean;
  winner: 'player' | 'coach' | 'draw' | null;
  reason: string;
  commentaries?: CoachCommentary[];
  opponentName?: string;
  isVsMode?: boolean;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  winner,
  reason,
  commentaries = [],
  opponentName = 'Computer',
  isVsMode = false,
  onPlayAgain
}) => {
  useEffect(() => {
    if (isOpen && winner === 'player') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen, winner]);

  if (!isOpen) return null;

  // Count player move qualities
  let bookCount = 0;
  let bestCount = 0;
  let blunderCount = 0;
  let mistakeCount = 0;

  for (const c of commentaries) {
    if (c.speaker === 'coach' && c.quality) {
      if (c.quality === 'book') bookCount++;
      if (c.quality === 'best' || c.quality === 'excellent') bestCount++;
      if (c.quality === 'blunder') blunderCount++;
      if (c.quality === 'mistake') mistakeCount++;
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-slate-700 bg-slate-800">
          {winner === 'player' ? '🏆' : winner === 'coach' ? '♟️' : '🤝'}
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          {winner === 'player'
            ? 'Victory! You Won!'
            : winner === 'coach'
            ? `${isVsMode ? opponentName : 'Coach'} Won the Game`
            : 'Game Drawn'}
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          {reason}
        </p>

        {/* Stats card (Only for Coach instructional mode with critiques) */}
        {!isVsMode && commentaries.length > 0 && (
          <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80 mb-5 text-xs grid grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="block font-bold text-emerald-400 text-sm">{bestCount}</span>
              <span className="text-[10px] text-slate-400">Best Moves</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="block font-bold text-blue-400 text-sm">{bookCount}</span>
              <span className="text-[10px] text-slate-400">Book Moves</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="block font-bold text-red-400 text-sm">{blunderCount}</span>
              <span className="text-[10px] text-slate-400">Blunders</span>
            </div>
          </div>
        )}

        <button
          onClick={onPlayAgain}
          className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 shadow-lg flex items-center justify-center gap-2 transition"
        >
          <RotateCcw className="w-4 h-4" />
          Play Another Game
        </button>
      </div>
    </div>
  );
};
