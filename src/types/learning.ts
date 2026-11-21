import { Square } from 'chess.js';

export type CoachPhase = 'opening' | 'middlegame' | 'endgame';

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
  phase?: CoachPhase;
  title: string;
  subtitle: string;
  conceptLesson: string;
  fen: string;
  playerColor: 'white' | 'black';
  expectedMove: { from: Square; to: Square; san: string };
  hint: string;
  explanationOnSuccess: string;
}

// ==========================================
// OPENING COACH TYPES
// ==========================================
export interface OpeningPrinciple {
  id: string;
  number: number;
  title: string;
  summary: string;
  detailedExplanation: string;
  goldenRule: string;
  bestPractice: string;
  commonPitfall: string;
}

export interface OpeningRepertoireItem {
  name: string;
  eco: string;
  moves: string;
  keyIdea: string;
  targetPawnStructure: string;
}

export interface OpeningRepertoireGuide {
  playstyle: 'aggressive' | 'solid' | 'strategic';
  label: string;
  description: string;
  whiteOpenings: OpeningRepertoireItem[];
  blackOpenings: OpeningRepertoireItem[];
}

export interface OpeningTrap {
  id: string;
  name: string;
  eco: string;
  openingName: string;
  moves: string[];
  fen: string;
  trapMove: string;
  punishment: string;
  whyItFails: string;
  howToAvoid: string;
}

// ==========================================
// MIDDLEGAME COACH TYPES
// ==========================================
export interface MiddlegameConcept {
  id: string;
  topic: 'positional' | 'weaknesses' | 'coordination' | 'attacking_plans' | 'pawn_structures';
  title: string;
  subtitle: string;
  principle: string;
  diagnosticSigns: string[];
  howToPlay: string;
  exampleFens?: string;
}

// ==========================================
// ENDGAME COACH TYPES
// ==========================================
export interface EndgameConcept {
  id: string;
  topic: 'king_activity' | 'pawn_promotion' | 'rook_endgames' | 'opposition' | 'checkmates';
  title: string;
  subtitle: string;
  technique: string;
  goldenRule: string;
  stepByStepGuide: string[];
  exampleFen?: string;
}
