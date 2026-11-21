import { Chess, Square, Move } from 'chess.js';
import { MistakeBreakdown, MoveQuality } from '../types/chess';
import { EvaluatedCandidateMove } from './stockfishEngine';
import { findHangingPiece, getPieceName, isSquareAttackedBy, detectGamePhase } from './tacticalAnalyzer';

export class MistakeAnalyzer {
  /**
   * Generates a 5-point pedagogical breakdown for any mistake, blunder, or inaccuracy:
   * 1. What the player played.
   * 2. What the best move was.
   * 3. Why the played move was bad.
   * 4. What the opponent could do in response.
   * 5. How to avoid the mistake next time.
   */
  public static analyzeMistake(
    gameBefore: Chess,
    gameAfter: Chess,
    move: Move,
    bestMove: EvaluatedCandidateMove | undefined,
    quality: MoveQuality,
    moveNumber: number
  ): { breakdown: MistakeBreakdown; conversationalCoachText: string } {
    const from = move.from as Square;
    const to = move.to as Square;
    const pieceName = getPieceName(move.piece);
    const playedMoveStr = `${pieceName} to ${to} (${move.san})`;
    const bestMoveSan = bestMove ? bestMove.san : 'a central developing move';
    const bestMovePiece = bestMove ? getPieceName(bestMove.piece as any) : 'piece';
    const bestMoveStr = bestMove ? `${bestMovePiece} to ${bestMove.to} (${bestMove.san})` : bestMoveSan;

    const movingColor = move.color;
    const phase = detectGamePhase(gameBefore, moveNumber);

    let whyBad = "";
    let opponentResponse = "";
    let howToAvoid = "";
    let conversationalCoachText = "";

    // 1. Check if moving piece away from center to the rim (e.g. Knight to a4 / Nh4)
    const isMovingToRim = (to.startsWith('a') || to.startsWith('h')) && (move.piece === 'n' || move.piece === 'b');
    
    // Check if the move left a central pawn or piece undefended that was previously defended
    const defendedPawnBefore = findDefendedCentralPawnLost(gameBefore, gameAfter, from, movingColor);
    const hangingPiece = findHangingPiece(gameAfter, movingColor);

    // ==========================================
    // ENDGAME PHASE SPECIFIC MISTAKES
    // ==========================================
    if (phase === 'endgame') {
      const isRetreatingKing = move.piece === 'k' && (to.endsWith('1') || to.endsWith('8') || to.endsWith('2') || to.endsWith('7'));
      if (isRetreatingKing) {
        whyBad = `In the endgame, the King is a powerful fighting piece worth 4 points. Retreating your King to the edge yields the center and cedes critical squares.`;
        opponentResponse = `The opposing King will march into the center, claim the opposition, and escort their passed pawns to promotion.`;
        howToAvoid = `Endgame Golden Rule: Centralize your King! March forward toward the central squares (d4, e4, d5, e5) as soon as queens are exchanged.`;
        conversationalCoachText = `Endgame Coach: Your king must be active in the endgame! Don't retreat your king; march toward the center to support your pawns.`;
      } else if (move.piece === 'p' && (quality === 'blunder' || quality === 'mistake')) {
        whyBad = `Pushing this pawn without friendly king support allows the opponent to blockade or capture it while creating an outside passed pawn.`;
        opponentResponse = `The opponent can use their active king to scoop up your overextended pawn and queen their own runner.`;
        howToAvoid = `In the endgame, advance pawns in coordination with your King. Remember the Rule of the Square before pushing.`;
        conversationalCoachText = `Endgame Coach: Pushing your pawn without king support leaves it vulnerable. Support your pawns with an active king first.`;
      }
    }

    // ==========================================
    // OPENING PHASE SPECIFIC MISTAKES
    // ==========================================
    if (!whyBad && phase === 'opening') {
      if (isMovingToRim && move.piece === 'n') {
        if (defendedPawnBefore) {
          whyBad = `Your knight is moving away from the centre without a clear purpose. You are also leaving your central pawn on ${defendedPawnBefore} undefended.`;
          opponentResponse = `The opponent can exploit your unguarded center with d5 or immediately capture your pawn on ${defendedPawnBefore}.`;
          howToAvoid = `Opening Principle: Keep your knights focused on controlling central squares (c3, f3, c6, f6) and verify that all key pawns remain guarded.`;
          conversationalCoachText = `Opening Coach: Your knight is moving away from the centre without a clear purpose, leaving your central pawn undefended. Consider ${bestMove ? `developing your ${bestMovePiece.toLowerCase()} to ${bestMove.to} instead` : 'developing toward the center'}.`;
        } else {
          whyBad = `Your knight is moving away from the centre to the edge of the board where it controls far fewer squares ("a knight on the rim is dim").`;
          opponentResponse = `The opponent can take over the open central space and restrict your knight's ability to rejoin the battle.`;
          howToAvoid = `Opening Principle: Develop knights toward the center squares where they control up to 8 squares rather than just 4 on the rim.`;
          conversationalCoachText = `Opening Coach: Your knight is moving to the edge of the board without a clear purpose. Consider ${bestMove ? `playing ${bestMove.san} to maintain central activity` : 'developing toward the center'}.`;
        }
      } else if (move.piece === 'q' && moveNumber <= 5) {
        whyBad = `Bringing your queen out this early exposes your most valuable piece to being harassed and chased by enemy minor pieces with tempo.`;
        opponentResponse = `The opponent will develop minor pieces while attacking your queen, rapidly building an insurmountable lead in development.`;
        howToAvoid = `Opening Principle: Do not bring the Queen out prematurely. Develop knights and bishops, castle your king, and only then mobilize the queen.`;
        conversationalCoachText = `Opening Coach: Bringing your queen out this early allows opponent minor pieces to chase it with tempo. Better was ${bestMove ? `developing your minor pieces with ${bestMove.san}` : 'developing minor pieces first'}.`;
      } else if (move.piece === 'p' && (to === 'f3' || to === 'f6') && moveNumber <= 8) {
        whyBad = `Pushing your f-pawn early weakens the sensitive diagonal directly to your king and deprives your knight of its natural development square.`;
        opponentResponse = `The opponent can seize the initiative with checks or rapid queen and bishop attacks along the open king diagonals.`;
        howToAvoid = `Opening Principle: Avoid pushing the f-pawn in the opening before your king is castled safely.`;
        conversationalCoachText = `Opening Coach: Pushing your f-pawn weakens critical lines leading straight to your king. Better was ${bestMove ? bestMove.san : 'castling or developing minor pieces'}.`;
      } else if ((to === 'a3' || to === 'h3' || to === 'a6' || to === 'h6') && move.piece === 'p' && moveNumber <= 8) {
        whyBad = `This edge pawn push does not fight for the center or contribute to piece development, wasting a valuable opening tempo.`;
        opponentResponse = `The opponent can advance their central pawns and minor pieces to claim total central superiority.`;
        howToAvoid = `Opening Principle: In the opening phase, focus on central pawns (e4/d4) and activating minor pieces rather than flank pawns.`;
        conversationalCoachText = `Opening Coach: This edge pawn move doesn't contest the center or help your pieces get into the game. Consider ${bestMove ? `playing ${bestMove.san}` : 'developing your pieces toward the center'}.`;
      }
    }

    // ==========================================
    // MIDDLEGAME POSITIONAL & TACTICAL MISTAKES
    // ==========================================
    if (!whyBad && hangingPiece && quality === 'blunder') {
      whyBad = `This move leaves your ${hangingPiece.piece.toLowerCase()} on ${hangingPiece.square} completely undefended.`;
      opponentResponse = `On their next turn, the opponent can simply capture your ${hangingPiece.piece.toLowerCase()} on ${hangingPiece.square} for free.`;
      howToAvoid = `Piece Safety: Before every move, ask yourself: 'Did my move stop defending any of my existing pieces, and is my opponent threatening them?'`;
      conversationalCoachText = `Coach Alert: Careful! Your ${hangingPiece.piece.toLowerCase()} on ${hangingPiece.square} is now completely undefended. Consider ${bestMove ? `playing ${bestMove.san} to maintain protection` : 'guarding it first'}.`;
    } else if (!whyBad && quality === 'blunder') {
      whyBad = `Playing ${move.san} creates a severe tactical drop in position and loses critical material or king security.`;
      opponentResponse = `The opponent can execute a forcing tactical sequence to win material or create an unstoppable attack.`;
      howToAvoid = `Always scan for forcing opponent moves (checks, captures, threats) before committing to a move.`;
      conversationalCoachText = `Playing ${move.san} allows a sharp tactical reply. A much stronger continuation was ${bestMove ? bestMove.san : 'protecting your position'}.`;
    } else if (!whyBad && quality === 'mistake') {
      whyBad = `Playing ${move.san} concedes the initiative and weakens your piece coordination.`;
      opponentResponse = `The opponent can apply direct pressure to your newly created positional weaknesses.`;
      howToAvoid = `Middlegame Principle: Focus on piece coordination, maintaining outposts, and controlling open files.`;
      conversationalCoachText = `Your move ${move.san} gives away the initiative. Better was ${bestMove ? `${bestMove.san}, which ${bestMove.reason.toLowerCase()}` : 'a more active central move'}.`;
    } else if (!whyBad) {
      // Inaccuracy
      whyBad = `Playing ${move.san} is somewhat passive and misses the most active and ambitious plan.`;
      opponentResponse = `The opponent is given extra breathing room to organize their pieces without being challenged.`;
      howToAvoid = `Look for the most energetic move that exerts maximum pressure on the opponent's position.`;
      conversationalCoachText = `Playing ${move.san} is a bit passive. Stronger was ${bestMove ? `${bestMove.san}, which ${bestMove.reason.toLowerCase()}` : 'a more active move'}.`;
    }

    return {
      breakdown: {
        playedMove: playedMoveStr,
        bestMove: bestMoveStr,
        whyBad,
        opponentResponse,
        howToAvoid
      },
      conversationalCoachText
    };
  }
}

// Helper to check if moving a piece left a central pawn (d4, e4, d5, e5) undefended
function findDefendedCentralPawnLost(
  gameBefore: Chess,
  gameAfter: Chess,
  fromSquare: Square,
  playerColor: 'w' | 'b'
): Square | null {
  const centralSquares: Square[] = ['d4', 'e4', 'd5', 'e5'];
  const opponentColor = playerColor === 'w' ? 'b' : 'w';

  for (const sq of centralSquares) {
    const piece = gameBefore.get(sq);
    if (piece && piece.type === 'p' && piece.color === playerColor) {
      // Was it defended by fromSquare before?
      const wasDefendedByMovedPiece = isSquareProtectedBySquare(gameBefore, fromSquare, sq);
      if (wasDefendedByMovedPiece) {
        // Is it now undefended or attacked after the move?
        const isAttackedNow = isSquareAttackedBy(gameAfter, sq, opponentColor);
        const isDefendedNow = isSquareAttackedBy(gameAfter, sq, playerColor);
        if (!isDefendedNow || isAttackedNow) {
          return sq;
        }
      }
    }
  }
  return null;
}

function isSquareProtectedBySquare(chess: Chess, protectorSquare: Square, targetSquare: Square): boolean {
  try {
    const moves = chess.moves({ square: protectorSquare, verbose: true });
    return moves.some(m => m.to === targetSquare);
  } catch {
    return false;
  }
}
