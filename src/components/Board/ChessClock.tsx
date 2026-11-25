import React from 'react';
import { Timer, AlertTriangle } from 'lucide-react';

interface ChessClockProps {
  timeRemaining: number; // in seconds (can be fractional like 9.4)
  isActive: boolean; // is it currently this player's turn to move?
  isUnlimited?: boolean;
  playerName?: string;
  className?: string;
}

export const ChessClock: React.FC<ChessClockProps> = ({
  timeRemaining,
  isActive,
  isUnlimited = false,
  playerName,
  className = ''
}) => {
  if (isUnlimited) {
    return (
      <div
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#181715] border border-zinc-800 text-zinc-500 text-xs font-mono font-medium ${className}`}
        title="Unlimited Time (Casual match)"
      >
        <span className="text-sm leading-none">♾️</span>
        <span className="text-[11px]">Untimed</span>
      </div>
    );
  }

  const safeTime = Math.max(0, timeRemaining);
  const minutes = Math.floor(safeTime / 60);
  const seconds = Math.floor(safeTime % 60);
  const tenths = Math.floor((safeTime * 10) % 10);

  const isLowTime = safeTime <= 30;
  const isCriticalTime = safeTime <= 10;

  let displayString = '';
  if (safeTime >= 60) {
    displayString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  } else if (safeTime >= 10) {
    displayString = `0:${String(seconds).padStart(2, '0')}`;
  } else {
    displayString = `0:0${seconds}.${tenths}`;
  }

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono font-bold transition-all duration-150 select-none ${
        isCriticalTime
          ? 'bg-red-950/60 border-2 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse'
          : isLowTime
          ? 'bg-amber-950/40 border border-amber-500/60 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
          : isActive
          ? 'bg-[#262522] border-2 border-[#81b64c] text-white shadow-[0_0_12px_rgba(129,182,76,0.3)] ring-1 ring-[#81b64c]/40'
          : 'bg-[#181715] border border-zinc-800 text-zinc-400 opacity-80'
      } ${className}`}
      title={`${playerName || 'Player'} Clock: ${displayString}`}
    >
      <Timer
        className={`w-3.5 h-3.5 ${
          isActive ? (isCriticalTime ? 'text-red-400 animate-spin' : 'text-[#81b64c]') : 'text-zinc-500'
        }`}
      />
      <span className={`tracking-tight ${safeTime < 10 ? 'text-sm font-extrabold' : 'text-sm'}`}>
        {displayString}
      </span>
      {isCriticalTime && (
        <AlertTriangle className="w-3 h-3 text-red-400" />
      )}
    </div>
  );
};
