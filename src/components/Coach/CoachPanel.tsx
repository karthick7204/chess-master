import React from 'react';
import { CoachCommentary, CoachPersonality, OpeningInfo, MoveQuality } from '../../types/chess';
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
  onOpenDrills?: () => void;
  learningFocusTitle?: string;
  currentPhase?: 'opening' | 'middlegame' | 'endgame';
  onOpenMasterclass?: (phase?: 'opening' | 'middlegame' | 'endgame') => void;
}

const renderQualityBadge = (quality?: MoveQuality) => {
  if (!quality || quality === 'good') return null;
  let bg = '';
  let text = '';
  switch (quality) {
    case 'book':
      bg = 'bg-blue-600 text-white';
      text = '📖';
      break;
    case 'best':
      bg = 'bg-[#81b64c] text-white';
      text = '★';
      break;
    case 'excellent':
      bg = 'bg-[#5c8bb0] text-white';
      text = '!';
      break;
    case 'inaccuracy':
      bg = 'bg-[#f7c044] text-zinc-950';
      text = '?!';
      break;
    case 'mistake':
      bg = 'bg-[#e58f2a] text-white';
      text = '?';
      break;
    case 'blunder':
      bg = 'bg-[#ca3431] text-white';
      text = '??';
      break;
    default:
      return null;
  }
  return (
    <span
      className={`inline-flex items-center justify-center text-[9px] font-black px-1 py-0.5 rounded leading-none ml-1.5 shadow-xs ${bg}`}
    >
      {text}
    </span>
  );
};

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
  onSelectMoveIndex,
  onOpenDrills,
  learningFocusTitle = 'Piece Safety',
  currentPhase = 'opening',
  onOpenMasterclass
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
  const movePairs: {
    moveNum: number;
    whiteIndex: number;
    whiteSan?: string;
    whiteQuality?: MoveQuality;
    blackIndex?: number;
    blackSan?: string;
    blackQuality?: MoveQuality;
  }[] = [];

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
      pair.whiteQuality = c.quality;
    } else {
      pair.blackIndex = i + 1; // FEN index
      pair.blackSan = c.san;
      pair.blackQuality = c.quality;
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
      <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-3">
        {/* Phase Coach Navigation Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-[#1a1917] rounded-xl border border-[#2d2b27] text-xs">
          <button
            onClick={() => onOpenMasterclass?.('opening')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition ${
              currentPhase === 'opening'
                ? 'bg-[#81b64c] text-white shadow-sm ring-1 ring-white/20'
                : 'text-zinc-400 hover:text-white hover:bg-[#282723]'
            }`}
            title="Opening Coach: Principles, Openings & Traps"
          >
            <span>♟️</span>
            <span>Opening</span>
          </button>

          <button
            onClick={() => onOpenMasterclass?.('middlegame')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition ${
              currentPhase === 'middlegame'
                ? 'bg-amber-600 text-white shadow-sm ring-1 ring-white/20'
                : 'text-zinc-400 hover:text-white hover:bg-[#282723]'
            }`}
            title="Middlegame Coach: Positional Strategy, Weaknesses & Plans"
          >
            <span>⚔️</span>
            <span>Middlegame</span>
          </button>

          <button
            onClick={() => onOpenMasterclass?.('endgame')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition ${
              currentPhase === 'endgame'
                ? 'bg-sky-600 text-white shadow-sm ring-1 ring-white/20'
                : 'text-zinc-400 hover:text-white hover:bg-[#282723]'
            }`}
            title="Endgame Coach: King Activity, Pawns & Opposition"
          >
            <span>👑</span>
            <span>Endgame</span>
          </button>
        </div>

        {/* Adaptive Coach Recommendation Banner */}
        {onOpenDrills && (
          <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#282723] border border-[#383631] text-[11px] shadow-sm">
            <div className="flex items-center gap-1.5 text-zinc-300 min-w-0">
              <span className="text-amber-400 shrink-0">💡</span>
              <span className="truncate">
                Focus: <strong className="text-white font-semibold">{learningFocusTitle}</strong>
              </span>
            </div>
            <button
              onClick={onOpenDrills}
              className="text-[#81b64c] hover:text-[#9cd363] font-bold text-xs shrink-0 ml-2 transition flex items-center gap-0.5"
            >
              <span>Practice Drills</span>
              <span>↗</span>
            </button>
          </div>
        )}

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
                  <span className="font-bold text-zinc-950 block mb-0.5">{latestPlayerCritique.title}</span>
                  {latestPlayerCritique.explanation}
                </p>

                {/* 5-Point Pedagogical Mistake Breakdown Card */}
                {latestPlayerCritique.mistakeBreakdown && (
                  <div className="mt-2.5 pt-2 border-t border-zinc-200/80 space-y-1.5 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70 text-zinc-900">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center justify-between border-b border-amber-200/60 pb-1">
                      <span>Coach Analysis Breakdown</span>
                      <span className="text-[9px] bg-amber-200/70 text-amber-950 px-1.5 py-0.2 rounded font-semibold uppercase">
                        {latestPlayerCritique.quality}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] leading-snug pt-0.5">
                      <div className="flex items-start gap-1.5">
                        <span className="font-bold text-zinc-900 shrink-0">Played:</span>
                        <span className="text-zinc-800">{latestPlayerCritique.mistakeBreakdown.playedMove}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="font-bold text-emerald-800 shrink-0">Best Move:</span>
                        <span className="text-emerald-950 font-semibold">{latestPlayerCritique.mistakeBreakdown.bestMove}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="font-bold text-red-800 shrink-0">Why Bad:</span>
                        <span className="text-zinc-800">{latestPlayerCritique.mistakeBreakdown.whyBad}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="font-bold text-amber-900 shrink-0">Opponent Response:</span>
                        <span className="text-zinc-800">{latestPlayerCritique.mistakeBreakdown.opponentResponse}</span>
                      </div>
                      <div className="flex items-start gap-1.5 pt-1 border-t border-amber-200/40">
                        <span className="font-bold text-blue-900 shrink-0">How to Avoid:</span>
                        <span className="text-zinc-800">{latestPlayerCritique.mistakeBreakdown.howToAvoid}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Better Candidate Options Section with Color Badges matching Arrows */}
                {latestPlayerCritique.candidateOptions && latestPlayerCritique.candidateOptions.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-zinc-200/80 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 flex items-center justify-between">
                      <span>{latestPlayerCritique.quality === 'best' ? 'Other Strong Continuations:' : 'Stronger Alternatives on Board:'}</span>
                      <span className="text-[9px] text-zinc-400 font-normal">Check arrows ↗</span>
                    </div>

                    <div className="space-y-1.5">
                      {latestPlayerCritique.candidateOptions.map((opt, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-1.5 rounded-lg bg-zinc-50 border border-zinc-200/60"
                        >
                          <span
                            className="inline-block w-3 h-3 rounded-full shrink-0 mt-0.5 shadow-sm"
                            style={{ backgroundColor: opt.arrowColor }}
                            title={`Arrow color on board: ${opt.arrowColor}`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-zinc-950 font-mono text-xs">
                                {opt.san}
                              </span>
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                                  opt.badge === 'best'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-sky-100 text-sky-800'
                                }`}
                              >
                                {opt.badge === 'best' ? 'Best Move' : 'Alternative'}
                              </span>
                              {opt.scoreDisplay && (
                                <span className="text-[10px] text-zinc-400 ml-auto font-mono">
                                  {opt.scoreDisplay}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-600 leading-normal mt-0.5">
                              {opt.reason}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {latestPlayerCritique.threatExplanation && (
                  <p className="mt-2 text-red-600 font-semibold text-[11px]">
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
                      className={`col-span-3 text-left px-1.5 py-0.5 rounded transition flex items-center justify-between ${
                        viewingIndex === p.whiteIndex
                          ? 'bg-[#3d3a36] text-amber-300 font-bold'
                          : 'text-zinc-200 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{p.whiteSan || ''}</span>
                      {renderQualityBadge(p.whiteQuality)}
                    </button>

                    {/* Black Move */}
                    {p.blackSan ? (
                      <button
                        onClick={() => onSelectMoveIndex(p.blackIndex!)}
                        className={`col-span-3 text-left px-1.5 py-0.5 rounded transition flex items-center justify-between ${
                          viewingIndex === p.blackIndex
                            ? 'bg-[#3d3a36] text-amber-300 font-bold'
                            : 'text-zinc-200 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{p.blackSan}</span>
                        {renderQualityBadge(p.blackQuality)}
                      </button>
                    ) : (
                      <span className="col-span-3 text-zinc-600 px-1.5">...</span>
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
