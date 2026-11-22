import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square, PieceSymbol } from 'chess.js';
import { BoardArrow, PieceColor, MoveQuality } from '../../types/chess';
import { SoundService } from '../../services/soundService';

interface ChessBoardContainerProps {
  game: Chess;
  boardOrientation: 'white' | 'black';
  arrows: BoardArrow[];
  onPlayerMove: (from: Square, to: Square, promotion?: PieceSymbol) => boolean;
  isEngineThinking: boolean;
  playerColor?: PieceColor;
  allowBothSides?: boolean;
  lastMove?: { from: Square; to: Square; quality?: MoveQuality } | null;
}

export const ChessBoardContainer: React.FC<ChessBoardContainerProps> = ({
  game,
  boardOrientation,
  arrows,
  onPlayerMove,
  isEngineThinking,
  playerColor = 'w',
  allowBothSides = false,
  lastMove
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);

  const activeTurnColor = game.turn();
  // Player can move if not thinking and either allowBothSides is true or it matches playerColor
  const isPlayerTurn = !isEngineThinking && (allowBothSides || activeTurnColor === playerColor);

  const getPossibleMoves = (square: Square) => {
    try {
      const moves = game.moves({ square, verbose: true });
      return moves.map(m => m.to as Square);
    } catch {
      return [];
    }
  };

  const handleSquareClick = (square: Square) => {
    if (!isPlayerTurn || isEngineThinking) return;

    if (selectedSquare) {
      if (possibleMoves.includes(square)) {
        const piece = game.get(selectedSquare);
        const isPromotion = piece?.type === 'p' && ((piece.color === 'w' && square.endsWith('8')) || (piece.color === 'b' && square.endsWith('1')));
        const success = onPlayerMove(selectedSquare, square, isPromotion ? 'q' : undefined);
        if (success) {
          SoundService.playMove();
        }
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }
    }

    const piece = game.get(square);
    const canSelectPiece = piece && (allowBothSides ? piece.color === activeTurnColor : piece.color === playerColor);
    if (canSelectPiece) {
      setSelectedSquare(square);
      setPossibleMoves(getPossibleMoves(square));
    } else {
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  const handlePieceDrop = (sourceSquare: Square, targetSquare: Square): boolean => {
    if (!isPlayerTurn || isEngineThinking) return false;

    const piece = game.get(sourceSquare);
    const isPromotion = piece?.type === 'p' && ((piece.color === 'w' && targetSquare.endsWith('8')) || (piece.color === 'b' && targetSquare.endsWith('1')));

    const success = onPlayerMove(sourceSquare, targetSquare, isPromotion ? 'q' : undefined);
    if (success) {
      SoundService.playMove();
    }
    setSelectedSquare(null);
    setPossibleMoves([]);
    return success;
  };

  // Convert our BoardArrow[] to react-chessboard customArrows
  const customArrows: [Square, Square, string][] = arrows.map(a => [
    a.from as Square,
    a.to as Square,
    a.color
  ]);

  // Square styles (Last move highlight in warm yellow, selected square, legal move dots)
  const customSquareStyles: Record<string, React.CSSProperties> = {};

  // Last move warm yellow highlight (Chess.com style)
  if (lastMove) {
    customSquareStyles[lastMove.from] = {
      backgroundColor: 'rgba(247, 236, 89, 0.42)'
    };
    customSquareStyles[lastMove.to] = {
      backgroundColor: 'rgba(247, 236, 89, 0.52)'
    };
  }

  // Selected piece highlight (Exact Chess.com cyan halo glow matching screenshot)
  if (selectedSquare) {
    customSquareStyles[selectedSquare] = {
      background: 'radial-gradient(circle, rgba(82, 178, 207, 0.65) 0%, rgba(82, 178, 207, 0.35) 60%, rgba(82, 178, 207, 0.12) 100%)',
      boxShadow: 'inset 0 0 0 2px rgba(82, 178, 207, 0.95)'
    };
  }

  // Possible move dots (Chess.com subtle discs and capture rings)
  for (const sq of possibleMoves) {
    const isCapture = !!game.get(sq);
    customSquareStyles[sq] = {
      background: isCapture
        ? 'radial-gradient(circle, transparent 56%, rgba(0, 0, 0, 0.18) 57%, rgba(0, 0, 0, 0.18) 78%, transparent 79%)'
        : 'radial-gradient(circle, rgba(0, 0, 0, 0.16) 24%, transparent 25%)',
      borderRadius: '50%'
    };
  }

  // King check red glow
  if (game.inCheck()) {
    const kingSquare = findKingSquare(game, game.turn());
    if (kingSquare) {
      customSquareStyles[kingSquare] = {
        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.8) 65%, transparent 80%)'
      };
    }
  }

  return (
    <div className="relative w-full aspect-square max-w-[684px] mx-auto overflow-hidden shadow-2xl select-none rounded-[4px] border border-black/40">
      <Chessboard
        position={game.fen()}
        boardOrientation={boardOrientation}
        onPieceDrop={handlePieceDrop}
        onSquareClick={handleSquareClick}
        isDraggablePiece={({ piece }) =>
          !isEngineThinking && isPlayerTurn && (allowBothSides ? piece[0] === activeTurnColor : piece[0] === playerColor)
        }
        customArrows={customArrows}
        customSquareStyles={customSquareStyles}
        areArrowsAllowed={true}
        snapToCursor={true}
        // Classic Brown Wooden Chessboard colors
        customDarkSquareStyle={{ backgroundColor: '#b58863' }}
        customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
        customBoardStyle={{
          borderRadius: '2px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
        }}
        animationDuration={300}
      />

      {/* Quality Badge Overlay on Last Move (e.g. ?!, !, ??) like Chess.com */}
      {lastMove && lastMove.quality && lastMove.quality !== 'good' && (
        <MoveBadgeOverlay
          targetSquare={lastMove.to}
          quality={lastMove.quality}
          boardOrientation={boardOrientation}
        />
      )}
    </div>
  );
};

// Chess.com style badge on square (e.g. "?!", "!", "??", "📖")
const MoveBadgeOverlay: React.FC<{
  targetSquare: Square;
  quality: MoveQuality;
  boardOrientation: 'white' | 'black';
}> = ({ targetSquare, quality, boardOrientation }) => {
  const file = targetSquare.charCodeAt(0) - 97; // 0..7 (a..h)
  const rank = parseInt(targetSquare[1]) - 1; // 0..7 (1..8)

  const col = boardOrientation === 'white' ? file : 7 - file;
  const row = boardOrientation === 'white' ? 7 - rank : rank;

  // Percentage offset to top-right of the square
  const leftPercent = col * 12.5 + 8.8;
  const topPercent = row * 12.5 + 0.8;

  let text = '';
  let bg = '';

  switch (quality) {
    case 'book':
      text = '📖';
      bg = 'bg-blue-500';
      break;
    case 'best':
      text = '★';
      bg = 'bg-[#81b64c]';
      break;
    case 'excellent':
      text = '!';
      bg = 'bg-[#5c8bb0]';
      break;
    case 'inaccuracy':
      text = '?!';
      bg = 'bg-[#f7c044] text-zinc-900';
      break;
    case 'mistake':
      text = '?';
      bg = 'bg-[#e58f2a] text-white';
      break;
    case 'blunder':
      text = '??';
      bg = 'bg-[#ca3431] text-white';
      break;
    default:
      return null;
  }

  return (
    <div
      style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
      className={`absolute z-10 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-md border border-white/50 pointer-events-none select-none ${bg}`}
    >
      {text}
    </div>
  );
};

function findKingSquare(game: Chess, color: 'w' | 'b'): Square | null {
  const board = game.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type === 'k' && piece.color === color) {
        const file = String.fromCharCode(97 + c);
        const rank = (8 - r).toString();
        return `${file}${rank}` as Square;
      }
    }
  }
  return null;
}
