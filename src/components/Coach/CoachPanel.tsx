import React from 'react';
import { CoachCommentary, CoachPersonality, OpeningInfo } from '../../types/chess';
import { Volume2, VolumeX, Flag, Lightbulb, Undo2, Share2, Download, Settings, BookOpen, Info } from 'lucide-react';

interface CoachPanelProps {
  personality: CoachPersonality;
  commentaries: CoachCommentary[];
  currentOpening: OpeningInfo | null;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onTakeBack: () => void;
  onShowHint: () => void;
  onResign: () => void;
  onOpenSettings: () => void;
  canTakeBack: boolean;
  viewingIndex: number;
  onSelectMoveIndex: (index: number) => void;
}

export const CoachPanel: React.FC<CoachPanelProps> = ({
  personality,
  commentaries,
  currentOpening,
  voiceEnabled,
  onToggleVoice,
  onTakeBack,
  onShowHint,
  onResign,
  onOpenSettings,
  canTakeBack,
  viewingIndex,
  onSelectMoveIndex
}) => {
  // Extract latest Coach move speech and latest Player move critique
  let latestCoachComment: CoachCommentary | null = null;
  let latestPlayerCritique: CoachCommentary | null = null;

  for (let i = commentaries.length - 1; i >= 0; i--) {
    const c = commentaries[i];
    if (!latestPlayerCritique && c.quality !== undefined) {
      latestPlayerCritique = c;
    }
    if (!latestCoachComment && c.quality === undefined) {
      latestCoachComment = c;
    }
    if (latestCoachComment && latestPlayerCritique) break;
  }

  // Group moves into pairs (1. d4 e6 ...) for the move notation table
  const movePairs: { moveNum: number; whiteIndex: number; whiteSan?: string; blackIndex?: number; blackSan?: string }[] = [];
  for (let i = 0; i < commentaries.length; i++) {
    const c = commentaries[i];
    const turnNum = c.moveNumber;
    let pair = movePairs.find(p => p.moveNum === turnNum);
    if (!pair) {
      pair = { moveNum: turnNum, whiteIndex: i };
      movePairs.push(pair);
    }
    if (c.playerColor === 'w') {
      pair.whiteIndex = i + 1; // FEN index
      pair.whiteSan = c.san;
    } else {
      pair.blackIndex = i + 1; // FEN index
      pair.blackSan = c.san;
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#21201d] text-white rounded-lg overflow-hidden shadow-2xl border border-[#312e2b] select-none">
      {/* Top Header: "Play Coach" centered + Volume Toggle */}
      <div className="px-4 py-3 border-b border-[#2b2926] flex items-center justify-between relative bg-[#21201d]">
        <div className="w-6" /> {/* Spacer */}
        <h2 className="font-bold text-sm tracking-wide text-zinc-100 uppercase text-center flex-1">
          Play Coach
        </h2>
        <button
          onClick={onToggleVoice}
          title={voiceEnabled ? "Mute Voice (Spacebar skips)" : "Enable Voice"}
          className="text-zinc-400 hover:text-white p-1 rounded transition"
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4 text-zinc-300" /> : <VolumeX className="w-4 h-4 text-zinc-600" />}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
        {/* Coach Speech Section (Matching Screenshot) */}
        <div className="flex items-start gap-3">
          {/* Coach Avatar */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full bg-[#312e2b] border border-zinc-700/60 overflow-hidden flex items-center justify-center text-3xl shadow-md">
              {personality.avatar}
            </div>
          </div>

          {/* Chat Bubbles */}
          <div className="flex-1 flex flex-col gap-2.5 min-w-0">
            {/* Bubble 1: Coach's own move explanation */}
            {latestCoachComment ? (
              <div className="relative bg-white text-zinc-900 rounded-2xl p-3 shadow-md text-xs leading-relaxed font-medium">
                {/* Speech Bubble Arrow Tail */}
                <div className="absolute top-3 -left-1.5 w-3 h-3 bg-white transform rotate-45" />
                <p>{latestCoachComment.explanation}</p>
              </div>
            ) : (
              <div className="relative bg-white text-zinc-900 rounded-2xl p-3 shadow-md text-xs leading-relaxed font-medium">
                <div className="absolute top-3 -left-1.5 w-3 h-3 bg-white transform rotate-45" />
                <p>Hello! I am {personality.name}. Make your first move to begin the game!</p>
              </div>
            )}

            {/* Bubble 2: Coach's critique on player's move */}
            {latestPlayerCritique && (
              <div className="relative bg-white text-zinc-900 rounded-2xl p-3 shadow-md text-xs leading-relaxed font-medium">
                <div className="absolute top-3 -left-1.5 w-3 h-3 bg-white transform rotate-45" />
                <p>
                  <span className="font-bold text-zinc-950 block mb-0.5">{latestPlayerCritique.title}:</span>
                  {latestPlayerCritique.explanation}
                </p>
                {latestPlayerCritique.threatExplanation && (
                  <p className="mt-1.5 text-red-600 font-semibold text-[11px]">
                    ⚠️ {latestPlayerCritique.threatExplanation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#2b2926] pt-3">
          {/* Opening Title Row */}
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 px-1">
            <span className="font-semibold text-zinc-300 truncate">
              {currentOpening ? `${currentOpening.name}` : "Opening Phase"}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-zinc-400 hover:text-white cursor-pointer" />
              <Info className="w-3.5 h-3.5 text-zinc-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Move Notation Table (Chess.com Style) */}
          <div className="bg-[#1e1d1a] rounded-lg p-2.5 max-h-80 overflow-y-auto text-xs font-mono border border-[#2b2926]">
            {movePairs.length === 0 ? (
              <div className="text-zinc-600 italic py-2 text-center text-[11px]">
                Moves will appear here
              </div>
            ) : (
              <div className="space-y-1">
                {movePairs.map(p => (
                  <div key={p.moveNum} className="grid grid-cols-7 py-0.5 px-1 rounded hover:bg-[#2b2926]/60">
                    <span className="col-span-1 text-zinc-500 font-bold">
                      {p.moveNum}.
                    </span>

                    {/* White Move */}
                    <button
                      onClick={() => onSelectMoveIndex(p.whiteIndex)}
                      className={`col-span-3 text-left px-1 rounded transition ${
                        viewingIndex === p.whiteIndex
                          ? 'bg-[#3d3a36] text-amber-300 font-bold'
                          : 'text-zinc-200 hover:text-white'
                      }`}
                    >
                      {p.whiteSan || ''}
                    </button>

                    {/* Black Move */}
                    {p.blackSan ? (
                      <button
                        onClick={() => onSelectMoveIndex(p.blackIndex!)}
                        className={`col-span-3 text-left px-1 rounded transition ${
                          viewingIndex === p.blackIndex
                            ? 'bg-[#3d3a36] text-amber-300 font-bold'
                            : 'text-zinc-200 hover:text-white'
                        }`}
                      >
                        {p.blackSan}
                      </button>
                    ) : (
                      <span className="col-span-3 text-zinc-600">...</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar (3 Big Iconic Chess.com Buttons) */}
      <div className="p-3 bg-[#262522] border-t border-[#2b2926]">
        <div className="grid grid-cols-3 gap-2 mb-2.5">
          {/* Resign Flag Button */}
          <button
            onClick={onResign}
            title="Resign Game"
            className="h-11 rounded-lg bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-400 hover:text-white flex items-center justify-center transition border border-[#363430]"
          >
            <Flag className="w-5 h-5 fill-current" />
          </button>

          {/* Big Green Hint Button */}
          <button
            onClick={onShowHint}
            title="Get Best Move Hint"
            className="h-11 rounded-lg bg-[#81b64c] hover:bg-[#a3d160] text-white flex items-center justify-center transition shadow-md shadow-[#81b64c]/20"
          >
            <Lightbulb className="w-5 h-5 fill-current" />
          </button>

          {/* Undo / Take Back Button */}
          <button
            onClick={onTakeBack}
            disabled={!canTakeBack}
            title="Take Back Move"
            className="h-11 rounded-lg bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-400 hover:text-white flex items-center justify-center transition border border-[#363430] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Undo2 className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Utility Bar: Share, Download, Settings + Spacebar hint */}
        <div className="flex items-center justify-between px-1 text-zinc-500 text-xs">
          <div className="flex items-center gap-3">
            <button title="Share Game" className="hover:text-zinc-300 transition">
              <Share2 className="w-4 h-4" />
            </button>
            <button title="Export PGN" className="hover:text-zinc-300 transition">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={onOpenSettings} title="Settings" className="hover:text-zinc-300 transition">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <span className="text-[10px] text-zinc-500 font-mono">
            [Space] skip voice
          </span>
        </div>
      </div>
    </div>
  );
};
