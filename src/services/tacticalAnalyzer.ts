import { Chess, Square, PieceSymbol, Color } from 'chess.js';
import { TacticalContext } from '../types/chess';

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0
};

const CENTER_SQUARES: Square[] = ['d4', 'e4', 'd5', 'e5'];

export function analyzeMoveTactics(
  gameBefore: Chess,
  gameAfter: Chess,
  from: Square,
  to: Square
): TacticalContext {
  const isCheck = gameAfter.inCheck();
  const isCheckmate = gameAfter.isCheckmate();
  const isStalemate = gameAfter.isStalemate();

  const movingPieceObj = gameAfter.get(to);
  const movingColor: Color = movingPieceObj ? movingPieceObj.color : (gameBefore.turn());
  const opponentColor: Color = movingColor === 'w' ? 'b' : 'w';

  // Check if piece was captured
  let materialCaptured: { piece: string; value: number } | undefined;
  const targetBefore = gameBefore.get(to);
  if (targetBefore && targetBefore.color === opponentColor) {
    materialCaptured = {
      piece: targetBefore.type.toUpperCase(),
      value: PIECE_VALUES[targetBefore.type]
    };
  }

  // Castling
  const castled = movingPieceObj?.type === 'k' && Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) > 1;

  // Development
  let pieceDeveloped: { piece: string; square: string } | undefined;
  if (movingPieceObj && (movingPieceObj.type === 'n' || movingPieceObj.type === 'b')) {
    const startRank = movingColor === 'w' ? '1' : '8';
    if (from.endsWith(startRank) && !to.endsWith(startRank)) {
      pieceDeveloped = {
        piece: movingPieceObj.type === 'n' ? 'Knight' : 'Bishop',
        square: to
      };
    }
  }

  // Center control
  const centerControlGained = CENTER_SQUARES.includes(to);

  // Check for Fork created by the move
  let isFork: { piece: string; square: string; targets: string[] } | undefined;
  if (movingPieceObj) {
    const attackedSquares: string[] = [];
    const boardSquares = getBoardSquares();

    for (const sq of boardSquares) {
      const pieceOnSq = gameAfter.get(sq);
      if (pieceOnSq && pieceOnSq.color === opponentColor && pieceOnSq.type !== 'p') {
        // Test if this target piece is attacked by our moved piece
        if (canAttack(gameAfter, to, sq)) {
          attackedSquares.push(`${pieceOnSq.type.toUpperCase()} on ${sq}`);
        }
      }
    }

    if (attackedSquares.length >= 2) {
      isFork = {
        piece: movingPieceObj.type.toUpperCase(),
        square: to,
        targets: attackedSquares
      };
    }
  }

  // Check if user left a hanging piece (unprotected or under-protected)
  const hangingPiece = findHangingPiece(gameAfter, movingColor);

  // Check for pin created
  const isPin = detectPin(gameAfter, movingColor, to);

  return {
    isCheck,
    isCheckmate,
    isStalemate,
    isFork,
    isPin,
    hangingPiece,
    materialCaptured,
    centerControlGained,
    castled,
    pieceDeveloped
  };
}

// Check if a piece from square 'from' can attack square 'to' in the current position
export function canAttack(chess: Chess, from: Square, to: Square): boolean {
  const moves = chess.moves({ square: from, verbose: true });
  return moves.some(m => m.to === to);
}

// Find any piece of the specified color that is attacked by the opponent without sufficient defense
export function findHangingPiece(chess: Chess, playerColor: Color): { piece: string; square: string; value: number } | undefined {
  const opponentColor: Color = playerColor === 'w' ? 'b' : 'w';
  const squares = getBoardSquares();

  for (const sq of squares) {
    const piece = chess.get(sq);
    if (!piece || piece.color !== playerColor || piece.type === 'k') continue;

    // Is it attacked by opponent?
    const isAttacked = isSquareAttackedBy(chess, sq, opponentColor);
    if (isAttacked) {
      const isDefended = isSquareAttackedBy(chess, sq, playerColor);
      const pieceVal = PIECE_VALUES[piece.type];

      // If completely undefended and attacked, or attacked by a lesser piece (e.g. Queen attacked by Pawn)
      if (!isDefended && pieceVal >= 3) {
        return {
          piece: getPieceName(piece.type),
          square: sq,
          value: pieceVal
        };
      }
    }
  }
  return undefined;
}

function detectPin(chess: Chess, attackingColor: Color, attackerSquare: Square): { piece: string; square: string; pinnedTo: string } | undefined {
  const attacker = chess.get(attackerSquare);
  if (!attacker || (attacker.type !== 'b' && attacker.type !== 'r' && attacker.type !== 'q')) {
    return undefined;
  }

  const opponentColor: Color = attackingColor === 'w' ? 'b' : 'w';
  const squares = getBoardSquares();

  for (const sq of squares) {
    const piece = chess.get(sq);
    if (!piece || piece.color !== opponentColor || piece.type === 'k') continue;

    // Check if moving this piece is illegal or exposes a king check
    // If it's in the line of fire of the attacker
    if (isCollinear(attackerSquare, sq)) {
      const legalMoves = chess.moves({ square: sq, verbose: true });
      // If it has severely restricted moves due to king ray
      if (legalMoves.length === 0 && chess.inCheck() === false) {
        return {
          piece: getPieceName(piece.type),
          square: sq,
          pinnedTo: 'King'
        };
      }
    }
  }
  return undefined;
}

function isCollinear(sq1: Square, sq2: Square): boolean {
  const f1 = sq1.charCodeAt(0) - 97;
  const r1 = parseInt(sq1[1]) - 1;
  const f2 = sq2.charCodeAt(0) - 97;
  const r2 = parseInt(sq2[1]) - 1;

  const df = Math.abs(f1 - f2);
  const dr = Math.abs(r1 - r2);

  return f1 === f2 || r1 === r2 || df === dr;
}

export function isSquareAttackedBy(chess: Chess, square: Square, byColor: Color): boolean {
  const squares = getBoardSquares();
  for (const sq of squares) {
    const piece = chess.get(sq);
    if (piece && piece.color === byColor) {
      if (canAttack(chess, sq, square)) {
        return true;
      }
    }
  }
  return false;
}

export function getPieceName(symbol: PieceSymbol): string {
  switch (symbol) {
    case 'p': return 'Pawn';
    case 'n': return 'Knight';
    case 'b': return 'Bishop';
    case 'r': return 'Rook';
    case 'q': return 'Queen';
    case 'k': return 'King';
  }
}

export function getBoardSquares(): Square[] {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const squares: Square[] = [];
  for (const f of files) {
    for (const r of ranks) {
      squares.push(`${f}${r}` as Square);
    }
  }
  return squares;
}
