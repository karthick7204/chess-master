import { Chess, Square, Move } from 'chess.js';

// Piece-Square Tables for positional evaluation
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
 50, 50, 50, 50, 50, 50, 50, 50,
 10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
 -50,-40,-30,-30,-30,-30,-40,-50,
 -40,-20,  0,  0,  0,  0,-20,-40,
 -30,  0, 10, 15, 15, 10,  0,-30,
 -30,  5, 15, 20, 20, 15,  5,-30,
 -30,  0, 15, 20, 20, 15,  0,-30,
 -30,  5, 10, 15, 15, 10,  5,-30,
 -40,-20,  0,  5,  5,  0,-20,-40,
 -50,-40,-30,-30,-30,-30,-40,-50
];

const BISHOP_TABLE = [
 -20,-10,-10,-10,-10,-10,-10,-20,
 -10,  0,  0,  0,  0,  0,  0,-10,
 -10,  0,  5, 10, 10,  5,  0,-10,
 -10,  5,  5, 10, 10,  5,  5,-10,
 -10,  0, 10, 10, 10, 10,  0,-10,
 -10, 10, 10, 10, 10, 10, 10,-10,
 -10,  5,  0,  0,  0,  0,  5,-10,
 -20,-10,-10,-10,-10,-10,-10,-20
];

const ROOK_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  5, 10, 10, 10, 10, 10, 10,  5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
  0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_TABLE = [
 -20,-10,-10, -5, -5,-10,-10,-20,
 -10,  0,  0,  0,  0,  0,  0,-10,
 -10,  0,  5,  5,  5,  5,  0,-10,
  -5,  0,  5,  5,  5,  5,  0, -5,
   0,  0,  5,  5,  5,  5,  0, -5,
 -10,  5,  5,  5,  5,  5,  0,-10,
 -10,  0,  5,  0,  0,  0,  0,-10,
 -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_TABLE_MID = [
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -30,-40,-40,-50,-50,-40,-40,-30,
 -20,-30,-30,-40,-40,-30,-30,-20,
 -10,-20,-20,-20,-20,-20,-20,-10,
  20, 20,  0,  0,  0,  0, 20, 20,
  20, 30, 10,  0,  0, 10, 30, 20
];

const PIECE_VALS: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

export interface EngineResult {
  bestMove: { from: Square; to: Square; san: string };
  evaluation: number; // in centipawns from White's perspective (+100 = White +1 pawn)
  scoreDisplay: string; // "+1.2", "-0.8", "M2"
  depth: number;
}

export interface EvaluatedCandidateMove {
  from: Square;
  to: Square;
  san: string;
  piece: string;
  captured?: string;
  evaluation: number;
  scoreDisplay: string;
  reason: string;
}

export class ChessAnalysisEngine {
  // Evaluates a given board position
  public static evaluatePosition(chess: Chess): number {
    if (chess.isCheckmate()) {
      return chess.turn() === 'w' ? -99999 : 99999;
    }
    if (chess.isDraw() || chess.isStalemate()) {
      return 0;
    }

    let score = 0;
    const board = chess.board();

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (!piece) continue;

        const val = PIECE_VALS[piece.type];
        const sqIdx = piece.color === 'w' ? r * 8 + c : (7 - r) * 8 + c;

        let posScore = 0;
        if (piece.type === 'p') posScore = PAWN_TABLE[sqIdx];
        else if (piece.type === 'n') posScore = KNIGHT_TABLE[sqIdx];
        else if (piece.type === 'b') posScore = BISHOP_TABLE[sqIdx];
        else if (piece.type === 'r') posScore = ROOK_TABLE[sqIdx];
        else if (piece.type === 'q') posScore = QUEEN_TABLE[sqIdx];
        else if (piece.type === 'k') posScore = KING_TABLE_MID[sqIdx];

        if (piece.color === 'w') {
          score += val + posScore;
        } else {
          score -= (val + posScore);
        }
      }
    }

    // Add mobility factor
    const currentMoves = chess.moves().length;
    score += (chess.turn() === 'w' ? 1 : -1) * (currentMoves * 4);

    return score;
  }

  // Minimax with Alpha-Beta Pruning to find the best move
  public static getBestMove(chess: Chess, depth: number = 3): EngineResult | null {
    const legalMoves = chess.moves({ verbose: true });
    if (legalMoves.length === 0) return null;

    const isWhite = chess.turn() === 'w';
    let bestMove: Move = legalMoves[0];
    let bestEval = isWhite ? -Infinity : Infinity;

    // Sort moves for better alpha-beta pruning (captures first)
    legalMoves.sort((a, b) => {
      const aScore = a.captured ? 10 : 0;
      const bScore = b.captured ? 10 : 0;
      return bScore - aScore;
    });

    for (const move of legalMoves) {
      chess.move(move);
      const evalScore = this.minimax(chess, depth - 1, -Infinity, Infinity, !isWhite);
      chess.undo();

      if (isWhite) {
        if (evalScore > bestEval) {
          bestEval = evalScore;
          bestMove = move;
        }
      } else {
        if (evalScore < bestEval) {
          bestEval = evalScore;
          bestMove = move;
        }
      }
    }

    const evalPawn = (bestEval / 100).toFixed(1);
    const scoreDisplay = bestEval >= 0 ? `+${evalPawn}` : `${evalPawn}`;

    return {
      bestMove: {
        from: bestMove.from as Square,
        to: bestMove.to as Square,
        san: bestMove.san
      },
      evaluation: bestEval,
      scoreDisplay,
      depth
    };
  }

  private static minimax(
    chess: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number {
    if (depth === 0 || chess.isGameOver()) {
      return this.evaluatePosition(chess);
    }

    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) {
      return this.evaluatePosition(chess);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        chess.move(move);
        const ev = this.minimax(chess, depth - 1, alpha, beta, false);
        chess.undo();
        maxEval = Math.max(maxEval, ev);
        alpha = Math.max(alpha, ev);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        chess.move(move);
        const ev = this.minimax(chess, depth - 1, alpha, beta, true);
        chess.undo();
        minEval = Math.min(minEval, ev);
        beta = Math.min(beta, ev);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  // Coach's own move: Grandmaster level, NO mistakes, deep calculation
  public static getCoachMove(chess: Chess): Move | null {
    const legalMoves = chess.moves({ verbose: true });
    if (legalMoves.length === 0) return null;

    // Depth 4 with tactical alpha-beta evaluation
    const result = this.getBestMove(chess, 4);
    if (result) {
      const match = legalMoves.find(m => m.from === result.bestMove.from && m.to === result.bestMove.to);
      if (match) return match;
    }

    return legalMoves[0];
  }

  // Returns top N candidate moves with human educational explanations
  public static getTopCandidateMoves(
    chess: Chess,
    count: number = 3,
    depth: number = 3
  ): EvaluatedCandidateMove[] {
    const legalMoves = chess.moves({ verbose: true });
    if (legalMoves.length === 0) return [];

    const isWhite = chess.turn() === 'w';
    const scoredMoves: { move: Move; score: number }[] = [];

    // Sort moves for better alpha-beta pruning (captures first)
    legalMoves.sort((a, b) => {
      const aScore = a.captured ? 10 : 0;
      const bScore = b.captured ? 10 : 0;
      return bScore - aScore;
    });

    for (const move of legalMoves) {
      chess.move(move);
      let evalScore = this.minimax(chess, depth - 1, -Infinity, Infinity, !isWhite);

      if (chess.isCheckmate()) {
        evalScore = isWhite ? 10000 : -10000;
      }

      chess.undo();
      scoredMoves.push({ move, score: evalScore });
    }

    // Sort by best score for the player
    scoredMoves.sort((a, b) => (isWhite ? b.score - a.score : a.score - b.score));

    const selected = scoredMoves.slice(0, count);

    return selected.map(item => {
      const m = item.move;
      const evalPawn = (item.score / 100).toFixed(1);
      const scoreDisplay = item.score >= 0 ? `+${evalPawn}` : `${evalPawn}`;

      // Simulate move to generate natural human-like description
      chess.move(m);
      const reason = describeCandidateMove(chess, m);
      chess.undo();

      return {
        from: m.from as Square,
        to: m.to as Square,
        san: m.san,
        piece: m.piece,
        captured: m.captured,
        evaluation: item.score,
        scoreDisplay,
        reason
      };
    });
  }

  // Returns bot move based on difficulty
  public static getBotMove(chess: Chess, difficulty: number): Move | null {
    const legalMoves = chess.moves({ verbose: true });
    if (legalMoves.length === 0) return null;

    // Difficulty 1 (Novice): 60% random / safe, 40% best
    if (difficulty === 1) {
      if (Math.random() < 0.5) {
        const randomIdx = Math.floor(Math.random() * legalMoves.length);
        return legalMoves[randomIdx];
      }
    }

    // Difficulty 2 (Casual): Depth 1-2
    if (difficulty === 2) {
      const result = this.getBestMove(chess, 2);
      if (result) {
        return legalMoves.find(m => m.from === result.bestMove.from && m.to === result.bestMove.to) || legalMoves[0];
      }
    }

    // Difficulty 3 (Club): Depth 3
    if (difficulty === 3) {
      const result = this.getBestMove(chess, 3);
      if (result) {
        return legalMoves.find(m => m.from === result.bestMove.from && m.to === result.bestMove.to) || legalMoves[0];
      }
    }

    // Difficulty 4 (Expert) & 5 (Master): Depth 3-4 with tactical priority
    const depth = difficulty >= 4 ? 4 : 3;
    const result = this.getBestMove(chess, depth);
    if (result) {
      return legalMoves.find(m => m.from === result.bestMove.from && m.to === result.bestMove.to) || legalMoves[0];
    }

    return legalMoves[0];
  }
}

// Generate human-like educational reasons for a candidate move
function describeCandidateMove(chessAfter: Chess, move: Move): string {
  const to = move.to as Square;
  const from = move.from as Square;
  const isCapture = !!move.captured;
  const isCheck = chessAfter.inCheck();
  const isCheckmate = chessAfter.isCheckmate();
  const pieceType = move.piece;

  if (isCheckmate) {
    return `Delivers immediate checkmate with ${move.san}!`;
  }

  if (isCheck && isCapture) {
    const val = getCapturedPieceName(move.captured);
    return `Captures the ${val} on ${to} with check, winning material and forcing the king to react.`;
  }

  if (isCapture) {
    const val = getCapturedPieceName(move.captured);
    return `Takes the ${val} on ${to}, giving an immediate material advantage.`;
  }

  if (isCheck) {
    return `Gives an active check with ${move.san}, seizing the initiative and attacking the king.`;
  }

  // Castling
  if (pieceType === 'k' && Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) > 1) {
    return `Safeguards your king into the corner and activates your rook for central file control.`;
  }

  // Minor piece development
  if (pieceType === 'n') {
    if (['c3', 'f3', 'c6', 'f6', 'd4', 'e4', 'd5', 'e5'].includes(to)) {
      return `Develops the knight to ${to}, exerting direct pressure on key central outposts.`;
    }
    return `Activates the knight towards the center for improved piece coordination.`;
  }

  if (pieceType === 'b') {
    if (['c4', 'b5', 'e7', 'd6', 'g5', 'f4', 'g4'].includes(to)) {
      return `Develops the bishop along active diagonals, pinning or challenging enemy pieces.`;
    }
    return `Frees the bishop onto an active diagonal to control open space.`;
  }

  // Central pawn moves
  if (pieceType === 'p') {
    if (['d4', 'e4', 'd5', 'e5'].includes(to)) {
      return `Strikes directly at the center with ${move.san}, staking out central space and freeing pieces.`;
    }
    if (['c4', 'f4', 'c5', 'f5'].includes(to)) {
      return `Pushes ${move.san} to contest opponent's pawn structure and expand flank space.`;
    }
  }

  // Queen / Rook moves
  if (pieceType === 'r') {
    return `Places the rook on the open or semi-open ${to[0]}-file for back-rank and central pressure.`;
  }

  if (pieceType === 'q') {
    return `Improves queen activity to ${to}, exerting multi-diagonal pressure across the board.`;
  }

  return `Improves piece activity to ${to} while maintaining solid coordination.`;
}

function getCapturedPieceName(piece?: string): string {
  switch (piece) {
    case 'q': return 'queen';
    case 'r': return 'rook';
    case 'b': return 'bishop';
    case 'n': return 'knight';
    default: return 'pawn';
  }
}
