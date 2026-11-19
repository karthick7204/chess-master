import { OpeningInfo } from '../types/chess';

export const OPENINGS_DATABASE: OpeningInfo[] = [
  // E4 Openings
  {
    eco: 'B00',
    name: "King's Pawn Game",
    moves: ['e4'],
    description: "The most popular first move in chess! It immediately seizes control of the central squares (d5 and f5) and frees diagonals for both the Queen and light-squared Bishop."
  },
  {
    eco: 'C20',
    name: "King's Pawn Game: Open Game",
    moves: ['e4', 'e5'],
    description: "Symmetric and classic. Black directly challenges White for the center and opens development pathways."
  },
  {
    eco: 'C40',
    name: "King's Knight Opening",
    moves: ['e4', 'e5', 'Nf3'],
    description: "The gold standard: developing a piece toward the center while immediately attacking Black's undefended e5 pawn and preparing kingside castling."
  },
  {
    eco: 'C60',
    name: "Ruy Lopez (Spanish Opening)",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
    description: "One of the oldest and deepest openings in chess history. White puts indirect pressure on e5 by attacking the knight defending it."
  },
  {
    eco: 'C65',
    name: "Ruy Lopez: Berlin Defense",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6'],
    description: "Known as the 'Berlin Wall'. Black ignores White's bishop threat and directly counterattacks White's central e4 pawn."
  },
  {
    eco: 'C70',
    name: "Ruy Lopez: Morphy Defense",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6'],
    description: "The most common response in the Ruy Lopez. Black puts the question to White's bishop immediately: capture the knight or retreat."
  },
  {
    eco: 'C50',
    name: "Italian Game (Giuoco Piano)",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    description: "A foundational opening focusing on rapid kingside piece development and targeting Black's vulnerable f7 pawn, the weakest square on the board."
  },
  {
    eco: 'C51',
    name: "Italian Game: Evans Gambit",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4'],
    description: "A fierce romantic gambit. White sacrifices the b4 pawn to gain rapid development, build a massive pawn center with c3 and d4, and launch a furious attack."
  },
  {
    eco: 'C55',
    name: "Two Knights Defense",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6'],
    description: "An aggressive, tactical counter-attack by Black, challenging White's e4 pawn instead of passively defending."
  },
  {
    eco: 'C44',
    name: "Scotch Game",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4'],
    description: "White blows open the center immediately on move 3 to create open lines for pieces."
  },
  {
    eco: 'C42',
    name: "Petrov's Defense (Russian Game)",
    moves: ['e4', 'e5', 'Nf3', 'Nf6'],
    description: "A rock-solid symmetrical defense where Black counter-attacks White's e4 pawn instead of defending e5."
  },
  {
    eco: 'C30',
    name: "King's Gambit",
    moves: ['e4', 'e5', 'f4'],
    description: "The classic swashbuckling opening! White offers a wing pawn to divert Black's e5 pawn, conquer the center with d4, and open the f-file for the rook."
  },
  {
    eco: 'B20',
    name: "Sicilian Defense",
    moves: ['e4', 'c5'],
    description: "The most aggressive and successful counter to 1. e4! Black fights for the center from the flank, aiming for an asymmetrical, dynamic middlegame."
  },
  {
    eco: 'B23',
    name: "Sicilian Defense: Closed",
    moves: ['e4', 'c5', 'Nc3'],
    description: "White avoids the sharp open lines of d4, opting for positional maneuvering and a kingside pawn expansion."
  },
  {
    eco: 'B22',
    name: "Sicilian Defense: Alapin Variation",
    moves: ['e4', 'c5', 'c3'],
    description: "White prepares to establish a dominant pawn center with d4, neutralizing Black's typical Sicilian counterplay."
  },
  {
    eco: 'B90',
    name: "Sicilian Defense: Najdorf Variation",
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'],
    description: "The favorite weapon of World Champions Garry Kasparov and Bobby Fischer. Extremely sharp, flexible, and uncompromising."
  },
  {
    eco: 'B70',
    name: "Sicilian Defense: Dragon Variation",
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6'],
    description: "Named after the constellation Draco. Black fianchettoes the dark-squared bishop onto the long diagonal, aiming directly at White's queenside."
  },
  {
    eco: 'C00',
    name: "French Defense",
    moves: ['e4', 'e6'],
    description: "A resilient, counter-attacking opening. Black prepares d5 to challenge White's center while maintaining a solid pawn chain."
  },
  {
    eco: 'C02',
    name: "French Defense: Advance Variation",
    moves: ['e4', 'e6', 'd4', 'd5', 'e5'],
    description: "White gains spatial territory on the kingside and locks the center, while Black focuses on undermining White's d4 pawn with c5."
  },
  {
    eco: 'B10',
    name: "Caro-Kann Defense",
    moves: ['e4', 'c6'],
    description: "One of the most solid defenses in all of chess. Black supports a central d5 push without boxing in the light-squared bishop."
  },
  {
    eco: 'B12',
    name: "Caro-Kann Defense: Advance Variation",
    moves: ['e4', 'c6', 'd4', 'd5', 'e5', 'Bf5'],
    description: "White locks the center with e5, but unlike the French Defense, Black smoothly develops the bishop outside the pawn chain to f5."
  },
  {
    eco: 'B01',
    name: "Scandinavian Defense",
    moves: ['e4', 'd5'],
    description: "Black immediately challenges White's e4 pawn on move 1, forcing an open center."
  },
  {
    eco: 'B07',
    name: "Pirc Defense",
    moves: ['e4', 'd6'],
    description: "A hypermodern opening. Black allows White to build a broad pawn center and plans to counterstrike it later."
  },

  // D4 Openings
  {
    eco: 'D00',
    name: "Queen's Pawn Opening",
    moves: ['d4'],
    description: "A solid, strategic opening move. Unlike 1. e4, the d4 pawn is already protected by the queen, leading to richer positional maneuvering."
  },
  {
    eco: 'D02',
    name: "London System",
    moves: ['d4', 'd5', 'Nf3', 'Nf6', 'Bf4'],
    description: "The popular, rock-solid system. White develops the dark-squared bishop outside the pawn pyramid before playing e3, creating an unshakeable fortress."
  },
  {
    eco: 'D06',
    name: "Queen's Gambit",
    moves: ['d4', 'd5', 'c4'],
    description: "White offers a wing pawn to deflect Black's central d5 pawn and seize total control of the central squares with e4."
  },
  {
    eco: 'D20',
    name: "Queen's Gambit Accepted (QGA)",
    moves: ['d4', 'd5', 'c4', 'dxc4'],
    description: "Black accepts the gambit pawn. White will easily regain the pawn while enjoying a superior center and quicker development."
  },
  {
    eco: 'D30',
    name: "Queen's Gambit Declined (QGD)",
    moves: ['d4', 'd5', 'c4', 'e6'],
    description: "The classical response played in dozens of World Championships. Black firmly protects d5 with a rock-solid pawn chain."
  },
  {
    eco: 'D10',
    name: "Slav Defense",
    moves: ['d4', 'd5', 'c4', 'c6'],
    description: "A revered defense that protects the d5 center pawn with c6, keeping the diagonal open for the light-squared bishop."
  },
  {
    eco: 'E60',
    name: "King's Indian Defense (KID)",
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'],
    description: "A ferocious, hypermodern favorite of Garry Kasparov. Black lets White occupy the center, castles quickly, and launches a crushing pawn storm on White's king."
  },
  {
    eco: 'E20',
    name: "Nimzo-Indian Defense",
    moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'],
    description: "One of Black's most respected defenses. Black pins White's knight on c3, controlling e4 and threatening to double White's pawns."
  },
  {
    eco: 'D80',
    name: "Grünfeld Defense",
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5'],
    description: "Hypermodern dynamic mastery: Black allows White a huge center (cxd5, e4) only to bombard it with Bg7, c5, and Qa5."
  },
  {
    eco: 'A80',
    name: "Dutch Defense",
    moves: ['d4', 'f5'],
    description: "An aggressive, asymmetrical counter. Black immediately clamps down on White's e4 square with the f-pawn."
  },

  // Flank Openings
  {
    eco: 'A10',
    name: "English Opening",
    moves: ['c4'],
    description: "A flexible flank opening. White fights for the central d5 square without committing the d- or e-pawns right away."
  },
  {
    eco: 'A04',
    name: "Réti Opening",
    moves: ['Nf3'],
    description: "Hypermodern play named after Richard Réti. White controls central squares from a distance while keeping opening options completely open."
  }
];

export function findOpeningByMoves(sanMoves: string[]): OpeningInfo | null {
  if (!sanMoves || sanMoves.length === 0) return null;

  let bestMatch: OpeningInfo | null = null;
  let maxMatchedMoves = 0;

  for (const opening of OPENINGS_DATABASE) {
    if (opening.moves.length <= sanMoves.length) {
      let isMatch = true;
      for (let i = 0; i < opening.moves.length; i++) {
        if (opening.moves[i] !== sanMoves[i]) {
          isMatch = false;
          break;
        }
      }
      if (isMatch && opening.moves.length > maxMatchedMoves) {
        bestMatch = opening;
        maxMatchedMoves = opening.moves.length;
      }
    }
  }

  return bestMatch;
}
