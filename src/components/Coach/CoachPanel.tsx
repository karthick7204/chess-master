import React, { useRef, useEffect } from 'react';
import { CoachCommentary, CoachPersonality, OpeningInfo } from '../../types/chess';
import { CommentaryBubble } from './CommentaryBubble';
import { Volume2, VolumeX, Pause, Play, Undo2, Lightbulb, ShieldAlert, Sparkles, Compass, Award } from 'lucide-react';

interface CoachPanelProps {
  personality: CoachPersonality;
  commentaries: CoachCommentary[];
  currentOpening: OpeningInfo | null;
  voiceEnabled: boolean;
  isAudioPaused: boolean;
  isAudioPlaying: boolean;
  onToggleVoice: () => void;
  onTogglePause: () => void;
  onTakeBack: () => void;
  onShowHint: () => void;
  onShowThreat: () => void;
  onPreviewMove?: (from: string, to: string) => void;
  canTakeBack: boolean;
}

export const CoachPanel: React.FC<CoachPanelProps> = ({
  personality,
  commentaries,
  currentOpening,
  voiceEnabled,
  isAudioPaused,
  isAudioPlaying,
  onToggleVoice,
  onTogglePause,
  onTakeBack,
  onShowHint,
  onShowThreat,
  onPreviewMove,
  canTakeBack
}) => {
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commentaries]);

  const latestCommentary = commentaries[commentaries.length - 1];

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
      {/* Coach Header Profile */}
      <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-sky-500/10 border-2 border-sky-400/40 flex items-center justify-center text-2xl shadow-inner">
              {personality.avatar}
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-white text-base leading-tight">
                {personality.name}
              </h3>
              {/* Coach Rating Badge */}
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-sm">
                <Award className="w-3 h-3 text-amber-400" />
                Rating: {personality.rating} ELO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {personality.title}
            </p>
          </div>
        </div>

        {/* Audio Controls: Pause/Resume + Mute/Unmute */}
        <div className="flex items-center gap-1.5">
          {voiceEnabled && (
            <button
              onClick={onTogglePause}
              disabled={!isAudioPlaying && !isAudioPaused}
              title={isAudioPaused ? "Resume Audio" : "Pause Audio"}
              className={`p-2 rounded-lg border transition ${
                isAudioPaused
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                  : isAudioPlaying
                  ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 hover:bg-sky-500/30 animate-pulse'
                  : 'bg-slate-800/60 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
              }`}
            >
              {isAudioPaused ? <Play className="w-4 h-4 fill-amber-300" /> : <Pause className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={onToggleVoice}
            title={voiceEnabled ? "Mute Coach Voice" : "Enable Coach Voice"}
            className={`p-2 rounded-lg border transition ${
              voiceEnabled
                ? 'bg-sky-500/15 border-sky-500/30 text-sky-400 hover:bg-sky-500/25'
                : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Opening Explorer Card */}
      {currentOpening && (
        <div className="p-3 mx-4 mt-3 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5 font-bold text-indigo-300">
              <Compass className="w-3.5 h-3.5" />
              {currentOpening.name}
            </span>
            <span className="font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              {currentOpening.eco}
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            {currentOpening.description}
          </p>
        </div>
      )}

      {/* Interactive Quick Actions Bar */}
      <div className="p-3 mx-4 mt-2 flex items-center gap-2 border-b border-slate-800/80 pb-3">
        <button
          onClick={onTakeBack}
          disabled={!canTakeBack}
          className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition"
        >
          <Undo2 className="w-3.5 h-3.5" />
          Take Back
        </button>

        <button
          onClick={onShowHint}
          className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1.5 transition"
        >
          <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
          Best Move
        </button>

        <button
          onClick={onShowThreat}
          className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-500/30 flex items-center justify-center gap-1.5 transition"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          Threat
        </button>
      </div>

      {/* Commentary Stream Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {commentaries.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <Sparkles className="w-8 h-8 mb-2 text-sky-400/50 animate-bounce" />
            <p className="text-sm font-semibold text-slate-300 mb-1">Coach is ready!</p>
            <p className="text-xs text-slate-400 max-w-xs">
              Make your opening move on the board. I will identify your opening, critique every move, and explain the strategy behind each of mine.
            </p>
          </div>
        ) : (
          commentaries.map(item => (
            <CommentaryBubble
              key={item.id}
              commentary={item}
              onPreviewMove={onPreviewMove}
            />
          ))
        )}
        <div ref={feedEndRef} />
      </div>

      {/* Bottom Status: Clean Move Progress (Removed 'Real-time Engine Active') */}
      <div className="p-2.5 bg-slate-950/70 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="text-slate-400">
          {latestCommentary ? `Last move: ${latestCommentary.san}` : 'Game in progress'}
        </span>
        {latestCommentary && (
          <span className="font-mono text-slate-500 font-semibold">
            Turn #{latestCommentary.moveNumber}
          </span>
        )}
      </div>
    </div>
  );
};
