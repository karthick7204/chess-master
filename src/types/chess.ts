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

export interface CandidateOption {
  san: string;
  from: string;
  to: string;
  reason: string;
  badge: 'best' | 'alternative';
  arrowColor: string; // '#81b64c' (green), '#38bdf8' (blue)
  scoreDisplay?: string;
}

export interface MistakeBreakdown {
  playedMove: string;        // e.g. "Knight to a4 (Na4)"
  bestMove: string;          // e.g. "Bishop to c4 (Bc4)"
  whyBad: string;            // e.g. "Your knight is moving away from the centre without a clear purpose. You are also leaving your central pawn undefended."
  opponentResponse: string;  // e.g. "In response, opponent can strike the center with d5 or take your hanging pawn."
  howToAvoid: string;        // e.g. "Keep minor pieces focused on controlling central squares and verify pawn defenses before moving."
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
  candidateOptions?: CandidateOption[];
  mistakeBreakdown?: MistakeBreakdown;
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

export interface ComputerBot {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  difficulty: number; // 1 (600) to 5 (2200+)
  description: string;
}

export const COMPUTER_BOTS: ComputerBot[] = [
  {
    id: 'jimmy',
    name: 'Jimmy',
    title: 'Beginner',
    avatar: '🧒',
    rating: 600,
    difficulty: 1,
    description: 'Casual beginner bot, still learning piece coordination.'
  },
  {
    id: 'martin',
    name: 'Martin',
    title: 'Casual',
    avatar: '👨‍🦰',
    rating: 1000,
    difficulty: 2,
    description: 'Plays steady opening moves and seeks simple trades.'
  },
  {
    id: 'nelson',
    name: 'Nelson',
    title: 'Intermediate',
    avatar: '🧔‍♂️',
    rating: 1400,
    difficulty: 3,
    description: 'Tricky attacking bot with active queen and knight raids.'
  },
  {
    id: 'elena',
    name: 'Elena',
    title: 'Advanced',
    avatar: '👩‍💼',
    rating: 1800,
    difficulty: 4,
    description: 'Strong tactical fundamentals, solid defense, and endgame play.'
  },
  {
    id: 'stockfish',
    name: 'Stockfish Master',
    title: 'Master Engine',
    avatar: '🤖',
    rating: 2200,
    difficulty: 5,
    description: 'Deep minimax calculation with zero-token positional precision.'
  }
];

export interface GameSettings {
  playerColor: PieceColor;
  difficulty: number; // 1 (800 ELO) to 5 (2200 ELO)
  personalityId: string;
  voiceEnabled: boolean;
  autoPlayCoach: boolean;
  showArrows: boolean;
  showThreats: boolean;
}
