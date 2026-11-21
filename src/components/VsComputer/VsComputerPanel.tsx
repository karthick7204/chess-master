import React, { useState } from 'react';
import { ComputerBot, COMPUTER_BOTS, PieceColor } from '../../types/chess';
import { RotateCcw, Undo2, Flag, ArrowLeftRight, ChevronDown, Check, Bot } from 'lucide-react';

interface StoredMoveRecord {
  from: string;
  to: string;
  san: string;
}

interface VsComputerPanelProps {
  currentBot: ComputerBot;
  onSelectBot: (bot: ComputerBot) => void;
  playerColor: PieceColor;
  onChangePlayerColor: (color: PieceColor) => void;
  moves: StoredMoveRecord[];
  viewingIndex: number;
  onSelectMoveIndex: (index: number) => void;
  isEngineThinking: boolean;
  isGameOver: boolean;
  turn: 'w' | 'b';
  isInCheck: boolean;
  onNewGame: (colorOverride?: PieceColor) => void;
  onTakeBack: () => void;
  onResign: () => void;
  onFlipBoard: () => void;
  canTakeBack: boolean;
}

export const VsComputerPanel: React.FC<VsComputerPanelProps> = ({
  currentBot,
  onSelectBot,
  playerColor,
  onChangePlayerColor,
  moves,
  viewingIndex,
  onSelectMoveIndex,
  isEngineThinking,
  isGameOver,
  turn,
  isInCheck,
  onNewGame,
  onTakeBack,
  onResign,
  onFlipBoard,
  canTakeBack
}) => {
  const [isBotSelectorOpen, setIsBotSelectorOpen] = useState(false);

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

  const isPlayerTurn = turn === playerColor && !isEngineThinking && !isGameOver;

  return (
    <div className="flex flex-col h-full bg-[#21201d] text-white rounded-lg overflow-hidden shadow-2xl border border-[#312e2b] select-none">
      {/* Top Header: "Play vs Computer" */}
      <div className="px-4 py-3 border-b border-[#2b2926] flex items-center justify-between bg-[#21201d]">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#81b64c]" />
          <h2 className="font-bold text-sm tracking-wide text-zinc-100 uppercase">
            Vs Computer
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-zinc-400 bg-[#2b2926] px-2 py-0.5 rounded">
          Normal Game
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
        {/* Opponent Bot Card with Selector Drawer */}
        <div className="bg-[#262522] rounded-xl border border-[#363430] p-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#312e2b] border border-zinc-700/60 flex items-center justify-center text-2xl shadow-sm">
                {currentBot.avatar}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white">{currentBot.name}</span>
                  <span className="text-xs text-zinc-400 font-semibold">({currentBot.rating})</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-tight">
                  {currentBot.title} • Level {currentBot.difficulty}/5
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsBotSelectorOpen(!isBotSelectorOpen)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[#312e2b] hover:bg-[#3d3a36] text-zinc-300 transition flex items-center gap-1"
            >
              <span>Change</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isBotSelectorOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Bot Selector List Dropdown */}
          {isBotSelectorOpen && (
            <div className="mt-3 pt-3 border-t border-[#363430] space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Choose Computer Opponent
              </div>
              <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {COMPUTER_BOTS.map(bot => {
                  const isSelected = bot.id === currentBot.id;
                  return (
                    <button
                      key={bot.id}
                      onClick={() => {
                        onSelectBot(bot);
                        setIsBotSelectorOpen(false);
                      }}
                      className={`flex items-center justify-between p-2 rounded-lg text-left transition ${
                        isSelected
                          ? 'bg-[#81b64c]/20 border border-[#81b64c]/50 text-white'
                          : 'bg-[#1e1d1b] hover:bg-[#2b2926] text-zinc-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{bot.avatar}</span>
                        <div>
                          <div className="font-semibold text-xs leading-none">{bot.name} ({bot.rating})</div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">{bot.description}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#81b64c] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Color Selection for New Games */}
              <div className="pt-2 border-t border-[#363430] flex items-center justify-between text-xs">
                <span className="text-zinc-400 text-[11px] font-medium">Play as:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onChangePlayerColor('w')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                      playerColor === 'w' ? 'bg-[#81b64c] text-white' : 'bg-[#1e1d1b] text-zinc-400 hover:text-white'
                    }`}
                  >
                    ⚪ White
                  </button>
                  <button
                    onClick={() => onChangePlayerColor('b')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                      playerColor === 'b' ? 'bg-[#81b64c] text-white' : 'bg-[#1e1d1b] text-zinc-400 hover:text-white'
                    }`}
                  >
                    ⚫ Black
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Turn Status Banner */}
        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#262522] border border-[#363430] text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isGameOver
                  ? 'bg-zinc-500'
                  : isEngineThinking
                  ? 'bg-amber-400 animate-pulse'
                  : isPlayerTurn
                  ? 'bg-[#81b64c]'
                  : 'bg-zinc-500'
              }`}
            />
            <span className="font-semibold text-zinc-200">
              {isGameOver
                ? 'Game Finished'
                : isEngineThinking
                ? `${currentBot.name} is thinking...`
                : isPlayerTurn
                ? 'Your turn to move'
                : `${currentBot.name}'s turn`}
            </span>
          </div>

          {isInCheck && !isGameOver && (
            <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300 font-bold text-[11px]">
              Check!
            </span>
          )}
        </div>

        {/* Move History Table (Notation List) */}
        <div className="flex-1 flex flex-col min-h-[160px] max-h-[280px] bg-[#1a1917] rounded-lg border border-[#2b2926] overflow-hidden">
          <div className="px-3 py-1.5 bg-[#21201d] border-b border-[#2b2926] flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            <span>Move History</span>
            <span>{moves.length} moves</span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-1 text-xs font-mono">
            {movePairs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-600 text-xs italic py-8">
                No moves played yet
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/30">
                {movePairs.map(p => (
                  <div key={p.moveNum} className="grid grid-cols-12 py-1 px-2 items-center hover:bg-zinc-800/20 rounded">
                    <span className="col-span-2 text-zinc-500 font-semibold text-[11px]">
                      {p.moveNum}.
                    </span>

                    {/* White Move */}
                    <div className="col-span-5">
                      {p.whiteSan && p.whiteIndex !== undefined ? (
                        <button
                          onClick={() => onSelectMoveIndex(p.whiteIndex!)}
                          className={`px-1.5 py-0.5 rounded text-left transition w-full ${
                            viewingIndex === p.whiteIndex
                              ? 'bg-[#3d3a36] text-[#81b64c] font-bold'
                              : 'text-zinc-200 hover:bg-[#2b2926]'
                          }`}
                        >
                          {p.whiteSan}
                        </button>
                      ) : (
                        <span className="text-zinc-700">...</span>
                      )}
                    </div>

                    {/* Black Move */}
                    <div className="col-span-5">
                      {p.blackSan && p.blackIndex !== undefined ? (
                        <button
                          onClick={() => onSelectMoveIndex(p.blackIndex!)}
                          className={`px-1.5 py-0.5 rounded text-left transition w-full ${
                            viewingIndex === p.blackIndex
                              ? 'bg-[#3d3a36] text-[#81b64c] font-bold'
                              : 'text-zinc-200 hover:bg-[#2b2926]'
                          }`}
                        >
                          {p.blackSan}
                        </button>
                      ) : (
                        <span className="text-zinc-700">...</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="p-3 bg-[#1e1d1b] border-t border-[#2b2926] space-y-2">
        <div className="grid grid-cols-4 gap-2">
          {/* Resign */}
          <button
            onClick={onResign}
            disabled={isGameOver || moves.length === 0}
            className="flex items-center justify-center p-2.5 rounded-lg bg-[#2b2926] hover:bg-[#383531] disabled:opacity-40 disabled:pointer-events-none text-zinc-400 hover:text-white transition"
            title="Resign Game"
          >
            <Flag className="w-4 h-4" />
          </button>

          {/* New Game / Rematch (Center Prominent Green) */}
          <button
            onClick={() => onNewGame()}
            className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#81b64c] hover:bg-[#73a343] text-white font-bold text-xs shadow-md transition"
            title="Start New Game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Game</span>
          </button>

          {/* Takeback */}
          <button
            onClick={onTakeBack}
            disabled={!canTakeBack || isEngineThinking}
            className="flex items-center justify-center p-2.5 rounded-lg bg-[#2b2926] hover:bg-[#383531] disabled:opacity-40 disabled:pointer-events-none text-zinc-400 hover:text-white transition"
            title="Take Back Move"
          >
            <Undo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Flip Board button */}
        <button
          onClick={onFlipBoard}
          className="w-full py-1.5 rounded text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-[#262522] transition flex items-center justify-center gap-1.5"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Flip Board</span>
        </button>
      </div>
    </div>
  );
};
