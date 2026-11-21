import React from 'react';

interface EvaluationBarProps {
  score: number; // Centipawns from White's perspective (+100 is +1 pawn)
  isFlipped: boolean;
}

export const EvaluationBar: React.FC<EvaluationBarProps> = ({
  score,
  isFlipped
}) => {
  // Clamp score between -1000 and +1000 centipawns
  const clamped = Math.max(-1000, Math.min(1000, score));
  const whitePercent = 50 + (clamped / 1000) * 45;
  const blackPercent = 100 - whitePercent;

  const topPercent = isFlipped ? whitePercent : blackPercent;
  const bottomPercent = isFlipped ? blackPercent : whitePercent;

  // Format absolute numeric score e.g. "1.5" or "0.0"
  const formattedScore = Math.abs(score / 100).toFixed(1);

  return (
    <div className="relative w-6 h-full min-h-[540px] bg-[#312e2b] overflow-hidden flex flex-col rounded-l-[4px] border border-black/40 shadow-inner select-none">
      {/* Top Section */}
      <div
        className={`w-full transition-all duration-300 flex items-start justify-center pt-1.5 ${
          isFlipped ? 'bg-white text-zinc-900' : 'bg-[#312e2b] text-zinc-100'
        }`}
        style={{ height: `${topPercent}%` }}
      >
        {((!isFlipped && score < -30) || (isFlipped && score > 30)) && (
          <span className="text-[10px] font-bold font-mono px-0.5 leading-none">
            {formattedScore}
          </span>
        )}
      </div>

      {/* Center Divider Line */}
      <div className="w-full h-[1px] bg-zinc-600/50 z-10" />

      {/* Bottom Section */}
      <div
        className={`w-full transition-all duration-300 flex items-end justify-center pb-1.5 ${
          isFlipped ? 'bg-[#312e2b] text-zinc-100' : 'bg-white text-zinc-900'
        }`}
        style={{ height: `${bottomPercent}%` }}
      >
        {((!isFlipped && score >= -30) || (isFlipped && score <= 30)) && (
          <span className="text-[10px] font-bold font-mono px-0.5 leading-none">
            {formattedScore}
          </span>
        )}
      </div>
    </div>
  );
};
