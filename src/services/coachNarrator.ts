import { Chess, Square, Move } from 'chess.js';
import { CoachCommentary, MoveQuality, BoardArrow, CandidateOption, MistakeBreakdown } from '../types/chess';
import { findOpeningByMoves } from '../data/openings';
import { analyzeMoveTactics, findHangingPiece, detectGamePhase } from './tacticalAnalyzer';
import { ChessAnalysisEngine, EvaluatedCandidateMove } from './stockfishEngine';
import { MistakeAnalyzer } from './mistakeAnalyzer';

export class CoachNarrator {
  // Generate coach's commentary when the COACH makes a move (Master GM level)
  public static explainCoachMove(
    gameBefore: Chess,
    gameAfter: Chess,
    move: Move,
    sanHistory: string[],
    moveNumber: number
  ): CoachCommentary {
    const tactics = analyzeMoveTactics(gameBefore, gameAfter, move.from as Square, move.to as Square);
    const opening = findOpeningByMoves(sanHistory);
    const phase = detectGamePhase(gameBefore, moveNumber);

    let title = `Coach Move: ${move.san}`;
    let explanation = "";

    const arrows: BoardArrow[] = [
      { from: move.from, to: move.to, color: '#38bdf8' } // Cyan arrow for coach move
    ];

    if (tactics.isCheckmate) {
      title = `Checkmate! Good game!`;
      explanation = `My ${move.san} delivers checkmate. You have no legal moves left to block or escape.`;
    } else if (tactics.isCheck) {
      title = `Check! King under attack`;
      explanation = `I am delivering a check with ${move.san}. This forces an immediate response and takes away your initiative.`;
    } else if (tactics.materialCaptured) {
      title = `Winning Material: ${tactics.materialCaptured.piece}`;
      explanation = `I captured your ${tactics.materialCaptured.piece.toLowerCase()} on ${move.to}. In chess, capturing undefended material gives a decisive long-term edge.`;
    } else if (tactics.isFork) {
      title = `Double Attack (Fork)!`;
      explanation = `By placing my ${tactics.isFork.piece} on ${move.to}, I am attacking multiple targets at the same time: ${tactics.isFork.targets.join(' and ')}.`;
    } else if (tactics.castled) {
      title = `Kingside Castling: Safety & Coordination`;
      explanation = `Opening Coach: I am castling to tuck my King safely behind a solid pawn shield while connecting my Rooks to dominate open central files.`;
    } else if (phase === 'endgame' && move.piece === 'k') {
      title = `King Activation (Endgame Rule #1)`;
      explanation = `Endgame Coach: In the endgame, the King transforms into an active attacker! I am centralizing my King to control key squares and escort pawns.`;
    } else if (phase === 'endgame' && move.piece === 'p') {
      title = `Pawn Promotion Push`;
      explanation = `Endgame Coach: Passed pawns must be pushed. Advancing to ${move.to} restricts your king and creates unstoppable queening threats.`;
    } else if (phase === 'middlegame' && move.piece === 'r' && (move.to.endsWith('7') || move.to.endsWith('2'))) {
      title = `Rook on the 7th Rank! ("Pigs on the 7th")`;
      explanation = `Middlegame Coach: Infiltrating the 7th rank with my rook targets your base pawns and restricts your king to the back rank.`;
    } else if (tactics.pieceDeveloped) {
      title = `Developing ${tactics.pieceDeveloped.piece} to ${move.to}`;
      explanation = `Opening Coach: Activating minor pieces toward the center is fundamental. My ${tactics.pieceDeveloped.piece.toLowerCase()} now exerts pressure across key squares.`;
    } else if (tactics.centerControlGained) {
      title = `Controlling the Center: ${move.san}`;
      explanation = `Opening Coach: I pushed to ${move.to} to contest the center. Whoever controls central squares dictates the flow of the game.`;
    } else {
      title = `Grandmaster Move: ${move.san}`;
      explanation = `I played ${move.san} to optimize my piece placement, restrict your counterplay, and prepare future tactical breaks.`;
    }

    return {
      id: `coach-${Date.now()}-${Math.random()}`,
      speaker: 'coach',
      moveNumber,
      playerColor: move.color,
      san: move.san,
      openingName: opening?.name,
      eco: opening?.eco,
      title,
      explanation,
      arrows,
      timestamp: Date.now()
    };
  }

  // Generate human-like critique and candidate alternatives when the PLAYER makes a move
  public static critiquePlayerMove(
    gameBefore: Chess,
    gameAfter: Chess,
    move: Move,
    sanHistory: string[],
    moveNumber: number,
    candidateMoves: EvaluatedCandidateMove[]
  ): CoachCommentary {
    const tactics = analyzeMoveTactics(gameBefore, gameAfter, move.from as Square, move.to as Square);
    const opening = findOpeningByMoves(sanHistory);

    // Compute evaluation change
    const evalBefore = ChessAnalysisEngine.evaluatePosition(gameBefore);
    const evalAfter = ChessAnalysisEngine.evaluatePosition(gameAfter);

    const isWhite = move.color === 'w';
    const evalDiff = isWhite ? (evalAfter - evalBefore) : (evalBefore - evalAfter);

    // Check if player's move is among the top engine candidate moves
    const topMove = candidateMoves[0];
    const isPlayerBestMove = topMove && topMove.from === move.from && topMove.to === move.to;

    let quality: MoveQuality = 'good';
    const isBookMove = !!(opening && opening.moves.length >= sanHistory.length);

    if (isBookMove && moveNumber <= 10) {
      quality = 'book';
    } else if (isPlayerBestMove || evalDiff >= 15) {
      quality = 'best';
    } else if (evalDiff >= -25) {
      quality = 'excellent';
    } else if (evalDiff >= -70) {
      quality = 'good';
    } else if (evalDiff >= -160) {
      quality = 'inaccuracy';
    } else if (evalDiff >= -320) {
      quality = 'mistake';
    } else {
      quality = 'blunder';
    }

    // Check if player left a piece hanging
    const hanging = findHangingPiece(gameAfter, move.color);
    if (hanging && quality !== 'book' && evalDiff < -100) {
      quality = 'blunder';
    }

    // Filter candidate options to get better alternatives (excluding the move the player actually played)
    const betterMoves = candidateMoves.filter(c => !(c.from === move.from && c.to === move.to));

    const candidateOptions: CandidateOption[] = [];
    const arrows: BoardArrow[] = [];

    // 1. Arrow for the user's played move
    const playerArrowColor =
      quality === 'best'
        ? '#22c55e'
        : quality === 'blunder'
        ? '#ef4444'
        : quality === 'mistake'
        ? '#f97316'
        : quality === 'inaccuracy'
        ? '#eab308'
        : '#81b64c';

    arrows.push({
      from: move.from,
      to: move.to,
      color: playerArrowColor
    });

    // 2. Arrows & options for better alternatives
    if (!isPlayerBestMove && betterMoves.length > 0) {
      // Best alternative (Green Arrow)
      const bestOpt = betterMoves[0];
      candidateOptions.push({
        san: bestOpt.san,
        from: bestOpt.from,
        to: bestOpt.to,
        reason: bestOpt.reason,
        badge: 'best',
        arrowColor: '#81b64c',
        scoreDisplay: bestOpt.scoreDisplay
      });
      arrows.push({
        from: bestOpt.from,
        to: bestOpt.to,
        color: '#81b64c' // Green arrow for best move
      });

      // Second alternative (Blue Arrow)
      if (betterMoves.length > 1) {
        const secondOpt = betterMoves[1];
        candidateOptions.push({
          san: secondOpt.san,
          from: secondOpt.from,
          to: secondOpt.to,
          reason: secondOpt.reason,
          badge: 'alternative',
          arrowColor: '#38bdf8',
          scoreDisplay: secondOpt.scoreDisplay
        });
        arrows.push({
          from: secondOpt.from,
          to: secondOpt.to,
          color: '#38bdf8' // Blue arrow for 2nd alternative
        });
      }
    } else if (isPlayerBestMove && betterMoves.length > 0) {
      // If player played the best move, show other good alternatives too
      const alt1 = betterMoves[0];
      candidateOptions.push({
        san: alt1.san,
        from: alt1.from,
        to: alt1.to,
        reason: alt1.reason,
        badge: 'alternative',
        arrowColor: '#38bdf8',
        scoreDisplay: alt1.scoreDisplay
      });
      arrows.push({
        from: alt1.from,
        to: alt1.to,
        color: '#38bdf8'
      });
    }

    let title = "";
    let explanation = "";
    let threatExplanation = "";
    let mistakeBreakdown: MistakeBreakdown | undefined = undefined;

    // Check if the move is an Inaccuracy, Mistake, or Blunder
    const isMistake = quality === 'inaccuracy' || quality === 'mistake' || quality === 'blunder';

    if (isMistake) {
      const mistakeAnalysis = MistakeAnalyzer.analyzeMistake(
        gameBefore,
        gameAfter,
        move,
        betterMoves[0],
        quality,
        moveNumber
      );
      mistakeBreakdown = mistakeAnalysis.breakdown;
      title =
        quality === 'blunder'
          ? `Blunder: ${move.san}`
          : quality === 'mistake'
          ? `Mistake: ${move.san}`
          : `Inaccuracy: ${move.san}`;
      explanation = mistakeAnalysis.conversationalCoachText;
      threatExplanation = mistakeAnalysis.breakdown.opponentResponse;
    } else if (quality === 'best') {
      title = `Best Move! 🌟 ${move.san}`;
      explanation = `You found the most accurate move on the board! Playing ${move.san} keeps your position active and maintains optimal piece harmony.`;
    } else if (quality === 'excellent') {
      title = `Excellent Move! 👏 ${move.san}`;
      explanation = `Very strong move! Playing ${move.san} maintains your positional advantage and keeps up the pressure.`;
    } else if (tactics.isCheckmate) {
      title = `Brilliant Checkmate! 🎉`;
      explanation = `Outstanding tactical vision! You delivered checkmate with ${move.san}. Game over!`;
    } else {
      title = `Good Move: ${move.san}`;
      explanation = `Reasonable move. Playing ${move.san} develops your pieces and maintains a solid, playable position.`;
    }

    // Better alternative backward-compatible object
    let betterAlternative = undefined;
    if (candidateOptions.length > 0) {
      betterAlternative = {
        san: candidateOptions[0].san,
        from: candidateOptions[0].from,
        to: candidateOptions[0].to,
        reason: candidateOptions[0].reason
      };
    }

    return {
      id: `player-${Date.now()}-${Math.random()}`,
      speaker: 'coach',
      moveNumber,
      playerColor: move.color,
      san: move.san,
      quality,
      openingName: opening?.name,
      eco: opening?.eco,
      title,
      explanation,
      threatExplanation,
      betterAlternative,
      candidateOptions,
      mistakeBreakdown,
      arrows,
      timestamp: Date.now()
    };
  }
}
