import { PlayerLearningProfile, WeaknessCategory, WeaknessStat, InteractiveDrill } from '../types/learning';
import { COACH_DRILLS } from '../data/coachDrills';
import { MoveQuality } from '../types/chess';
import { Chess, Move } from 'chess.js';

const STORAGE_KEY = 'chess_coach_learning_profile_v1';

const INITIAL_PROFILE: PlayerLearningProfile = {
  totalMovesAnalyzed: 0,
  totalGames: 0,
  pieceSafetyMistakes: 0,
  tacticalOpportunitiesMissed: 0,
  passiveMiddlegameMoves: 0,
  missedCheckmates: 0,
  endgameInaccuracies: 0,
  solvedDrills: []
};

export class AdaptiveCoachService {
  public static getProfile(): PlayerLearningProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return { ...INITIAL_PROFILE, ...JSON.parse(data) };
      }
    } catch {
      // fallback
    }
    return { ...INITIAL_PROFILE };
  }

  public static saveProfile(profile: PlayerLearningProfile): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // fallback
    }
  }

  /**
   * Evaluates a player move and logs any relevant learning weakness
   */
  public static trackMove(
    gameBefore: Chess,
    gameAfter: Chess,
    move: Move,
    quality: MoveQuality,
    moveNumber: number,
    hangingPiece: boolean
  ): WeaknessCategory | null {
    const profile = this.getProfile();
    profile.totalMovesAnalyzed++;

    let detectedCategory: WeaknessCategory | null = null;
    const totalPieces = gameBefore.board().flat().filter(Boolean).length;
    const isEndgame = totalPieces <= 8;
    const isMiddlegame = moveNumber >= 10 && !isEndgame;

    // Check if player missed a mate-in-1
    if (gameBefore.moves().some(m => {
      const test = new Chess(gameBefore.fen());
      test.move(m);
      return test.isCheckmate();
    }) && !gameAfter.isCheckmate()) {
      profile.missedCheckmates++;
      detectedCategory = 'mating_patterns';
    } else if (hangingPiece || (quality === 'blunder' && !isEndgame)) {
      profile.pieceSafetyMistakes++;
      detectedCategory = 'piece_safety';
    } else if (isEndgame && (quality === 'mistake' || quality === 'inaccuracy' || quality === 'blunder')) {
      profile.endgameInaccuracies++;
      detectedCategory = 'endgame_technique';
    } else if (isMiddlegame && (quality === 'inaccuracy' || quality === 'mistake')) {
      profile.passiveMiddlegameMoves++;
      detectedCategory = 'middlegame_planning';
    } else if (quality === 'mistake' && (move.piece === 'n' || move.piece === 'p')) {
      profile.tacticalOpportunitiesMissed++;
      detectedCategory = 'forks_tactics';
    }

    this.saveProfile(profile);
    return detectedCategory;
  }

  /**
   * Returns current primary weakness and diagnostic stats
   */
  public static getPrimaryWeakness(): WeaknessStat {
    const p = this.getProfile();

    const stats: WeaknessStat[] = [
      {
        category: 'piece_safety',
        title: 'Piece Safety & Blunder Prevention',
        count: p.pieceSafetyMistakes,
        description: 'Leaving pieces unprotected or failing to spot opponent attacks.',
        recommendation: 'Practice the C.P.R. rule (Capture, Protect, Run) and board scanning before moving.'
      },
      {
        category: 'forks_tactics',
        title: 'Forks & Tactical Vision',
        count: p.tacticalOpportunitiesMissed,
        description: 'Missing double attacks with knights and pawns that win material.',
        recommendation: 'Train knight geometries and look for uncoordinated enemy pieces.'
      },
      {
        category: 'middlegame_planning',
        title: 'Middlegame Planning & Strategy',
        count: p.passiveMiddlegameMoves,
        description: 'Wandering aimlessly after move 10 without a clear central plan.',
        recommendation: 'Focus on open files for rooks and planting knights on central outposts.'
      },
      {
        category: 'mating_patterns',
        title: 'Checkmate Patterns & Finishing',
        count: p.missedCheckmates,
        description: 'Struggling to calculate the final mating net when the king is vulnerable.',
        recommendation: 'Master back-rank corridors and queen-helper battery checkmates.'
      },
      {
        category: 'endgame_technique',
        title: 'Endgame Technique & King Activity',
        count: p.endgameInaccuracies,
        description: 'Passive king moves and suboptimal passed pawn conversion.',
        recommendation: 'In endgames, activate your King aggressively into the center.'
      }
    ];

    // Sort by highest count of mistakes
    stats.sort((a, b) => b.count - a.count);
    return stats[0];
  }

  /**
   * Returns the best practice drill tailored to the player's primary weakness
   */
  public static getRecommendedDrill(): InteractiveDrill {
    const weakness = this.getPrimaryWeakness();
    const profile = this.getProfile();

    // Find an unsolved drill in the primary weakness category
    const categoryDrills = COACH_DRILLS.filter(d => d.category === weakness.category);
    const unsolved = categoryDrills.find(d => !profile.solvedDrills.includes(d.id));

    return unsolved || categoryDrills[0] || COACH_DRILLS[0];
  }

  public static markDrillSolved(drillId: string): void {
    const p = this.getProfile();
    if (!p.solvedDrills.includes(drillId)) {
      p.solvedDrills.push(drillId);
      this.saveProfile(p);
    }
  }

  public static recordGameFinished(): void {
    const p = this.getProfile();
    p.totalGames++;
    this.saveProfile(p);
  }
}
