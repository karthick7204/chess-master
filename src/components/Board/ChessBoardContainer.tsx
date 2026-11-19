import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, Square, PieceSymbol } from 'chess.js';
import { BoardArrow, PieceColor } from '../../types/chess';
import { SoundService } from '../../services/soundService';

interface ChessBoardContainerProps {
  game: Chess;
  boardOrientation: 'white' | 'black';
  arrows: BoardArrow[];
  onPlayerMove: (from: Square, to: Square, promotion?: PieceSymbol) => boolean;
  isEngineThinking: boolean;
  playerColor: PieceColor;
}

export const ChessBoardContainer: React.FC<ChessBoardContainerProps> = ({
  game,
  boardOrientation,
  arrows,
  onPlayerMove,
  isEngineThinking,
  playerColor
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);

  const isPlayerTurn = game.turn() === playerColor;

  // Highlight possible moves on click
  const getPossibleMoves = (square: Square) => {
    const moves = game.moves({ square, verbose: true });
    return moves.map(m => m.to as Square);
  };

  const handleSquareClick = (square: Square) => {
    if (!isPlayerTurn || isEngineThinking) return;

    // If already clicked a piece and clicking target square
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

    // Select piece
    const piece = game.get(square);
    if (piece && piece.color === playerColor) {
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

  // Convert our BoardArrow[] to react-chessboard customArrows: [Square, Square, string][]
  const customArrows: [Square, Square, string][] = arrows.map(a => [
    a.from as Square,
    a.to as Square,
    a.color
  ]);

  // Custom square styles for selected square & legal move dots
  const customSquareStyles: Record<string, React.CSSProperties> = {};

  if (selectedSquare) {
    customSquareStyles[selectedSquare] = {
      backgroundColor: 'rgba(56, 189, 248, 0.45)', // Sky blue selected
      borderRadius: '4px'
    };
  }

  for (const sq of possibleMoves) {
    const isCapture = !!game.get(sq);
    customSquareStyles[sq] = {
      background: isCapture
        ? 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 80%, transparent 85%)'
        : 'radial-gradient(circle, rgba(56, 189, 248, 0.45) 25%, transparent 26%)',
      borderRadius: '50%'
    };
  }

  // King in check red glow
  if (game.inCheck()) {
    const kingSquare = findKingSquare(game, game.turn());
    if (kingSquare) {
      customSquareStyles[kingSquare] = {
        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.75) 60%, transparent 80%)',
        boxShadow: '0 0 15px rgba(239, 68, 68, 0.8)'
      };
    }
  }

  return (
    <div className="relative w-full aspect-square max-w-[580px] mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800/80 bg-slate-900">
      <Chessboard
        position={game.fen()}
        boardOrientation={boardOrientation}
        onPieceDrop={handlePieceDrop}
        onSquareClick={handleSquareClick}
        customArrows={customArrows}
        customSquareStyles={customSquareStyles}
        areArrowsAllowed={true}
        customDarkSquareStyle={{ backgroundColor: '#475569' }}
        customLightSquareStyle={{ backgroundColor: '#cbd5e1' }}
        customBoardStyle={{
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)'
        }}
        animationDuration={220}
      />

      {isEngineThinking && (
        <div className="absolute top-4 right-4 bg-slate-900/90 text-sky-400 border border-sky-500/40 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold backdrop-blur shadow-lg animate-pulse">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          Coach is thinking...
        </div>
      )}
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
