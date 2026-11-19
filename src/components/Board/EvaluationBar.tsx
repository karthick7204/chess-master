import React from 'react';

interface EvaluationBarProps {
  score: number; // Centipawns from White's perspective (+100 is +1 pawn)
  scoreDisplay: string;
  isFlipped: boolean;
}

export const EvaluationBar: React.FC<EvaluationBarProps> = ({
  score,
  scoreDisplay,
  isFlipped
}) => {
  // Clamp score between -1000 and +1000 centipawns for bar visualization
  const clamped = Math.max(-1000, Math.min(1000, score));
  // Convert -1000..+1000 to 0..100 percentage for White
  // 0 centipawns = 50%
  const whitePercent = 50 + (clamped / 1000) * 45;
  const blackPercent = 100 - whitePercent;

  const topPercent = isFlipped ? whitePercent : blackPercent;
  const bottomPercent = isFlipped ? blackPercent : whitePercent;

  return (
    <div className="relative w-7 h-full min-h-[460px] bg-slate-900 rounded-lg overflow-hidden flex flex-col border border-slate-800 shadow-inner select-none">
      {/* Top Section */}
      <div
        className={`w-full transition-all duration-500 flex items-start justify-center pt-2 ${
          isFlipped ? 'bg-slate-100 text-slate-900' : 'bg-slate-900 text-slate-200'
        }`}
        style={{ height: `${topPercent}%` }}
      >
        {!isFlipped && score < -50 && (
          <span className="text-[11px] font-bold font-mono px-0.5">
            {scoreDisplay}
          </span>
        )}
        {isFlipped && score > 50 && (
          <span className="text-[11px] font-bold font-mono px-0.5">
            {scoreDisplay}
          </span>
        )}
      </div>

      {/* Center Divider Line */}
      <div className="w-full h-[1px] bg-emerald-500/40 z-10" />

      {/* Bottom Section */}
      <div
        className={`w-full transition-all duration-500 flex items-end justify-center pb-2 ${
          isFlipped ? 'bg-slate-900 text-slate-200' : 'bg-slate-100 text-slate-900'
        }`}
        style={{ height: `${bottomPercent}%` }}
      >
        {!isFlipped && score >= -50 && (
          <span className="text-[11px] font-bold font-mono px-0.5">
            {scoreDisplay}
          </span>
        )}
        {isFlipped && score <= 50 && (
          <span className="text-[11px] font-bold font-mono px-0.5">
            {scoreDisplay}
          </span>
        )}
      </div>
    </div>
  );
};
