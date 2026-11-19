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
