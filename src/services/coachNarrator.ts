import { Chess, Square, Move } from 'chess.js';
import { CoachCommentary, MoveQuality, BoardArrow } from '../types/chess';
import { findOpeningByMoves } from '../data/openings';
import { analyzeMoveTactics, findHangingPiece } from './tacticalAnalyzer';
import { ChessAnalysisEngine, EngineResult } from './stockfishEngine';

export class CoachNarrator {
  // Generate coach's commentary when the COACH makes a move
  public static explainCoachMove(
    gameBefore: Chess,
    gameAfter: Chess,
    move: Move,
    sanHistory: string[],
    moveNumber: number
  ): CoachCommentary {
    const tactics = analyzeMoveTactics(gameBefore, gameAfter, move.from as Square, move.to as Square);
    const opening = findOpeningByMoves(sanHistory);

    let title = `My Move: ${move.san}`;
    let explanation = "";

    const arrows: BoardArrow[] = [
      { from: move.from, to: move.to, color: '#38bdf8' } // Cyan arrow for coach move
    ];

    if (tactics.isCheckmate) {
      title = `Checkmate! Good game!`;
      explanation = `My ${move.san} delivers checkmate. You have no legal moves left to block or escape.`;
    } else if (tactics.isCheck) {
      title = `Check! King under attack`;
      explanation = `I'm delivering a check with ${move.san}. Notice how this forces you to spend a tempo dealing with king safety.`;
    } else if (tactics.materialCaptured) {
      title = `Tactical Capture: Won ${tactics.materialCaptured.piece}`;
      explanation = `I captured your ${tactics.materialCaptured.piece.toLowerCase()} on ${move.to}. In chess, grabbing unguarded or under-defended material gives a decisive edge.`;
    } else if (tactics.isFork) {
      title = `Double Attack (Fork)!`;
      explanation = `By placing my ${tactics.isFork.piece} on ${move.to}, I am attacking multiple targets at the same time: ${tactics.isFork.targets.join(' and ')}.`;
    } else if (tactics.castled) {
      title = `Kingside Castling: Safety & Coordination`;
      explanation = `I'm castling to tuck my King safely behind a solid pawn wall while connecting my Rooks to control the open central files.`;
    } else if (tactics.pieceDeveloped) {
      title = `Developing ${tactics.pieceDeveloped.piece} to ${move.to}`;
      explanation = `In the opening phase, activating minor pieces (knights and bishops) toward the center is fundamental. My ${tactics.pieceDeveloped.piece.toLowerCase()} now exerts pressure across key squares.`;
    } else if (tactics.centerControlGained) {
      title = `Controlling the Center: ${move.san}`;
      explanation = `I pushed to ${move.to} to contest the vital central squares. Whoever controls the center has greater mobility and attacking freedom.`;
    } else {
      title = `Strategic Maneuver: ${move.san}`;
      explanation = `I played ${move.san} to optimize my piece placement, restrict your potential counterplay, and prepare future tactical breaks.`;
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

  // Generate critique and analysis when the PLAYER makes a move
  public static critiquePlayerMove(
    gameBefore: Chess,
    gameAfter: Chess,
    move: Move,
    sanHistory: string[],
    moveNumber: number,
    bestAlternativeBeforeMove: EngineResult | null
  ): CoachCommentary {
    const tactics = analyzeMoveTactics(gameBefore, gameAfter, move.from as Square, move.to as Square);
    const opening = findOpeningByMoves(sanHistory);

    // Compute evaluation change
    const evalBefore = ChessAnalysisEngine.evaluatePosition(gameBefore);
    const evalAfter = ChessAnalysisEngine.evaluatePosition(gameAfter);

    const isWhite = move.color === 'w';
    // Eval change from player's perspective (positive is good for player)
    const evalDiff = isWhite ? (evalAfter - evalBefore) : (evalBefore - evalAfter);

    let quality: MoveQuality = 'good';
    const isBookMove = !!(opening && opening.moves.length >= sanHistory.length);

    if (isBookMove && moveNumber <= 10) {
      quality = 'book';
    } else if (evalDiff >= 20) {
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

    let title = "";
    let explanation = "";
    let threatExplanation = "";
    const arrows: BoardArrow[] = [];

    // Green arrow for player move if good, or green arrow for best move if inaccuracy/blunder
    if (bestAlternativeBeforeMove && (quality === 'inaccuracy' || quality === 'mistake' || quality === 'blunder')) {
      arrows.push({
        from: bestAlternativeBeforeMove.bestMove.from,
        to: bestAlternativeBeforeMove.bestMove.to,
        color: '#22c55e' // Green recommended arrow
      });
    }

    // Highlight user's move
    arrows.push({
      from: move.from,
      to: move.to,
      color: quality === 'blunder' ? '#ef4444' : quality === 'mistake' ? '#f97316' : '#22c55e'
    });

    // Opening recognition commentary
    if (opening && sanHistory.length <= opening.moves.length + 1) {
      if (quality === 'book') {
        title = `Book Move: ${opening.name}`;
        explanation = `You are following standard theory in the ${opening.name} (ECO ${opening.eco}). ${opening.description}`;
      } else {
        title = `${capitalize(quality)} in the ${opening.name}`;
      }
    }

    // Move quality specific pedagogical commentary
    if (quality === 'book') {
      // already set
    } else if (tactics.isCheckmate) {
      title = `Brilliant Checkmate! 🎉`;
      explanation = `Outstanding! You delivered a checkmate with ${move.san}. Total tactical precision!`;
    } else if (tactics.isFork) {
      title = `Excellent Fork with your ${tactics.isFork.piece}!`;
      explanation = `Sharp tactical vision! You placed your ${tactics.isFork.piece} on ${move.to}, forking ${tactics.isFork.targets.join(' and ')}.`;
      quality = 'best';
    } else if (tactics.materialCaptured && tactics.materialCaptured.value >= 3) {
      title = `Great Capture: Won my ${tactics.materialCaptured.piece}!`;
      explanation = `Decisive move. By capturing my ${tactics.materialCaptured.piece.toLowerCase()} on ${move.to}, you tip the material balance in your favor.`;
      quality = 'best';
    } else if (hanging) {
      title = `Blunder: Left your ${hanging.piece} hanging!`;
      explanation = `Careful! Your ${hanging.piece} on ${hanging.square} is completely undefended. On my turn, I can simply take it for free.`;
      threatExplanation = `Look at ${hanging.square} — undefended pieces are the #1 cause of lost chess games.`;
      arrows.push({
        from: hanging.square,
        to: hanging.square,
        color: '#ef4444'
      });
    } else if (quality === 'blunder') {
      title = `Blunder: Big tactical drop`;
      explanation = `This move allows a strong counter-strike. In this position, ${move.san} compromises your piece coordination or loses key material.`;
      if (bestAlternativeBeforeMove) {
        threatExplanation = `A much stronger continuation was ${bestAlternativeBeforeMove.bestMove.san}, which keeps your position active and secure.`;
      }
    } else if (quality === 'mistake') {
      title = `Mistake: Gives away the initiative`;
      explanation = `${move.san} gives me an easy plan to pressure your weaknesses. Keep an eye on piece defense and king safety.`;
      if (bestAlternativeBeforeMove) {
        threatExplanation = `Consider ${bestAlternativeBeforeMove.bestMove.san} next time to maintain the initiative.`;
      }
    } else if (quality === 'inaccuracy') {
      title = `Inaccuracy: A bit passive`;
      explanation = `${move.san} is playable, but there were more active choices available that put more pressure on the board.`;
    } else if (tactics.castled) {
      title = `Great Move: King tucked away safely!`;
      explanation = `Excellent choice! Castling safeguards your King and connects your Rooks for central play.`;
    } else if (tactics.pieceDeveloped) {
      title = `Solid Development: ${tactics.pieceDeveloped.piece} activated`;
      explanation = `Natural and sound. Getting your ${tactics.pieceDeveloped.piece.toLowerCase()} into the game on ${move.to} follows classical opening principles.`;
    } else if (tactics.centerControlGained) {
      title = `Strong Move: Center Control`;
      explanation = `Good pawn play! Fighting for central influence with ${move.san} expands your space and limits my pieces.`;
    } else {
      title = `${capitalize(quality)} Move: ${move.san}`;
      explanation = `A solid, purposeful move that maintains your position.`;
    }

    let betterAlternative = undefined;
    if (bestAlternativeBeforeMove && (quality === 'inaccuracy' || quality === 'mistake' || quality === 'blunder')) {
      betterAlternative = {
        san: bestAlternativeBeforeMove.bestMove.san,
        from: bestAlternativeBeforeMove.bestMove.from,
        to: bestAlternativeBeforeMove.bestMove.to,
        reason: `The engine prefers ${bestAlternativeBeforeMove.bestMove.san} for superior piece activity and defense.`
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
      arrows,
      timestamp: Date.now()
    };
  }
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
