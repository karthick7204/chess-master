import { Square } from 'chess.js';

export type WeaknessCategory =
  | 'piece_safety'
  | 'forks_tactics'
  | 'middlegame_planning'
  | 'mating_patterns'
  | 'endgame_technique';

export interface WeaknessStat {
  category: WeaknessCategory;
  title: string;
  count: number;
  description: string;
  recommendation: string;
}

export interface PlayerLearningProfile {
  totalMovesAnalyzed: number;
  totalGames: number;
  pieceSafetyMistakes: number;
  tacticalOpportunitiesMissed: number;
  passiveMiddlegameMoves: number;
  missedCheckmates: number;
  endgameInaccuracies: number;
  solvedDrills: string[]; // drill IDs completed
}

export interface InteractiveDrill {
  id: string;
  category: WeaknessCategory;
  title: string;
  subtitle: string;
  conceptLesson: string;
  fen: string;
  playerColor: 'white' | 'black';
  expectedMove: { from: Square; to: Square; san: string };
  hint: string;
  explanationOnSuccess: string;
}
