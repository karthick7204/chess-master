import React, { useState } from 'react';
import { OpeningInfo } from '../../types/chess';
import {
  RotateCcw,
  Undo2,
  ArrowLeftRight,
  Lightbulb,
  Copy,
  Check,
  BookOpen,
  Eye,
  EyeOff,
  Layers
} from 'lucide-react';

interface StoredMoveRecord {
  from: string;
  to: string;
  san: string;
}

interface PracticeBoardPanelProps {
  moves: StoredMoveRecord[];
  viewingIndex: number;
  onSelectMoveIndex: (index: number) => void;
  turn: 'w' | 'b';
  isInCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  currentOpening: OpeningInfo | null;
  onTakeBack: () => void;
  canTakeBack: boolean;
  onResetBoard: () => void;
  onClearBoard: () => void;
  onFlipBoard: () => void;
  onShowBestMoveHint: () => void;
  boardOrientation: 'white' | 'black';
  showEvalBar: boolean;
  onToggleEvalBar: () => void;
  currentFen: string;
  onLoadFen: (fen: string) => void;
}

export const PracticeBoardPanel: React.FC<PracticeBoardPanelProps> = ({
  moves,
  viewingIndex,
  onSelectMoveIndex,
  turn,
  isInCheck,
  isCheckmate,
  isDraw,
  currentOpening,
  onTakeBack,
  canTakeBack,
  onResetBoard,
  onClearBoard,
  onFlipBoard,
  onShowBestMoveHint,
  boardOrientation,
  showEvalBar,
  onToggleEvalBar,
  currentFen,
  onLoadFen
}) => {
  const [copiedFen, setCopiedFen] = useState(false);
  const [isFenInputOpen, setIsFenInputOpen] = useState(false);
  const [customFenInput, setCustomFenInput] = useState('');
  const [fenError, setFenError] = useState('');

  // Group moves into turn pairs: [ { moveNum: 1, whiteIndex: 1, whiteSan: 'e4', blackIndex: 2, blackSan: 'e5' } ]
  const movePairs: { moveNum: number; whiteIndex?: number; whiteSan?: string; blackIndex?: number; blackSan?: string }[] = [];
  for (let i = 0; i < moves.length; i++) {
    const moveNumber = Math.floor(i / 2) + 1;
    let pair = movePairs.find(p => p.moveNum === moveNumber);
    if (!pair) {
      pair = { moveNum: moveNumber };
      movePairs.push(pair);
    }
    if (i % 2 === 0) {
      pair.whiteIndex = i + 1;
      pair.whiteSan = moves[i].san;
    } else {
      pair.blackIndex = i + 1;
      pair.blackSan = moves[i].san;
    }
  }

  const handleCopyFen = () => {
    navigator.clipboard.writeText(currentFen);
    setCopiedFen(true);
    setTimeout(() => setCopiedFen(false), 2000);
  };

  const handleApplyCustomFen = () => {
    if (!customFenInput.trim()) return;
    try {
      onLoadFen(customFenInput.trim());
      setIsFenInputOpen(false);
      setCustomFenInput('');
      setFenError('');
    } catch {
      setFenError('Invalid FEN notation string');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#21201d] text-white rounded-lg overflow-hidden shadow-2xl border border-[#312e2b] select-none">
      {/* Top Header: "Practice Board" */}
      <div className="px-4 py-3 border-b border-[#2b2926] flex items-center justify-between bg-[#21201d]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#81b64c]/20 border border-[#81b64c]/40 flex items-center justify-center text-xs text-[#81b64c]">
            ♟️
          </div>
          <h2 className="font-bold text-sm tracking-wide text-zinc-100 uppercase">
            Practice Board
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded-full">
            Free Move Mode
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-3.5">
        {/* Turn Status Banner */}
        <div className="p-3 bg-[#262522] rounded-xl border border-[#363430] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-4 h-4 rounded-full border border-black/30 shadow-sm ${
                turn === 'w' ? 'bg-white' : 'bg-zinc-900 border-zinc-600'
              }`}
            />
            <span className="text-xs font-bold text-zinc-200">
              {turn === 'w' ? 'White to move' : 'Black to move'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isCheckmate && (
              <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full uppercase">
                Checkmate
              </span>
            )}
            {isInCheck && !isCheckmate && (
              <span className="text-[10px] font-bold bg-amber-500 text-zinc-950 px-2 py-0.5 rounded-full uppercase">
                Check
              </span>
            )}
            {isDraw && (
              <span className="text-[10px] font-bold bg-zinc-600 text-white px-2 py-0.5 rounded-full uppercase">
                Draw
              </span>
            )}
            <span className="text-[11px] text-zinc-400 font-mono">
              Move {moves.length}
            </span>
          </div>
        </div>

        {/* Recognized Opening Banner */}
        {currentOpening ? (
          <div className="p-3 bg-[#262522] rounded-xl border border-[#383631] space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{currentOpening.name}</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded">
                {currentOpening.eco}
              </span>
            </div>
            {currentOpening.description && (
              <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">
                {currentOpening.description}
              </p>
            )}
          </div>
        ) : (
          <div className="py-2 px-3 bg-[#1e1d1a] rounded-xl border border-[#2b2926] text-xs text-zinc-400 flex items-center justify-between">
            <span>Play moves to explore opening theory</span>
            <span className="text-[10px] text-zinc-500 font-mono">Custom / Book</span>
          </div>
        )}

        {/* Move History Table */}
        <div className="flex-1 flex flex-col min-h-[180px] bg-[#1a1917] rounded-xl p-2.5 border border-[#2b2926]">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#2b2926] text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            <span>Move History</span>
            <span className="font-mono text-zinc-500">Click to preview</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 text-xs font-mono max-h-56">
            {movePairs.length === 0 ? (
              <div className="text-zinc-600 italic py-6 text-center text-xs">
                Make moves for White and Black on the board
              </div>
            ) : (
              movePairs.map(p => (
                <div key={p.moveNum} className="grid grid-cols-7 py-0.5 px-1 rounded hover:bg-[#2b2926]/60">
                  <span className="col-span-1 text-zinc-500 font-bold">
                    {p.moveNum}.
                  </span>

                  {/* White Move */}
                  <button
                    onClick={() => p.whiteIndex && onSelectMoveIndex(p.whiteIndex)}
                    className={`col-span-3 text-left px-1.5 py-0.5 rounded transition ${
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
                      onClick={() => p.blackIndex && onSelectMoveIndex(p.blackIndex)}
                      className={`col-span-3 text-left px-1.5 py-0.5 rounded transition ${
                        viewingIndex === p.blackIndex
                          ? 'bg-[#3d3a36] text-amber-300 font-bold'
                          : 'text-zinc-200 hover:text-white'
                      }`}
                    >
                      {p.blackSan}
                    </button>
                  ) : (
                    <span className="col-span-3 text-zinc-600 px-1.5">...</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* FEN Input Expandable Drawer */}
        {isFenInputOpen && (
          <div className="p-3 bg-[#1e1d1a] rounded-xl border border-zinc-700 space-y-2">
            <span className="text-xs font-bold text-zinc-300 block">Load Custom Position (FEN):</span>
            <input
              type="text"
              placeholder="Paste FEN (e.g. 8/8/4k3/8/4P3/8/4K3/8 w - - 0 1)"
              value={customFenInput}
              onChange={e => {
                setCustomFenInput(e.target.value);
                setFenError('');
              }}
              className="w-full bg-[#141412] border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-[#81b64c]"
            />
            {fenError && <p className="text-[11px] text-red-400 font-medium">{fenError}</p>}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => {
                  setIsFenInputOpen(false);
                  setFenError('');
                }}
                className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustomFen}
                className="px-3 py-1 text-xs font-bold bg-[#81b64c] hover:bg-[#92cb58] text-white rounded-lg transition"
              >
                Load Position
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Practice Controls Toolbar */}
      <div className="p-3 bg-[#262522] border-t border-[#2b2926] space-y-2.5">
        {/* Main 4 Action Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {/* Flip Board */}
          <button
            onClick={onFlipBoard}
            title={`Flip Board (Currently: ${boardOrientation})`}
            className="h-10 rounded-lg bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 hover:text-white flex items-center justify-center transition border border-[#363430]"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          {/* Best Move Engine Hint */}
          <button
            onClick={onShowBestMoveHint}
            title="Show Best Move Hint (Arrow)"
            className="h-10 rounded-lg bg-[#312e2b] hover:bg-[#3d3a36] text-amber-400 hover:text-amber-300 flex items-center justify-center transition border border-[#363430]"
          >
            <Lightbulb className="w-4 h-4" />
          </button>

          {/* Take Back Move */}
          <button
            onClick={onTakeBack}
            disabled={!canTakeBack}
            title="Take Back Move"
            className="h-10 rounded-lg bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 hover:text-white flex items-center justify-center transition border border-[#363430] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Reset Board */}
          <button
            onClick={onResetBoard}
            title="Reset to Starting Position"
            className="h-10 rounded-lg bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 hover:text-white flex items-center justify-center transition border border-[#363430]"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Secondary Utility Controls */}
        <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-[#312e2b]">
          <div className="flex items-center gap-2">
            {/* Copy FEN */}
            <button
              onClick={handleCopyFen}
              className="flex items-center gap-1 hover:text-white transition py-0.5 px-1.5 rounded hover:bg-[#312e2b]"
              title="Copy FEN String"
            >
              {copiedFen ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{copiedFen ? 'Copied FEN' : 'FEN'}</span>
            </button>

            {/* Load FEN */}
            <button
              onClick={() => setIsFenInputOpen(!isFenInputOpen)}
              className="flex items-center gap-1 hover:text-white transition py-0.5 px-1.5 rounded hover:bg-[#312e2b]"
              title="Load custom FEN"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[11px]">Load</span>
            </button>

            {/* Clear Board */}
            <button
              onClick={onClearBoard}
              className="hover:text-red-400 transition py-0.5 px-1.5 rounded hover:bg-[#312e2b] text-[11px]"
              title="Clear all pieces from board"
            >
              Clear
            </button>
          </div>

          {/* Eval Bar Toggle */}
          <button
            onClick={onToggleEvalBar}
            className="flex items-center gap-1 hover:text-white transition py-0.5 px-1.5 rounded hover:bg-[#312e2b]"
            title={showEvalBar ? "Hide Evaluation Bar" : "Show Evaluation Bar"}
          >
            {showEvalBar ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-500" />}
            <span className="text-[11px]">{showEvalBar ? 'Eval ON' : 'Eval OFF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
