import React from 'react';
import { CoachCommentary } from '../../types/chess';

interface MoveHistoryProps {
  commentaries: CoachCommentary[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ commentaries }) => {
  // Group moves by turn pairs: [ { moveNum: 1, white: commentary, black: commentary } ]
  const turns: { moveNum: number; white?: CoachCommentary; black?: CoachCommentary }[] = [];

  for (const c of commentaries) {
    let turn = turns.find(t => t.moveNum === c.moveNumber);
    if (!turn) {
      turn = { moveNum: c.moveNumber };
      turns.push(turn);
    }
    if (c.playerColor === 'w') {
      turn.white = c;
    } else {
      turn.black = c;
    }
  }

  const getQualityColor = (quality?: string) => {
    switch (quality) {
      case 'book': return 'text-blue-400';
      case 'best': return 'text-emerald-400 font-bold';
      case 'excellent': return 'text-teal-400';
      case 'good': return 'text-green-400';
      case 'inaccuracy': return 'text-yellow-400';
      case 'mistake': return 'text-orange-400';
      case 'blunder': return 'text-red-400 font-bold';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs max-h-40 overflow-y-auto">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-800 pb-1">
        Game Move History
      </div>

      {turns.length === 0 ? (
        <span className="text-slate-500 italic text-[11px]">No moves played yet</span>
      ) : (
        <div className="grid grid-cols-1 divide-y divide-slate-800/40">
          {turns.map(t => (
            <div key={t.moveNum} className="grid grid-cols-7 py-1 items-center">
              <span className="col-span-1 font-mono text-slate-500 font-semibold">
                {t.moveNum}.
              </span>

              {/* White move */}
              <div className="col-span-3 flex items-center gap-1.5 font-mono">
                {t.white ? (
                  <span className={`${getQualityColor(t.white.quality)}`}>
                    {t.white.san}
                  </span>
                ) : (
                  <span className="text-slate-600">...</span>
                )}
              </div>

              {/* Black move */}
              <div className="col-span-3 flex items-center gap-1.5 font-mono">
                {t.black ? (
                  <span className={`${getQualityColor(t.black.quality)}`}>
                    {t.black.san}
                  </span>
                ) : (
                  <span className="text-slate-600">...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
