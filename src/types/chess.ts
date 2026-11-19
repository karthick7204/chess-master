export type PieceColor = 'w' | 'b';

export type MoveQuality = 'book' | 'best' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';

export interface BoardArrow {
  from: string;
  to: string;
  color: string; // e.g. '#22c55e' (best move green) or '#ef4444' (threat red)
}

export interface TacticalContext {
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isFork?: { piece: string; square: string; targets: string[] };
  isPin?: { piece: string; square: string; pinnedTo: string };
  hangingPiece?: { piece: string; square: string; value: number };
  materialCaptured?: { piece: string; value: number };
  centerControlGained?: boolean;
  castled?: boolean;
  pieceDeveloped?: { piece: string; square: string };
  pawnStructureNote?: string;
}

export interface CoachCommentary {
  id: string;
  speaker: 'coach' | 'system';
  moveNumber: number;
  playerColor: PieceColor;
  san: string;
  quality?: MoveQuality;
  openingName?: string;
  eco?: string;
  title: string;
  explanation: string;
  threatExplanation?: string;
  betterAlternative?: {
    san: string;
    from: string;
    to: string;
    reason: string;
  };
  arrows?: BoardArrow[];
  timestamp: number;
}

export interface OpeningInfo {
  eco: string;
  name: string;
  moves: string[]; // UCI or SAN moves list
  description: string;
}

export interface CoachPersonality {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number; // Official Coach FIDE/Master Rating
  style: 'encouraging' | 'tactical' | 'positional' | 'aggressive';
  description: string;
}

export interface GameSettings {
  playerColor: PieceColor;
  difficulty: number; // 1 (800 ELO) to 5 (2200 ELO)
  personalityId: string;
  voiceEnabled: boolean;
  autoPlayCoach: boolean;
  showArrows: boolean;
  showThreats: boolean;
}
