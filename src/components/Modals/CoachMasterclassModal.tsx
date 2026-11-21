import React, { useState } from 'react';
import { Chess, Square, PieceSymbol } from 'chess.js';
import { CoachPhase } from '../../types/learning';
import {
  OPENING_PRINCIPLES,
  OPENING_REPERTOIRE_GUIDES,
  OPENING_TRAPS,
  MIDDLEGAME_CONCEPTS,
  ENDGAME_CONCEPTS,
  ALL_COACH_DRILLS
} from '../../data/coachCurriculum';
import { ChessBoardContainer } from '../Board/ChessBoardContainer';
import { SoundService } from '../../services/soundService';
import { BoardArrow } from '../../types/chess';
import {
  X,
  BookOpen,
  Sword,
  Crown,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

interface CoachMasterclassModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhase?: CoachPhase;
}

export const CoachMasterclassModal: React.FC<CoachMasterclassModalProps> = ({
  isOpen,
  onClose,
  initialPhase = 'opening'
}) => {
  const [activePhase, setActivePhase] = useState<CoachPhase>(initialPhase);
  const [openingSubTab, setOpeningSubTab] = useState<'principles' | 'repertoire' | 'traps' | 'drills'>('principles');
  const [middlegameSubTab, setMiddlegameSubTab] = useState<'positional' | 'weaknesses' | 'plans' | 'drills'>('positional');
  const [endgameSubTab, setEndgameSubTab] = useState<'king' | 'pawns' | 'rook' | 'checkmate' | 'drills'>('king');

  // Selected playstyle for opening suggester
  const [selectedPlaystyle, setSelectedPlaystyle] = useState<'aggressive' | 'solid' | 'strategic'>('aggressive');

  // Interactive Drill State
  const phaseDrills = ALL_COACH_DRILLS.filter(d => d.phase === activePhase);
  const [drillIndex, setDrillIndex] = useState(0);
  const activeDrill = phaseDrills[drillIndex] || phaseDrills[0] || ALL_COACH_DRILLS[0];

  const [drillGame, setDrillGame] = useState<Chess>(new Chess(activeDrill.fen));
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [drillArrows, setDrillArrows] = useState<BoardArrow[]>([]);

  // Trap Explorer State
  const [selectedTrapId, setSelectedTrapId] = useState<string>(OPENING_TRAPS[0].id);
  const activeTrap = OPENING_TRAPS.find(t => t.id === selectedTrapId) || OPENING_TRAPS[0];

  React.useEffect(() => {
    if (activeDrill) {
      setDrillGame(new Chess(activeDrill.fen));
      setFeedback('idle');
      setShowHint(false);
      setDrillArrows([]);
    }
  }, [activeDrill]);

  if (!isOpen) return null;

  const handleDrillMove = (from: Square, to: Square, promotion?: PieceSymbol): boolean => {
    if (feedback === 'success') return false;

    const gameCopy = new Chess(drillGame.fen());
    const move = gameCopy.move({ from, to, promotion: promotion || 'q' });

    if (!move) return false;

    const isCorrect =
      from === activeDrill.expectedMove.from &&
      to === activeDrill.expectedMove.to;

    if (isCorrect) {
      setDrillGame(gameCopy);
      setFeedback('success');
      SoundService.playCapture();
      setDrillArrows([
        { from, to, color: '#22c55e' }
      ]);
      return true;
    } else {
      setFeedback('wrong');
      SoundService.playMove();
      setDrillArrows([
        { from, to, color: '#ef4444' }
      ]);
      return true;
    }
  };

  const handleDrillHint = () => {
    setShowHint(true);
    setDrillArrows([
      {
        from: activeDrill.expectedMove.from,
        to: activeDrill.expectedMove.to,
        color: '#81b64c'
      }
    ]);
  };

  const handleResetDrill = () => {
    setDrillGame(new Chess(activeDrill.fen));
    setFeedback('idle');
    setShowHint(false);
    setDrillArrows([]);
  };

  const handleNextDrill = () => {
    setDrillIndex(idx => (idx + 1) % phaseDrills.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200">
      <div className="bg-[#1c1b18] border border-[#312e2b] rounded-2xl w-full max-w-5xl h-[92vh] max-h-[860px] flex flex-col shadow-2xl overflow-hidden text-zinc-100">
        
        {/* ========================================= */}
        {/* MODAL HEADER: 3 COACH PHASES TABS         */}
        {/* ========================================= */}
        <div className="px-5 py-3.5 bg-[#262420] border-b border-[#363430] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl text-amber-400">
              🎓
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Chess Masterclass Coach</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#81b64c]/20 text-[#81b64c] border border-[#81b64c]/30">
                  Interactive Academy
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Opening Principles, Middlegame Strategy & Endgame Techniques
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phase Navigation Switcher */}
        <div className="grid grid-cols-3 bg-[#181715] p-2 gap-2 border-b border-[#2b2926]">
          <button
            onClick={() => {
              setActivePhase('opening');
              setDrillIndex(0);
            }}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
              activePhase === 'opening'
                ? 'bg-[#81b64c] text-white shadow-md'
                : 'bg-[#242320] text-zinc-400 hover:text-white hover:bg-[#2b2926]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Opening Coach</span>
          </button>

          <button
            onClick={() => {
              setActivePhase('middlegame');
              setDrillIndex(0);
            }}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
              activePhase === 'middlegame'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-[#242320] text-zinc-400 hover:text-white hover:bg-[#2b2926]'
            }`}
          >
            <Sword className="w-4 h-4" />
            <span>Middlegame Coach</span>
          </button>

          <button
            onClick={() => {
              setActivePhase('endgame');
              setDrillIndex(0);
            }}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
              activePhase === 'endgame'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-[#242320] text-zinc-400 hover:text-white hover:bg-[#2b2926]'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Endgame Coach</span>
          </button>
        </div>

        {/* ========================================= */}
        {/* MAIN BODY AREA                            */}
        {/* ========================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* ======================================= */}
          {/* 1. OPENING COACH VIEW                   */}
          {/* ======================================= */}
          {activePhase === 'opening' && (
            <div className="space-y-4">
              {/* Opening Sub-Tabs */}
              <div className="flex items-center gap-2 border-b border-[#2b2926] pb-3">
                <button
                  onClick={() => setOpeningSubTab('principles')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    openingSubTab === 'principles'
                      ? 'bg-[#312e2b] text-white border border-zinc-600'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  📜 Opening Principles (6 Rules)
                </button>
                <button
                  onClick={() => setOpeningSubTab('repertoire')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    openingSubTab === 'repertoire'
                      ? 'bg-[#312e2b] text-white border border-zinc-600'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🧭 Repertoire Suggester
                </button>
                <button
                  onClick={() => setOpeningSubTab('traps')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    openingSubTab === 'traps'
                      ? 'bg-[#312e2b] text-white border border-zinc-600'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  ⚠️ Opening Traps & Defenses
                </button>
                <button
                  onClick={() => setOpeningSubTab('drills')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    openingSubTab === 'drills'
                      ? 'bg-[#81b64c] text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🎯 Interactive Opening Drills
                </button>
              </div>

              {/* Opening Principles */}
              {openingSubTab === 'principles' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {OPENING_PRINCIPLES.map(p => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl bg-[#242320] border border-[#33312c] space-y-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#81b64c]/20 text-[#81b64c] font-black flex items-center justify-center text-xs">
                          {p.number}
                        </span>
                        <h4 className="font-bold text-zinc-100 text-sm">{p.title}</h4>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{p.detailedExplanation}</p>
                      <div className="pt-2 border-t border-[#312f2a] space-y-1">
                        <div className="text-amber-400 font-semibold flex items-start gap-1.5">
                          <span className="shrink-0">⭐ Rule:</span>
                          <span className="text-zinc-200">{p.goldenRule}</span>
                        </div>
                        <div className="text-red-400 font-semibold flex items-start gap-1.5">
                          <span className="shrink-0">⚠️ Pitfall:</span>
                          <span className="text-zinc-300">{p.commonPitfall}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Repertoire Suggester */}
              {openingSubTab === 'repertoire' && (
                <div className="space-y-4">
                  {/* Playstyle Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-400">Choose Your Playstyle:</span>
                    {(['aggressive', 'solid', 'strategic'] as const).map(style => (
                      <button
                        key={style}
                        onClick={() => setSelectedPlaystyle(style)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${
                          selectedPlaystyle === style
                            ? 'bg-[#81b64c] text-white shadow-sm'
                            : 'bg-[#2b2926] text-zinc-400 hover:text-white'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>

                  {/* Repertoire Content */}
                  {(() => {
                    const rep = OPENING_REPERTOIRE_GUIDES.find(g => g.playstyle === selectedPlaystyle);
                    if (!rep) return null;
                    return (
                      <div className="space-y-4">
                        <div className="p-3 bg-[#262420] rounded-xl border border-[#383631]">
                          <h4 className="font-bold text-white text-sm">{rep.label}</h4>
                          <p className="text-xs text-zinc-400 mt-0.5">{rep.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* White Openings */}
                          <div className="space-y-3">
                            <h5 className="font-bold text-xs uppercase tracking-wider text-amber-400">
                              White Openings (Playing 1st)
                            </h5>
                            {rep.whiteOpenings.map(o => (
                              <div key={o.name} className="p-3 rounded-xl bg-[#242320] border border-[#33312c] space-y-1 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-white">{o.name}</span>
                                  <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                                    {o.eco}
                                  </span>
                                </div>
                                <div className="font-mono text-emerald-400 text-[11px]">{o.moves}</div>
                                <p className="text-zinc-300 pt-1">{o.keyIdea}</p>
                              </div>
                            ))}
                          </div>

                          {/* Black Openings */}
                          <div className="space-y-3">
                            <h5 className="font-bold text-xs uppercase tracking-wider text-sky-400">
                              Black Openings (Defenses)
                            </h5>
                            {rep.blackOpenings.map(o => (
                              <div key={o.name} className="p-3 rounded-xl bg-[#242320] border border-[#33312c] space-y-1 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-white">{o.name}</span>
                                  <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                                    {o.eco}
                                  </span>
                                </div>
                                <div className="font-mono text-emerald-400 text-[11px]">{o.moves}</div>
                                <p className="text-zinc-300 pt-1">{o.keyIdea}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Opening Traps Explorer */}
              {openingSubTab === 'traps' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Traps List */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-zinc-400 mb-2">
                      Famous Opening Traps
                    </h5>
                    {OPENING_TRAPS.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTrapId(t.id)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition border ${
                          selectedTrapId === t.id
                            ? 'bg-[#312e2b] border-[#81b64c] text-white font-bold'
                            : 'bg-[#242320] border-transparent text-zinc-400 hover:text-white hover:bg-[#2b2926]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{t.name}</span>
                          <span className="text-[10px] font-mono text-zinc-500">{t.eco}</span>
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">{t.openingName}</div>
                      </button>
                    ))}
                  </div>

                  {/* Trap Detail Card */}
                  <div className="md:col-span-2 p-4 rounded-xl bg-[#242320] border border-[#363430] space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-[#312f2a] pb-2">
                      <div>
                        <h4 className="font-bold text-base text-white">{activeTrap.name}</h4>
                        <span className="text-zinc-400">{activeTrap.openingName}</span>
                      </div>
                      <span className="font-mono text-xs px-2 py-0.5 bg-red-950/60 text-red-400 border border-red-800/40 rounded">
                        Trap: {activeTrap.trapMove}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="font-bold text-zinc-400 block mb-0.5">Move Sequence:</span>
                        <div className="p-2 bg-[#181715] rounded-lg font-mono text-zinc-300 text-[11px] leading-relaxed">
                          {activeTrap.moves.join('  ')}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-900/40 text-red-200">
                        <strong className="block text-red-400 font-bold mb-0.5">⚠️ The Punishment:</strong>
                        {activeTrap.punishment}
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-emerald-200">
                        <strong className="block text-emerald-400 font-bold mb-0.5">🛡️ How to Avoid / Refute:</strong>
                        {activeTrap.howToAvoid}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Opening Drills */}
              {openingSubTab === 'drills' && renderInteractiveDrillBoard()}
            </div>
          )}

          {/* ======================================= */}
          {/* 2. MIDDLEGAME COACH VIEW                */}
          {/* ======================================= */}
          {activePhase === 'middlegame' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#2b2926] pb-3">
                <button
                  onClick={() => setMiddlegameSubTab('positional')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    middlegameSubTab === 'positional'
                      ? 'bg-[#312e2b] text-white border border-zinc-600'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🏰 Positional Understanding
                </button>
                <button
                  onClick={() => setMiddlegameSubTab('weaknesses')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    middlegameSubTab === 'weaknesses'
                      ? 'bg-[#312e2b] text-white border border-zinc-600'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🔍 Weak Squares & Pawns
                </button>
                <button
                  onClick={() => setMiddlegameSubTab('plans')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    middlegameSubTab === 'plans'
                      ? 'bg-[#312e2b] text-white border border-zinc-600'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  ⚔️ Attacking Plans & Structures
                </button>
                <button
                  onClick={() => setMiddlegameSubTab('drills')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    middlegameSubTab === 'drills'
                      ? 'bg-amber-600 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🎯 Middlegame Drills
                </button>
              </div>

              {middlegameSubTab === 'positional' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {MIDDLEGAME_CONCEPTS.filter(c => c.topic === 'positional' || c.topic === 'coordination').map(c => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-[#242320] border border-[#33312c] space-y-2 text-xs">
                      <div>
                        <h4 className="font-bold text-white text-sm">{c.title}</h4>
                        <span className="text-[11px] text-zinc-400">{c.subtitle}</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{c.principle}</p>
                      <div className="pt-1.5 border-t border-[#312f2a] text-amber-300 font-semibold">
                        💡 How to play: <span className="text-zinc-200 font-normal">{c.howToPlay}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {middlegameSubTab === 'weaknesses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {MIDDLEGAME_CONCEPTS.filter(c => c.topic === 'weaknesses').map(c => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-[#242320] border border-[#33312c] space-y-2 text-xs">
                      <div>
                        <h4 className="font-bold text-white text-sm">{c.title}</h4>
                        <span className="text-[11px] text-zinc-400">{c.subtitle}</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{c.principle}</p>
                      <ul className="list-disc pl-4 space-y-0.5 text-zinc-400 text-[11px]">
                        {c.diagnosticSigns.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                      <div className="pt-1.5 border-t border-[#312f2a] text-emerald-400 font-semibold">
                        🎯 Strategy: <span className="text-zinc-200 font-normal">{c.howToPlay}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {middlegameSubTab === 'plans' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {MIDDLEGAME_CONCEPTS.filter(c => c.topic === 'attacking_plans' || c.topic === 'pawn_structures').map(c => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-[#242320] border border-[#33312c] space-y-2 text-xs">
                      <div>
                        <h4 className="font-bold text-white text-sm">{c.title}</h4>
                        <span className="text-[11px] text-zinc-400">{c.subtitle}</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{c.principle}</p>
                      <div className="pt-1.5 border-t border-[#312f2a] text-amber-400 font-semibold">
                        ⚡ Execution: <span className="text-zinc-200 font-normal">{c.howToPlay}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {middlegameSubTab === 'drills' && renderInteractiveDrillBoard()}
            </div>
          )}

          {/* ======================================= */}
          {/* 3. ENDGAME COACH VIEW                   */}
          {/* ======================================= */}
          {activePhase === 'endgame' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#2b2926] pb-3">
                <button
                  onClick={() => setEndgameSubTab('king')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    endgameSubTab === 'king'
                      ? 'bg-[#312e2b] text-white border border-zinc-600'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  👑 King Activity & Opposition
                </button>
                <button
                  onClick={() => setEndgameSubTab('pawns')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    endgameSubTab === 'pawns'
                      ? 'bg-[#312e2b] text-white border border-zinc-600'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  ♟️ Pawn Promotion & Rule of Square
                </button>
                <button
                  onClick={() => setEndgameSubTab('rook')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    endgameSubTab === 'rook'
                      ? 'bg-[#312e2b] text-white border border-zinc-600'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🏰 Rook Endgames (Lucena & Philidor)
                </button>
                <button
                  onClick={() => setEndgameSubTab('checkmate')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    endgameSubTab === 'checkmate'
                      ? 'bg-[#312e2b] text-white border border-zinc-600'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🏆 Checkmate Techniques
                </button>
                <button
                  onClick={() => setEndgameSubTab('drills')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    endgameSubTab === 'drills'
                      ? 'bg-sky-600 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🎯 Endgame Drills
                </button>
              </div>

              {/* King & Opposition */}
              {endgameSubTab === 'king' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {ENDGAME_CONCEPTS.filter(c => c.topic === 'king_activity' || c.topic === 'opposition').map(c => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-[#242320] border border-[#33312c] space-y-2 text-xs">
                      <div>
                        <h4 className="font-bold text-white text-sm">{c.title}</h4>
                        <span className="text-[11px] text-zinc-400">{c.subtitle}</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{c.technique}</p>
                      <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-900/40 text-amber-300 font-semibold">
                        ⭐ Golden Rule: {c.goldenRule}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pawns */}
              {endgameSubTab === 'pawns' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {ENDGAME_CONCEPTS.filter(c => c.topic === 'pawn_promotion').map(c => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-[#242320] border border-[#33312c] space-y-2 text-xs">
                      <div>
                        <h4 className="font-bold text-white text-sm">{c.title}</h4>
                        <span className="text-[11px] text-zinc-400">{c.subtitle}</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{c.technique}</p>
                      <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-emerald-300 font-semibold">
                        ⭐ Golden Rule: {c.goldenRule}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Rook Endgames */}
              {endgameSubTab === 'rook' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {ENDGAME_CONCEPTS.filter(c => c.topic === 'rook_endgames').map(c => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-[#242320] border border-[#33312c] space-y-2 text-xs">
                      <div>
                        <h4 className="font-bold text-white text-sm">{c.title}</h4>
                        <span className="text-[11px] text-zinc-400">{c.subtitle}</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{c.technique}</p>
                      <div className="p-2 rounded-lg bg-sky-950/40 border border-sky-900/40 text-sky-300 font-semibold">
                        ⭐ {c.goldenRule}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Checkmate Techniques */}
              {endgameSubTab === 'checkmate' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {ENDGAME_CONCEPTS.filter(c => c.topic === 'checkmates').map(c => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-[#242320] border border-[#33312c] space-y-2 text-xs">
                      <div>
                        <h4 className="font-bold text-white text-sm">{c.title}</h4>
                        <span className="text-[11px] text-zinc-400">{c.subtitle}</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{c.technique}</p>
                      <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-emerald-300 font-semibold">
                        ⭐ {c.goldenRule}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Endgame Drills */}
              {endgameSubTab === 'drills' && renderInteractiveDrillBoard()}
            </div>
          )}

        </div>
      </div>
    </div>
  );

  // Helper render for the interactive drill board
  function renderInteractiveDrillBoard() {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left Side: Interactive Board */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-[420px] shadow-2xl rounded-lg overflow-hidden border border-[#363430]">
            <ChessBoardContainer
              game={drillGame}
              boardOrientation={activeDrill.playerColor}
              arrows={drillArrows}
              onPlayerMove={handleDrillMove}
              isEngineThinking={false}
              playerColor={activeDrill.playerColor === 'white' ? 'w' : 'b'}
            />
          </div>
          <div className="text-[11px] text-zinc-400 mt-2 flex items-center gap-2">
            <span>Playing as: <strong className="text-white capitalize">{activeDrill.playerColor}</strong></span>
            <span>•</span>
            <span>Drag or click to move</span>
          </div>
        </div>

        {/* Right Side: Concept Lesson Card & Status */}
        <div className="lg:col-span-6 space-y-3.5 text-xs">
          <div className="p-4 rounded-xl bg-[#242320] border border-[#363430] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {activeDrill.subtitle}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                Drill {drillIndex + 1} of {phaseDrills.length}
              </span>
            </div>
            <h3 className="text-base font-bold text-white">{activeDrill.title}</h3>
            <p className="text-zinc-300 leading-relaxed pt-1">{activeDrill.conceptLesson}</p>
          </div>

          {/* Feedback Banner */}
          {feedback === 'success' && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 animate-in fade-in space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Correct Move!</span>
              </div>
              <p className="text-xs leading-relaxed">{activeDrill.explanationOnSuccess}</p>
              <button
                onClick={handleNextDrill}
                className="w-full mt-1 py-2 px-3 rounded-lg bg-[#81b64c] hover:bg-[#90cb55] text-white font-bold flex items-center justify-center gap-1.5 transition shadow"
              >
                <span>Next Drill</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {feedback === 'wrong' && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-red-400 block">Not quite the right move.</span>
                <span className="text-[11px] text-zinc-300">Try again or click Hint for the solution.</span>
              </div>
              <button
                onClick={handleResetDrill}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDrillHint}
              className="flex-1 py-2 px-3 rounded-lg bg-[#312e2b] hover:bg-[#3d3a36] text-amber-400 font-semibold flex items-center justify-center gap-1.5 transition border border-[#383631]"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Show Hint</span>
            </button>
            <button
              onClick={handleResetDrill}
              className="py-2 px-3 rounded-lg bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-400 hover:text-white transition border border-[#383631]"
              title="Reset Position"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextDrill}
              className="py-2 px-4 rounded-lg bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-200 hover:text-white transition font-semibold border border-[#383631]"
            >
              Skip Drill ❯
            </button>
          </div>

          {showHint && (
            <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs">
              💡 <strong>Hint:</strong> {activeDrill.hint}
            </div>
          )}
        </div>
      </div>
    );
  }
};
