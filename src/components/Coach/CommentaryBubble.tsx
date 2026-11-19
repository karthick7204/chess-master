import React from 'react';
import { CoachCommentary, MoveQuality } from '../../types/chess';
import { Volume2, BookOpen, AlertTriangle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { VoiceService } from '../../services/voiceService';

interface CommentaryBubbleProps {
  commentary: CoachCommentary;
  onPreviewMove?: (from: string, to: string) => void;
}

const QUALITY_BADGES: Record<MoveQuality, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  book: {
    label: 'Book Move',
    bg: 'bg-blue-500/10 border-blue-500/30',
    text: 'text-blue-400',
    icon: <BookOpen className="w-3.5 h-3.5" />
  },
  best: {
    label: 'Best Move',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    text: 'text-emerald-400',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />
  },
  excellent: {
    label: 'Excellent',
    bg: 'bg-teal-500/10 border-teal-500/30',
    text: 'text-teal-400',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />
  },
  good: {
    label: 'Good Move',
    bg: 'bg-green-500/10 border-green-500/30',
    text: 'text-green-400',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />
  },
  inaccuracy: {
    label: 'Inaccuracy',
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    text: 'text-yellow-400',
    icon: <AlertTriangle className="w-3.5 h-3.5" />
  },
  mistake: {
    label: 'Mistake',
    bg: 'bg-orange-500/10 border-orange-500/30',
    text: 'text-orange-400',
    icon: <AlertTriangle className="w-3.5 h-3.5" />
  },
  blunder: {
    label: 'Blunder',
    bg: 'bg-red-500/15 border-red-500/40',
    text: 'text-red-400',
    icon: <XCircle className="w-3.5 h-3.5" />
  }
};

export const CommentaryBubble: React.FC<CommentaryBubbleProps> = ({
  commentary,
  onPreviewMove
}) => {
  const isCoachMove = commentary.speaker === 'coach' && commentary.quality === undefined;
  const badge = commentary.quality ? QUALITY_BADGES[commentary.quality] : null;

  const handleSpeak = () => {
    VoiceService.speak(`${commentary.title}. ${commentary.explanation}`);
  };

  return (
    <div className={`p-4 rounded-xl border transition-all duration-300 shadow-md ${
      isCoachMove
        ? 'bg-slate-900/90 border-sky-500/20'
        : commentary.quality === 'blunder'
        ? 'bg-red-950/20 border-red-500/30'
        : commentary.quality === 'best' || commentary.quality === 'book'
        ? 'bg-emerald-950/20 border-emerald-500/30'
        : 'bg-slate-900/80 border-slate-800'
    }`}>
      {/* Header Info */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
            isCoachMove
              ? 'bg-sky-500/15 border-sky-500/30 text-sky-400'
              : 'bg-purple-500/15 border-purple-500/30 text-purple-400'
          }`}>
            {isCoachMove ? "Coach's Move" : "Your Move"}
          </span>

          <span className="font-mono text-sm font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            {commentary.san}
          </span>

          {badge && (
            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold border ${badge.bg} ${badge.text}`}>
              {badge.icon}
              {badge.label}
            </span>
          )}
        </div>

        <button
          onClick={handleSpeak}
          title="Speak aloud"
          className="text-slate-400 hover:text-sky-400 p-1 rounded-md hover:bg-slate-800 transition"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Title */}
      <h4 className="text-sm font-bold text-slate-100 mb-1 flex items-center gap-1.5">
        {commentary.title}
      </h4>

      {/* Main Pedagogical Explanation */}
      <p className="text-sm text-slate-300 leading-relaxed">
        {commentary.explanation}
      </p>

      {/* Threat Callout if any */}
      {commentary.threatExplanation && (
        <div className="mt-2.5 p-2.5 rounded-lg bg-red-950/30 border border-red-500/30 flex items-start gap-2 text-xs text-red-200">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{commentary.threatExplanation}</span>
        </div>
      )}

      {/* Better Alternative suggestion card */}
      {commentary.betterAlternative && (
        <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between gap-2">
          <div className="text-xs">
            <span className="text-emerald-400 font-semibold block mb-0.5">Recommended Alternative:</span>
            <span className="text-slate-300 font-mono font-bold text-sm text-emerald-300 mr-2">
              {commentary.betterAlternative.san}
            </span>
            <span className="text-slate-400 text-xs">{commentary.betterAlternative.reason}</span>
          </div>

          {onPreviewMove && (
            <button
              onClick={() => onPreviewMove(commentary.betterAlternative!.from, commentary.betterAlternative!.to)}
              className="px-2.5 py-1 text-xs font-semibold bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded flex items-center gap-1 shrink-0 transition"
            >
              Show
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
