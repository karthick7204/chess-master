import React, { useState, useMemo } from 'react';
import { OpeningInfo } from '../../types/chess';
import {
  BookOpen,
  Search,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lightbulb,
  ArrowLeftRight,
  Trophy,
  Check,
  Flame,
  Swords,
  Shield,
  Target,
  Compass,
  Layers,
  ArrowRight
} from 'lucide-react';

export interface OpeningsExplorerPanelProps {
  openings: OpeningInfo[];
  selectedOpening: OpeningInfo;
  onSelectOpening: (opening: OpeningInfo) => void;
  currentMoveIndex: number;
  onStepMove: (direction: 'start' | 'prev' | 'next' | 'end' | number) => void;
  isTesting: boolean;
  onToggleTesting: () => void;
  testStatus: 'idle' | 'correct' | 'wrong' | 'completed';
  testMessage?: string;
  onShowHint: () => void;
  onFlipBoard: () => void;
  boardOrientation: 'white' | 'black';
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
}

export const OpeningsExplorerPanel: React.FC<OpeningsExplorerPanelProps> = ({
  openings,
  selectedOpening,
  onSelectOpening,
  currentMoveIndex,
  onStepMove,
  isTesting,
  onToggleTesting,
  testStatus,
  testMessage,
  onShowHint,
  onFlipBoard,
  boardOrientation: _boardOrientation,
  isAutoPlaying,
  onToggleAutoPlay
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'e4' | 'd4' | 'flank' | 'traps'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'moves' | 'middlegame'>('moves');

  // Filter openings by category and search term
  const filteredOpenings = useMemo(() => {
    return openings.filter(op => {
      const matchesCategory =
        selectedCategory === 'all' || op.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.eco.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [openings, selectedCategory, searchQuery]);

  // Turn pairs for move list display (1. e4 e5 2. Nf3 Nc6 ...)
  const movePairs = useMemo(() => {
    const pairs: { moveNum: number; white?: { san: string; index: number }; black?: { san: string; index: number } }[] = [];
    for (let i = 0; i < selectedOpening.moves.length; i += 2) {
      const moveNum = Math.floor(i / 2) + 1;
      const white = { san: selectedOpening.moves[i], index: i + 1 };
      const black = selectedOpening.moves[i + 1]
        ? { san: selectedOpening.moves[i + 1], index: i + 2 }
        : undefined;
      pairs.push({ moveNum, white, black });
    }
    return pairs;
  }, [selectedOpening]);

  const totalMoves = selectedOpening.moves.length;
  const strategy = selectedOpening.middlegameStrategy;

  return (
    <div className="flex flex-col h-full bg-[#21201d] border border-[#312e2b] rounded-xl overflow-hidden shadow-2xl">
      {/* Panel Top Header */}
      <div className="p-3.5 bg-[#262522] border-b border-[#312e2b] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              Learn Openings & Middlegames
              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                {openings.length} Popular Lines
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400">
              Grandmaster theory, deep lines & strategic battle plans
            </p>
          </div>
        </div>

        {/* Quick Test / Practice Mode Toggle */}
        <button
          onClick={onToggleTesting}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
            isTesting
              ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
              : 'bg-[#312e2b] hover:bg-[#3d3a36] text-amber-300 border border-amber-500/30'
          }`}
          title={isTesting ? 'Exit memory test mode' : 'Test your memory of this opening line'}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>{isTesting ? 'Exit Test' : 'Test Memory'}</span>
        </button>
      </div>

      {/* Main Body: Two Columns (Left Directory, Right Content) */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#312e2b]">
        {/* LEFT COLUMN: Openings Directory (5 cols) */}
        <div className="md:col-span-5 flex flex-col h-full bg-[#1e1d1a] overflow-hidden">
          {/* Category Tabs */}
          <div className="p-2 border-b border-[#312e2b] grid grid-cols-5 gap-1 text-[11px]">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`py-1 rounded font-semibold transition text-center ${
                selectedCategory === 'all'
                  ? 'bg-[#81b64c] text-white shadow'
                  : 'bg-[#262522] text-zinc-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory('e4')}
              className={`py-1 rounded font-semibold transition text-center ${
                selectedCategory === 'e4'
                  ? 'bg-[#81b64c] text-white shadow'
                  : 'bg-[#262522] text-zinc-400 hover:text-white'
              }`}
            >
              1. e4
            </button>
            <button
              onClick={() => setSelectedCategory('d4')}
              className={`py-1 rounded font-semibold transition text-center ${
                selectedCategory === 'd4'
                  ? 'bg-[#81b64c] text-white shadow'
                  : 'bg-[#262522] text-zinc-400 hover:text-white'
              }`}
            >
              1. d4
            </button>
            <button
              onClick={() => setSelectedCategory('flank')}
              className={`py-1 rounded font-semibold transition text-center ${
                selectedCategory === 'flank'
                  ? 'bg-[#81b64c] text-white shadow'
                  : 'bg-[#262522] text-zinc-400 hover:text-white'
              }`}
            >
              Flank
            </button>
            <button
              onClick={() => setSelectedCategory('traps')}
              className={`py-1 rounded font-semibold transition text-center flex items-center justify-center gap-0.5 ${
                selectedCategory === 'traps'
                  ? 'bg-rose-500 text-white shadow'
                  : 'bg-[#262522] text-rose-300 hover:text-white'
              }`}
            >
              <Flame className="w-2.5 h-2.5" />
              Traps
            </button>
          </div>

          {/* Search Box */}
          <div className="p-2 border-b border-[#312e2b]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search line (e.g. Italian, Najdorf, Dragon, QGD)..."
                className="w-full bg-[#181715] text-xs text-white pl-8 pr-3 py-1.5 rounded border border-zinc-700/60 focus:outline-none focus:border-emerald-500 transition placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* Openings List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#2a2825] scrollbar-thin scrollbar-thumb-zinc-700">
            {filteredOpenings.length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-500">
                No openings found matching your criteria.
              </div>
            ) : (
              filteredOpenings.map(op => {
                const isSelected = selectedOpening.name === op.name;
                return (
                  <button
                    key={op.name}
                    onClick={() => onSelectOpening(op)}
                    className={`w-full text-left p-2.5 transition flex items-center justify-between group ${
                      isSelected
                        ? 'bg-[#2b2a26] border-l-4 border-[#81b64c]'
                        : 'hover:bg-[#262522] border-l-4 border-transparent'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold bg-[#181715] text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-800">
                          {op.eco}
                        </span>
                        <span
                          className={`text-xs font-bold truncate ${
                            isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-white'
                          }`}
                        >
                          {op.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                        <span className="capitalize flex items-center gap-1">
                          {op.side === 'white' ? '♙ White' : '♟ Black'}
                        </span>
                        <span>•</span>
                        <span className="text-zinc-400 font-semibold">{op.moves.length} moves</span>
                        {op.category === 'traps' && (
                          <>
                            <span>•</span>
                            <span className="text-rose-400 font-semibold flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5" /> Trap
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-[#81b64c] flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Opening Details & Section Switcher (7 cols) */}
        <div className="md:col-span-7 flex flex-col h-full bg-[#21201d] overflow-hidden">
          {/* Active Opening Banner */}
          <div className="p-3.5 border-b border-[#312e2b] bg-[#262522]/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-[#181715] text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                    {selectedOpening.eco}
                  </span>
                  <span className="text-xs bg-[#181715] text-zinc-400 px-2 py-0.5 rounded border border-zinc-800 capitalize">
                    {selectedOpening.side === 'white' ? '♙ White perspective' : '♟ Black perspective'}
                  </span>
                  <span className="text-xs bg-[#181715] text-emerald-300 px-2 py-0.5 rounded border border-zinc-800">
                    {totalMoves} ply line
                  </span>
                  {selectedOpening.category === 'traps' && (
                    <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30 font-semibold flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-400" />
                      Tactical Trap
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-white text-base mt-1.5">
                  {selectedOpening.name}
                </h3>
              </div>

              {/* Board Flip Quick Button */}
              <button
                onClick={onFlipBoard}
                className="p-1.5 rounded-lg bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 transition flex items-center gap-1 text-xs"
                title="Flip board orientation (F)"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Flip</span>
              </button>
            </div>

            <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
              {selectedOpening.description}
            </p>

            {selectedOpening.famousPlayers && (
              <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1.5">
                <span className="text-zinc-500 font-semibold">Champions:</span>
                <span className="text-zinc-300 font-medium">{selectedOpening.famousPlayers}</span>
              </div>
            )}
          </div>

          {/* SECTION SWITCHER TABS: Move Sequence vs Middlegame Battle Plans */}
          <div className="flex items-center bg-[#191816] border-b border-[#312e2b] px-3 py-1.5 gap-2">
            <button
              onClick={() => setActiveSubTab('moves')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeSubTab === 'moves'
                  ? 'bg-[#81b64c] text-white shadow'
                  : 'text-zinc-400 hover:text-white hover:bg-[#262522]'
              }`}
            >
              <span>♟️</span>
              <span>Move Sequence & Line Explorer</span>
            </button>

            <button
              onClick={() => setActiveSubTab('middlegame')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeSubTab === 'middlegame'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-amber-300/80 hover:text-amber-200 hover:bg-[#262522]'
              }`}
            >
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>Middlegame Battle Plans</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded-full font-bold">
                Strategic Blueprint
              </span>
            </button>
          </div>

          {/* TAB CONTENT 1: MOVE SEQUENCE & LINE EXPLORER */}
          {activeSubTab === 'moves' ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Test Mode Banner or Move Controls */}
              {isTesting ? (
                <div className="p-3 bg-amber-500/10 border-b border-amber-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
                      <span className="text-xs font-bold text-amber-300">
                        Test Mode: Play {selectedOpening.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-amber-300/80">
                      Move {currentMoveIndex} / {totalMoves}
                    </span>
                  </div>

                  {testStatus === 'completed' ? (
                    <div className="mt-2 p-2 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>🎉 Line Mastered! You played all {totalMoves} moves accurately!</span>
                    </div>
                  ) : testStatus === 'wrong' ? (
                    <div className="mt-2 p-2 rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <span>{testMessage || "That's not the book move. Try again!"}</span>
                      </div>
                      <button
                        onClick={onShowHint}
                        className="ml-2 px-2 py-0.5 bg-rose-500 hover:bg-rose-600 text-white rounded text-[10px] font-bold transition"
                      >
                        Show Hint
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center justify-between text-xs text-amber-200/90">
                      <span>
                        Play the next move on the board (
                        {currentMoveIndex % 2 === 0 ? 'White to move' : 'Black to move'}).
                      </span>
                      <button
                        onClick={onShowHint}
                        className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-white underline font-medium"
                      >
                        <Lightbulb className="w-3 h-3" />
                        Hint
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Move Stepper Controls */
                <div className="p-3 bg-[#1e1d1a] border-b border-[#312e2b] flex items-center justify-between">
                  {/* Stepper Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onStepMove('start')}
                      disabled={currentMoveIndex === 0}
                      className="p-1.5 rounded bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="First move (Home)"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onStepMove('prev')}
                      disabled={currentMoveIndex === 0}
                      className="p-1.5 rounded bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="Previous move (←)"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onStepMove('next')}
                      disabled={currentMoveIndex >= totalMoves}
                      className="p-1.5 rounded bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="Next move (→)"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onStepMove('end')}
                      disabled={currentMoveIndex >= totalMoves}
                      className="p-1.5 rounded bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      title="Final position (End)"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>

                    {/* Auto-Play Toggle */}
                    <button
                      onClick={onToggleAutoPlay}
                      className={`ml-2 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition ${
                        isAutoPlaying
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300'
                      }`}
                      title={isAutoPlaying ? 'Pause demonstration' : 'Auto-play line move by move'}
                    >
                      {isAutoPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Auto Play</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Progress Indicator */}
                  <div className="text-xs text-zinc-400 font-mono">
                    Step <span className="font-bold text-white">{currentMoveIndex}</span> / {totalMoves}
                  </div>
                </div>
              )}

              {/* Moves Grid & Key Ideas Scrollable Section */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700">
                {/* Opening Moves Grid */}
                <div>
                  <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Move Sequence ({totalMoves} Moves Deep)
                  </h4>
                  <div className="bg-[#181715] p-2.5 rounded-lg border border-[#312e2b]">
                    <div className="flex flex-wrap gap-1.5">
                      {movePairs.map(pair => {
                        const white = pair.white;
                        const black = pair.black;
                        return (
                          <div
                            key={pair.moveNum}
                            className="flex items-center bg-[#21201d] rounded px-1.5 py-0.5 border border-zinc-800 text-xs"
                          >
                            <span className="text-zinc-500 font-mono text-[11px] mr-1">
                              {pair.moveNum}.
                            </span>
                            {white && (
                              <button
                                onClick={() => onStepMove(white.index)}
                                className={`px-1 rounded font-mono font-semibold transition ${
                                  currentMoveIndex === white.index
                                    ? 'bg-[#81b64c] text-white'
                                    : 'text-zinc-200 hover:bg-[#312e2b]'
                                }`}
                              >
                                {white.san}
                              </button>
                            )}
                            {black && (
                              <button
                                onClick={() => onStepMove(black.index)}
                                className={`ml-1 px-1 rounded font-mono font-semibold transition ${
                                  currentMoveIndex === black.index
                                    ? 'bg-[#81b64c] text-white'
                                    : 'text-zinc-200 hover:bg-[#312e2b]'
                                }`}
                              >
                                {black.san}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Key Strategic Ideas */}
                {selectedOpening.keyIdeas && selectedOpening.keyIdeas.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Core Principles & Ideas
                    </h4>
                    <div className="space-y-1.5">
                      {selectedOpening.keyIdeas.map((idea, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-[#181715] border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{idea}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* TAB CONTENT 2: SEPARATE DEDICATED MIDDLEGAME BATTLE PLANS SECTION */
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700">
              {/* Core Pawn Structure Foundation */}
              <div className="p-3.5 rounded-xl bg-[#1a1916] border border-amber-500/30 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    Pawn Structure & Strategic Foundation
                  </h4>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {strategy?.corePawnStructure ||
                    selectedOpening.targetPawnStructure ||
                    "This opening establishes dynamic central tension with asymmetrical pawn structures dictating middlegame piece play."}
                </p>
              </div>

              {/* White's Grandmaster Battle Plans */}
              {strategy?.whitePlans && strategy.whitePlans.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-zinc-200 text-zinc-900 flex items-center justify-center font-bold text-xs shadow-sm">
                      ♙
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      White's Primary Middlegame Plans
                    </h4>
                  </div>

                  {strategy.whitePlans.map((plan, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#181715] border border-zinc-800 space-y-2 hover:border-zinc-700 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-emerald-400" />
                          {plan.title}
                        </span>
                        {plan.pawnBreaks && plan.pawnBreaks.length > 0 && (
                          <div className="flex items-center gap-1">
                            {plan.pawnBreaks.map(pb => (
                              <span
                                key={pb}
                                className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30"
                              >
                                Break: {pb}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {plan.description}
                      </p>

                      {plan.keyMoves && plan.keyMoves.length > 0 && (
                        <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-zinc-500 font-semibold uppercase">
                            Key Move Path:
                          </span>
                          {plan.keyMoves.map((m, mIdx) => (
                            <React.Fragment key={m}>
                              <span className="text-[11px] font-mono bg-[#21201d] text-zinc-200 px-1.5 py-0.5 rounded border border-zinc-800">
                                {m}
                              </span>
                              {mIdx < plan.keyMoves!.length - 1 && (
                                <ArrowRight className="w-2.5 h-2.5 text-zinc-600" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      )}

                      {plan.piecePlacement && (
                        <div className="text-[11px] text-zinc-400 pt-0.5 flex items-center gap-1.5">
                          <span className="text-zinc-500 font-semibold">Ideal Setup:</span>
                          <span className="text-zinc-300">{plan.piecePlacement}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Black's Grandmaster Counter-Plans */}
              {strategy?.blackPlans && strategy.blackPlans.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-zinc-800 text-zinc-200 flex items-center justify-center font-bold text-xs border border-zinc-700 shadow-sm">
                      ♟
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Black's Strategic Counter-Plans
                    </h4>
                  </div>

                  {strategy.blackPlans.map((plan, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#181715] border border-zinc-800 space-y-2 hover:border-zinc-700 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-sky-400 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-sky-400" />
                          {plan.title}
                        </span>
                        {plan.pawnBreaks && plan.pawnBreaks.length > 0 && (
                          <div className="flex items-center gap-1">
                            {plan.pawnBreaks.map(pb => (
                              <span
                                key={pb}
                                className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-bold border border-sky-500/30"
                              >
                                Break: {pb}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {plan.description}
                      </p>

                      {plan.keyMoves && plan.keyMoves.length > 0 && (
                        <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-zinc-500 font-semibold uppercase">
                            Key Move Path:
                          </span>
                          {plan.keyMoves.map((m, mIdx) => (
                            <React.Fragment key={m}>
                              <span className="text-[11px] font-mono bg-[#21201d] text-zinc-200 px-1.5 py-0.5 rounded border border-zinc-800">
                                {m}
                              </span>
                              {mIdx < plan.keyMoves!.length - 1 && (
                                <ArrowRight className="w-2.5 h-2.5 text-zinc-600" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      )}

                      {plan.piecePlacement && (
                        <div className="text-[11px] text-zinc-400 pt-0.5 flex items-center gap-1.5">
                          <span className="text-zinc-500 font-semibold">Ideal Setup:</span>
                          <span className="text-zinc-300">{plan.piecePlacement}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Critical Squares & Outpost Radar */}
              {strategy?.criticalSquares && strategy.criticalSquares.length > 0 && (
                <div className="p-3.5 rounded-xl bg-[#181715] border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-rose-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Critical Squares & Battleground Outposts
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {strategy.criticalSquares.map(sq => (
                      <span
                        key={sq}
                        className="px-2.5 py-1 rounded bg-[#262522] border border-zinc-700 text-xs font-mono font-bold text-amber-300 flex items-center gap-1"
                      >
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        {sq}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-zinc-400 pt-1 leading-relaxed">
                    Control of these pivotal squares frequently decides who achieves breakthrough vs who is driven into passive defense.
                  </p>
                </div>
              )}

              {/* Endgame Transition Guidance */}
              {strategy?.endgameTransitionNote && (
                <div className="p-3.5 rounded-xl bg-[#181715] border border-zinc-800 space-y-1.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span>👑</span>
                    <span>Endgame Transition & Pawn Skeletons</span>
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {strategy.endgameTransitionNote}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
