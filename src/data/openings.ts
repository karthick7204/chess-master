import { OpeningInfo } from '../types/chess';

export const OPENINGS_DATABASE: OpeningInfo[] = [
  // =========================================================================
  // 1. E4 OPENINGS: ITALIAN GAME, RUY LOPEZ, SICILIAN, FRENCH, CARO-KANN, ETC.
  // =========================================================================

  // --- ITALIAN GAME FAMILY ---
  {
    eco: 'C53',
    name: "Italian Game: Giuoco Pianissimo (Main Line)",
    moves: [
      'e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd3', 'd6',
      'O-O', 'O-O', 'Re1', 'a6', 'Bb3', 'Ba7', 'h3', 'h6', 'Nbd2', 'Re8',
      'Nf1', 'Be6', 'Ng3', 'd5'
    ],
    category: 'e4',
    side: 'white',
    description: "The classical Giuoco Pianissimo ('Quiet Game') favored by Magnus Carlsen, Garry Kasparov, and Wesley So. White plays a deep maneuvering game with c3, d3, and the famous knight maneuver Nbd2-f1-g3 to aim at the f5 square.",
    keyIdeas: [
      "Maneuver the queen's knight via Nbd2-f1-g3 targeting the f5 outpost",
      "Control d4 with c3 and prepare a timely d3-d4 breakthrough",
      "Preserve the light-squared bishop on b3/c2 to maintain diagonal pressure",
      "Prevent Black's ...Bg4 pin with h3"
    ],
    famousPlayers: "Magnus Carlsen, Garry Kasparov, Wesley So, Anatoly Karpov",
    targetPawnStructure: "Symmetrical e4/e5 pawn duo with White having c3/d3 and Black having c7/d6",
    middlegameStrategy: {
      corePawnStructure: "Symmetric e4/e5 center. White's pawns on c3 and d3 provide elastic central control without committing early to d4. Black maintains e5 and d6 with queenside expansion options.",
      whitePlans: [
        {
          title: "Knight Outpost on f5",
          description: "Route the knight from b1 -> d2 -> f1 -> g3/e3, landing on the f5 outpost square to pressure Black's castled king.",
          pawnBreaks: ["d3-d4"],
          keyMoves: ["Nbd2", "Nf1", "Ng3", "Nf5"],
          piecePlacement: "Bishop on b3/c2, Rook on e1, Knight on f5, Queen on d2"
        },
        {
          title: "Central Strike with d3-d4",
          description: "After piece mobilization is complete, prepare the central break d3-d4 to challenge Black's e5 pawn and seize space.",
          pawnBreaks: ["d3-d4"],
          keyMoves: ["Re1", "Bb3", "d4", "exd4", "cxd4"],
          piecePlacement: "Pawn duo d4+e4 dominating the central squares"
        }
      ],
      blackPlans: [
        {
          title: "Counter-strike with ...d5",
          description: "Play ...a6 and ...Ba7 to preserve the bishop, then strike back in the center with ...d6-d5 once White's knight leaves the center.",
          pawnBreaks: ["d6-d5", "c7-c5"],
          keyMoves: ["...a6", "...Ba7", "...Re8", "...Be6", "...d5"],
          piecePlacement: "Bishop safely tucked on a7, Rook active on e8, central pawn break on d5"
        },
        {
          title: "Queenside Expansion with ...b5",
          description: "Advance queenside pawns with ...b5 and ...a5, gaining space and contesting White's light-squared bishop.",
          pawnBreaks: ["b7-b5"],
          keyMoves: ["...b5", "...a5", "...Bb7"],
          piecePlacement: "Fianchetto bishop to b7 targeting White's e4 pawn"
        }
      ],
      criticalSquares: ["f5", "d4", "d5", "e4", "c3"],
      endgameTransitionNote: "If the center opens and queens are exchanged, Black's pair of bishops on a7/e6 can be strong, while White retains chances by controlling the d-file and invading with rooks."
    }
  },
  {
    eco: 'C54',
    name: "Italian Game: Center Attack (Giuoco Piano)",
    moves: [
      'e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd4', 'exd4',
      'cxd4', 'Bb4+', 'Bd2', 'Bxd2+', 'Nbxd2', 'd5', 'exd5', 'Nxd5', 'Qb3', 'Nce7', 'O-O', 'O-O'
    ],
    category: 'e4',
    side: 'white',
    description: "The sharp, classical Giuoco Piano where White wastes no time and strikes directly in the center with 5. d4, establishing an active pawn center and forcing open tactical play.",
    keyIdeas: [
      "Establish an active central pawn duo on d4 and e4",
      "Pressure Black's d5 knight with Qb3 and rooks on the open files",
      "Use open e- and c-files to activate rooks quickly"
    ],
    famousPlayers: "Paul Morphy, Mikhail Tal, Hikaru Nakamura",
    targetPawnStructure: "White Isolated Queen's Pawn (IQP) on d4 vs Black solid pawn chain",
    middlegameStrategy: {
      corePawnStructure: "White plays with an Isolated Queen's Pawn (IQP) on d4. This gives White dynamic piece activity, open c- and e-files, and attacking outposts on e5 and c5.",
      whitePlans: [
        {
          title: "Dynamic IQP Attack",
          description: "Use active piece placement (Qb3, Bc4, Rfe1) to pressure Black's kingside before Black can establish a blockade on d5.",
          pawnBreaks: ["d4-d5"],
          keyMoves: ["Qb3", "Rfe1", "Rad1", "Ne5", "d5"],
          piecePlacement: "Queen on b3, Rooks on e1 and d1, Knight on e5"
        }
      ],
      blackPlans: [
        {
          title: "Blockade & Trade Pieces",
          description: "Firmly blockade the d5 square using knights (Nce7/Nf6), trade minor pieces to diminish White's initiative, and target the isolated d4 pawn.",
          pawnBreaks: ["c7-c6"],
          keyMoves: ["...c6", "...Bf5", "...Qd6", "...Rad8"],
          piecePlacement: "Knight rooted on d5, heavy pieces lined up on the d-file attacking d4"
        }
      ],
      criticalSquares: ["d5", "d4", "e5", "f7"],
      endgameTransitionNote: "In pure endgames, the isolated d4 pawn is a permanent weakness that favors Black if White has no piece coordination remaining."
    }
  },
  {
    eco: 'C51',
    name: "Italian Game: Evans Gambit (Main Line)",
    moves: [
      'e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4', 'Bxb4', 'c3', 'Ba5',
      'd4', 'exd4', 'O-O', 'Nge7', 'cxd4', 'd5', 'exd5', 'Nxd5', 'Ba3', 'Be6', 'Bb5'
    ],
    category: 'e4',
    side: 'white',
    description: "One of the most romantic and aggressive openings in chess history. White sacrifices a wing pawn with 4. b4! to gain tempo, build an overpowering pawn center with c3 and d4, and prevent Black from castling with Ba3.",
    keyIdeas: [
      "Sacrifice the b4 pawn to gain rapid development and tempo",
      "Occupy the center with c3 and d4",
      "Slice across the board with Ba3 to prevent Black's king from castling",
      "Deliver intense pressure against the f7 and e6 squares"
    ],
    famousPlayers: "Garry Kasparov, Paul Morphy, Adolf Anderssen, Nigel Short",
    targetPawnStructure: "Open tactical center; White has d4/cxd4 pawn power against an uncastled king",
    middlegameStrategy: {
      corePawnStructure: "Dynamic open center. White has surrendered the b-pawn to dismantle Black's central footing and open lines for all pieces.",
      whitePlans: [
        {
          title: "King Hunt on the Open Files",
          description: "Prevent Black from castling with Ba3 and open the e-file with Re1 to attack the Black king stranded in the center.",
          pawnBreaks: ["d4-d5"],
          keyMoves: ["Ba3", "Re1", "Nbd2", "Qb3", "d5"],
          piecePlacement: "Dark bishop on a3, light bishop on b5/c4, Queen on b3"
        }
      ],
      blackPlans: [
        {
          title: "Consolidate and Return Material",
          description: "Return the extra pawn with ...d5 to open diagonal lines for the light-squared bishop and castle kingside safely.",
          pawnBreaks: ["d7-d5"],
          keyMoves: ["...d5", "...Be6", "...O-O", "...Nce7"],
          piecePlacement: "Bishops active on a5 and e6, safely tucking the king away"
        }
      ],
      criticalSquares: ["f7", "e8", "d5", "a3"],
      endgameTransitionNote: "If Black successfully castles and survives the storm without material loss, Black's extra pawn grants a winning endgame."
    }
  },
  {
    eco: 'C57',
    name: "Two Knights Defense: Polerio Defense",
    moves: [
      'e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Na5',
      'Bb5+', 'c6', 'dxc6', 'bxc6', 'Be2', 'h6', 'Nf3', 'e4', 'Ne5', 'Bd6',
      'd4', 'exd3', 'Nxd3', 'Qc7'
    ],
    category: 'e4',
    side: 'black',
    description: "The grandmaster response to 4. Ng5. Instead of falling into the Fried Liver, Black boldly gambits a pawn with 5...Na5! to seize a massive lead in development, kick White's knight, and launch a furious kingside assault.",
    keyIdeas: [
      "Gambit the c6 pawn to gain tempi and drive White's pieces back",
      "Kick White's knight with ...h6 and push ...e4 with huge initiative",
      "Target White's kingside with ...Bd6, ...Qc7, and ...O-O"
    ],
    famousPlayers: "Mikhail Chigorin, Paul Keres, Viswanathan Anand",
    targetPawnStructure: "Black has dynamic central space and open lines at the cost of a damaged queenside pawn structure",
    middlegameStrategy: {
      corePawnStructure: "Black has dynamic open files, active bishop diagonals, and queenside pawn majority (a7/c6), while White has an extra pawn on the kingside.",
      whitePlans: [
        {
          title: "Consolidate the Extra Pawn",
          description: "Develop Nc3 and Bf4, trade queens or minor pieces, and neutralize Black's initiative to reach an endgame with the extra pawn.",
          pawnBreaks: ["c2-c4", "f2-f4"],
          keyMoves: ["Nc3", "Bf4", "O-O", "Re1"],
          piecePlacement: "Solid pieces defending the king on g1 and covering c4/d3"
        }
      ],
      blackPlans: [
        {
          title: "Kingside Pawn & Piece Storm",
          description: "Point the dark-squared bishop at h2 (...Bd6), line up the Queen on c7, and swing rooks over for a direct attack.",
          pawnBreaks: ["e5-e4", "c6-c5"],
          keyMoves: ["...Bd6", "...Qc7", "...O-O", "...Bg4", "...Rae8"],
          piecePlacement: "Queen on c7, Bishop on d6, Rooks on e8 and d8"
        }
      ],
      criticalSquares: ["e4", "h2", "d3", "f2"],
      endgameTransitionNote: "White wins if pieces are traded peacefully; Black must play aggressively in the middlegame before White coordinates."
    }
  },

  // --- RUY LOPEZ (SPANISH OPENING) FAMILY ---
  {
    eco: 'C97',
    name: "Ruy Lopez: Closed Main Line (Chigorin)",
    moves: [
      'e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7',
      'Re1', 'b5', 'Bb3', 'd6', 'c3', 'O-O', 'h3', 'Na5', 'Bc2', 'c5',
      'd4', 'Qc7', 'Nbd2', 'cxd4', 'cxd4', 'Nc6', 'Nb3', 'a5'
    ],
    category: 'e4',
    side: 'white',
    description: "The gold standard of classical chess theory. White builds an ideal pawn center with c3 and d4 while maneuvering the knight Nbd2-f1-g3. Black expands on the queenside with ...c5 and ...Nc6, creating a rich positional masterpiece.",
    keyIdeas: [
      "Preserve the light-squared 'Spanish' bishop on c2 to target h7 and the center",
      "Maneuver knight Nbd2-f1-g3 or Nb3 to apply central squeeze",
      "Control d4 and fight for the open c-file",
      "Black counterplays with queenside space and ...cxd4 pressure"
    ],
    famousPlayers: "Garry Kasparov, Anatoly Karpov, Bobby Fischer, Magnus Carlsen",
    targetPawnStructure: "Classical Spanish pawn center with d4 vs e5 and queenside tension (c5/d4)",
    middlegameStrategy: {
      corePawnStructure: "White holds a central duo on e4/d4, supported by c3. Black exerts pressure on d4 with ...c5 and ...Nc6, with pawn advances on the queenside (a5/b5).",
      whitePlans: [
        {
          title: "Spanish Squeeze & Kingside Initiative",
          description: "Reroute pieces toward the kingside with Nf1-g3, place rooks on c1 and e1, and prepare the pawn clamp with d4-d5 or central tension.",
          pawnBreaks: ["d4-d5", "f2-f4"],
          keyMoves: ["Nbd2", "Nf1", "Ng3", "Be3", "Rc1"],
          piecePlacement: "Bishop on c2, Queen on d2, Knights on g3 and f3"
        }
      ],
      blackPlans: [
        {
          title: "Queenside Breakthrough and C-File Control",
          description: "Advance ...a4 to push White's knight off b3, open the c-file with rooks, and target White's e4 pawn.",
          pawnBreaks: ["c5xd4", "...a5-a4"],
          keyMoves: ["...a4", "...Rfc8", "...Bd7", "...Qb7"],
          piecePlacement: "Rooks on c8 and d8, Queen on b7/c7, Knight on c6"
        }
      ],
      criticalSquares: ["d4", "c4", "f5", "b3", "c2"],
      endgameTransitionNote: "White's light-squared bishop on c2 can dominate the board in minor piece endgames if Black's pawns get fixed on dark squares."
    }
  },
  {
    eco: 'C67',
    name: "Ruy Lopez: Berlin Defense (Berlin Wall)",
    moves: [
      'e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6', 'O-O', 'Nxe4', 'd4', 'Nd6',
      'Bxc6', 'dxc6', 'dxe5', 'Nf5', 'Qxd8+', 'Kxd8', 'Nc3', 'Ke8', 'h3', 'h5',
      'Bf4', 'Be7', 'Rad1', 'Be6'
    ],
    category: 'e4',
    side: 'black',
    description: "The invincible Berlin Wall. Vladimir Kramnik used this fortress to dethrone Garry Kasparov in 2000. Queens come off on move 8, leading to an asymmetrical, deeply strategic queenless middlegame.",
    keyIdeas: [
      "Early queen exchange eliminates White's direct kingside mating attack",
      "Black accepts doubled c-pawns in exchange for the long-term bishop pair",
      "White plays for a 4 vs 3 kingside pawn majority",
      "Black constructs a fortress on the light squares (Be6, Be7, h5)"
    ],
    famousPlayers: "Vladimir Kramnik, Magnus Carlsen, Viswanathan Anand",
    targetPawnStructure: "White has a 4 vs 3 kingside majority; Black has doubled c-pawns (c7/c6) and the bishop pair",
    middlegameStrategy: {
      corePawnStructure: "Asymmetrical endgame pawn structure: White has 4 pawns on the kingside against Black's 3, while Black's 4 queenside pawns are crippled by doubled c-pawns. However, Black possesses the powerful bishop pair.",
      whitePlans: [
        {
          title: "Mobilize the Kingside Pawn Majority",
          description: "Advance the kingside majority with g4 and f4, anchor knights on d5 and e4, and infiltrate on the open d-file.",
          pawnBreaks: ["e5-e6", "f4-f5", "g4-g5"],
          keyMoves: ["Nc3", "Ne4", "g4", "f4", "Rd3", "Rfd1"],
          piecePlacement: "Rooks on d1/d3, Knights on e4 and d5"
        }
      ],
      blackPlans: [
        {
          title: "Unleash the Bishop Pair",
          description: "Lock down the light squares with ...h5, coordinate the bishops on e6 and e7, and bring the king to safety on c8.",
          pawnBreaks: ["c6-c5"],
          keyMoves: ["...h5", "...Be6", "...Be7", "...Kc8", "...b6"],
          piecePlacement: "King on c8, Bishops radiating along open diagonals on e6 and e7"
        }
      ],
      criticalSquares: ["d5", "d8", "e4", "f5", "c5"],
      endgameTransitionNote: "If Black successfully activates both bishops, the bishop pair easily compensates for the doubled pawns, often producing superior endgame positions."
    }
  },
  {
    eco: 'C89',
    name: "Ruy Lopez: Marshall Attack",
    moves: [
      'e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7',
      'Re1', 'b5', 'Bb3', 'O-O', 'c3', 'd5', 'exd5', 'Nxd5', 'Nxe5', 'Nxe5',
      'Rxe5', 'c6', 'd4', 'Bd6', 'Re1', 'Qh4', 'g3', 'Qh3'
    ],
    category: 'e4',
    side: 'black',
    description: "Frank Marshall kept this counter-gambit secret for years before unleashing it against Capablanca. Black sacrifices a central pawn with 8...d5! to launch a ferocious, venomous kingside attack against White's monarch.",
    keyIdeas: [
      "Sacrifice the e5 pawn with 8...d5 to blast open files and diagonals",
      "Place Queen on h3 and Bishop on d6 pointing directly at h2",
      "Prepare ...Bg4 and ...Rae8 to dominate the board",
      "Force White to defend with extreme precision"
    ],
    famousPlayers: "Frank Marshall, Boris Spassky, Levon Aronian, Peter Svidler",
    targetPawnStructure: "Open tactical board; Black has massive diagonal activity in return for White's extra d4 pawn",
    middlegameStrategy: {
      corePawnStructure: "Black is down a pawn but has completely mobilized pieces pointing at White's kingside. White has pawns on d4 and c3 with a weakened light-squared shelter around g3.",
      whitePlans: [
        {
          title: "Defend Kingside & Trade Queens",
          description: "Defend h2 with g3, reroute the queen with Qd3 or Qf3, activate the bishop on e3, and trade queens to extinguish Black's attack.",
          pawnBreaks: ["d4-d5"],
          keyMoves: ["Qd3", "Be3", "Nd2", "Re4", "Qf1"],
          piecePlacement: "Bishop on e3 covering d4, Queen on f1 exchanging attackers"
        }
      ],
      blackPlans: [
        {
          title: "Lethal Kingside Assault",
          description: "Infiltrate with ...Bg4, double rooks on the e-file with ...Rae8, and look for sacrifices on g3 or f2 to deliver checkmate.",
          pawnBreaks: ["f7-f5", "f5-f4"],
          keyMoves: ["...Bg4", "...Rae8", "...Re6", "...Rh6"],
          piecePlacement: "Queen on h3, Rook on h6, Bishop on d6, Bishop on g4"
        }
      ],
      criticalSquares: ["h2", "g3", "e1", "f3"],
      endgameTransitionNote: "If White neutralizes the mating threats and trades into an endgame, White's extra pawn ensures victory."
    }
  },

  // --- SICILIAN DEFENSE FAMILY ---
  {
    eco: 'B90',
    name: "Sicilian Defense: Najdorf (English Attack)",
    moves: [
      'e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6',
      'Be3', 'e5', 'Nb3', 'Be6', 'f3', 'Be7', 'Qd2', 'O-O', 'O-O-O', 'Nbd7',
      'g4', 'b5', 'g5', 'b4', 'Ne2', 'Ne8', 'h4', 'a5'
    ],
    category: 'e4',
    side: 'black',
    description: "The legendary Rolls-Royce of chess openings. The English Attack produces razor-sharp, opposite-side castling battles where White launches kingside pawns (g4, h4, g5) while Black races on the queenside (b5, b4, a5).",
    keyIdeas: [
      "Opposite-side castling creates a thrilling pawn storm race",
      "White storms the kingside with f3, g4, h4, and g5",
      "Black attacks White's king with ...b5, ...b4, ...a5, and the open c-file",
      "Critical fight for the central d5 outpost"
    ],
    famousPlayers: "Garry Kasparov, Bobby Fischer, Maxime Vachier-Lagrave, Viswanathan Anand",
    targetPawnStructure: "Open Sicilian center: White has central space; Black has the half-open c-file and queenside pawn avalanche",
    middlegameStrategy: {
      corePawnStructure: "Asymmetrical open Sicilian. White has pawns on e4 and f3. Black has d6 and e5, leaving a backward pawn on d6 and a potential hole on d5, compensated by intense queenside dynamic counterplay.",
      whitePlans: [
        {
          title: "Kingside Pawn Storm",
          description: "Advance the pawns rapidly: f3 -> g4 -> h4 -> g5 -> h5, opening the g- and h-files to mate Black's king.",
          pawnBreaks: ["g5-g6", "h4-h5"],
          keyMoves: ["g4", "h4", "g5", "h5", "Bh6", "Rg1"],
          piecePlacement: "Rooks on g1 and h1, Queen on d2, King tucked on b1"
        },
        {
          title: "Occupy the d5 Hole",
          description: "Establish a permanent knight outpost on d5 to strangle Black's position and block central counterplay.",
          pawnBreaks: ["c2-c4"],
          keyMoves: ["Nd5", "Bxd5", "exd5"],
          piecePlacement: "Knight anchored on d5"
        }
      ],
      blackPlans: [
        {
          title: "Queenside Counter-Attack",
          description: "Advance ...b5, ...b4, and ...a5-a4 to kick White's knights and rip open the b- and c-files against White's king.",
          pawnBreaks: ["...b5-b4", "...d6-d5"],
          keyMoves: ["...b5", "...b4", "...a5", "...a4", "...Rc8", "...Nc5"],
          piecePlacement: "Rook on c8, Knight on c5, Bishop on e6, Queen on c7"
        }
      ],
      criticalSquares: ["d5", "c2", "g7", "h7", "c4"],
      endgameTransitionNote: "Whoever wins the race usually checkmates; if play transitions to an endgame, Black's 2-to-1 queenside pawn majority is often decisive."
    }
  },
  {
    eco: 'B78',
    name: "Sicilian Defense: Dragon (Yugoslav Attack)",
    moves: [
      'e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6',
      'Be3', 'Bg7', 'f3', 'O-O', 'Qd2', 'Nc6', 'Bc4', 'Bd7', 'O-O-O', 'Rc8',
      'Bb3', 'Ne5', 'h4', 'h5', 'Bg5', 'Rc5'
    ],
    category: 'e4',
    side: 'black',
    description: "The fiercest opening in chess. The Black dark-squared bishop breathes fire along the h8-a1 diagonal. In the Yugoslav Attack, White plays with the motto: 'Sac, sac, mate!' - launching h4-h5 while Black fires back with the classic exchange sacrifice ...Rxc3!",
    keyIdeas: [
      "The 'Dragon Bishop' on g7 dominates the long diagonal h8-a1",
      "White castles queenside and pushes h4-h5 with Bh6 to trade the dragon bishop",
      "Black relies on the c-file counter-attack and the classic ...Rxc3 exchange sacrifice",
      "Opposite-side castling leads to pure tactical calculations"
    ],
    famousPlayers: "Bent Larsen, Garry Kasparov, Teimour Radjabov, Hikaru Nakamura",
    targetPawnStructure: "Dragon structure: Black has g6/d6 with central majority; White has e4/f3/h4 kingside spearhead",
    middlegameStrategy: {
      corePawnStructure: "Black has pawns on d6 and g6. White has e4 and f3. The half-open c-file belongs to Black; White aims to open the h-file.",
      whitePlans: [
        {
          title: "Eliminate the Dragon & Open the H-File",
          description: "Trade Black's proud bishop with Bh6, blow open the h-file with h4-h5, and deliver mate with Qh6/Qxh7.",
          pawnBreaks: ["h4-h5", "g2-g4"],
          keyMoves: ["Bh6", "h4", "h5", "Bxg7", "Qh6"],
          piecePlacement: "Queen on d2/h6, Bishop on h6, Rooks on d1 and h1"
        }
      ],
      blackPlans: [
        {
          title: "The Classic ...Rxc3 Exchange Sacrifice",
          description: "Sacrifice the rook on c3 (...Rxc3!) to shatter White's pawn shield around the king and unleash the g7 bishop.",
          pawnBreaks: ["...d6-d5", "...b7-b5"],
          keyMoves: ["...Rc5", "...Rxc3", "...Qa5", "...Nc4"],
          piecePlacement: "Rook on c8/c5, Knight on e5/c4, Queen on a5, Bishop on g7"
        }
      ],
      criticalSquares: ["c3", "h7", "h5", "d5", "c4"],
      endgameTransitionNote: "If the attack peters out, Black's central pawn majority (d6/e7) can yield a powerful endgame advantage."
    }
  },
  {
    eco: 'B22',
    name: "Sicilian Defense: Alapin Variation (2. c3)",
    moves: [
      'e4', 'c5', 'c3', 'd5', 'exd5', 'Qxd5', 'd4', 'Nf6', 'Nf3', 'e6',
      'Be2', 'Nc6', 'O-O', 'Be7', 'Be3', 'cxd4', 'cxd4', 'O-O', 'Nc3', 'Qd6'
    ],
    category: 'e4',
    side: 'white',
    description: "A solid, positional anti-Sicilian favored by Evgeny Sveshnikov and Sergei Tiviakov. White avoids open Sicilian tactical minefields, building a harmonious pawn center with c3 and d4.",
    keyIdeas: [
      "Avoid sharp Sicilian theory by building an early c3+d4 pawn center",
      "Play with an Isolated Queen's Pawn (IQP) on d4 with active piece play",
      "Black strikes with early 2...d5 and blockades the d5 square"
    ],
    famousPlayers: "Evgeny Sveshnikov, Sergei Tiviakov, Anatoly Karpov",
    targetPawnStructure: "White Isolated Queen's Pawn (IQP) on d4 vs Black solid central blockade",
    middlegameStrategy: {
      corePawnStructure: "White has an isolated pawn on d4 with open c- and e-files. Black has pawns on e6 and a solid d5 blockade square.",
      whitePlans: [
        {
          title: "Kingside Battery & d4-d5 Break",
          description: "Place the bishop on d3, queen on d2/c2 forming a battery against h7, and break through with d4-d5.",
          pawnBreaks: ["d4-d5"],
          keyMoves: ["Bd3", "Qc2", "Rfe1", "Rad1", "Ne5"],
          piecePlacement: "Bishop on d3, Queen on c2, Rooks on e1 and d1"
        }
      ],
      blackPlans: [
        {
          title: "Blockade d5 and Pressure d4",
          description: "Firmly place a piece on d5, line up heavy pieces on the d-file, and attack the isolated d4 pawn.",
          pawnBreaks: ["...b7-b6", "...Bb7"],
          keyMoves: ["...Qd6", "...Rd8", "...b6", "...Bb7"],
          piecePlacement: "Queen on d6, Rook on d8, Bishop on b7"
        }
      ],
      criticalSquares: ["d4", "d5", "e5", "c4"],
      endgameTransitionNote: "In pure endgames without tactical threats, the isolated d4 pawn becomes a permanent liability that Black can target."
    }
  },

  // --- FRENCH DEFENSE FAMILY ---
  {
    eco: 'C18',
    name: "French Defense: Winawer (Poisoned Pawn)",
    moves: [
      'e4', 'e6', 'd4', 'd5', 'Nc3', 'Bb4', 'e5', 'c5', 'a3', 'Bxc3+',
      'bxc3', 'Ne7', 'Qg4', 'Qc7', 'Qxg7', 'Rg8', 'Qxh7', 'cxd4', 'Ne2', 'Nbc6',
      'f4', 'Bd7', 'Qd3', 'dxc3', 'h4', 'O-O-O'
    ],
    category: 'e4',
    side: 'black',
    description: "One of the most complex battlegrounds in all of chess theory. Black pins the knight on c3 and surrenders the dark-squared bishop, allowing White's Queen to feast on the kingside (g7 and h7) in exchange for total destruction of White's queenside center.",
    keyIdeas: [
      "White creates connected outside passed pawns on the kingside (h4/h5)",
      "Black attacks White's shattered queenside center with ...cxd4, ...Nbc6, and ...O-O-O",
      "Dynamic imbalance: passed pawns vs central piece activity"
    ],
    famousPlayers: "Mikhail Botvinnik, Bobby Fischer, Viktor Korchnoi, Ding Liren",
    targetPawnStructure: "Closed center with White e5 vs Black d5; White has tripled/doubled c-pawns and passed h-pawn",
    middlegameStrategy: {
      corePawnStructure: "Fixed center (e5 vs d5). White has doubled c-pawns (c2/c3) and a dangerous outside passed h-pawn. Black has an open c-file and queenside castling safety.",
      whitePlans: [
        {
          title: "March the Passed H-Pawn",
          description: "Push the h-pawn down the board (h4 -> h5 -> h6 -> h7) to distract Black's army while coordinating pieces with Qd3 and Be3.",
          pawnBreaks: ["f4-f5"],
          keyMoves: ["h4", "h5", "h6", "Qd3", "Rb1"],
          piecePlacement: "Passed h-pawn racing, Queen on d3, Rook on b1"
        }
      ],
      blackPlans: [
        {
          title: "Queenside & Central Counter-Invasion",
          description: "Castle queenside (...O-O-O), invade on the open c-file, and attack White's king stranded in the center.",
          pawnBreaks: ["...f7-f6"],
          keyMoves: ["...O-O-O", "...Bd7", "...Rde8", "...f6"],
          piecePlacement: "King safe on c8, Rooks on g8 and c8, Knights swarming c3 and e5"
        }
      ],
      criticalSquares: ["h7", "c2", "e5", "g2", "d4"],
      endgameTransitionNote: "White's passed h-pawn wins almost all pure endgames if White can trade off Black's active pieces."
    }
  },
  {
    eco: 'C02',
    name: "French Defense: Advance Variation",
    moves: [
      'e4', 'e6', 'd4', 'd5', 'e5', 'c5', 'c3', 'Nc6', 'Nf3', 'Qb6',
      'a3', 'Nh6', 'b4', 'cxd4', 'cxd4', 'Nf5', 'Bb2', 'Bd7', 'g4', 'Nfe7'
    ],
    category: 'e4',
    side: 'white',
    description: "The grand clash of central pawn chains. White locks the center with 3. e5, establishing a space advantage. Black immediately bombards the base of White's pawn chain at d4 with ...c5, ...Nc6, ...Qb6, and ...Nf5.",
    keyIdeas: [
      "White's pawn chain (d4-e5) restricts Black's kingside piece mobility",
      "Black attacks the base of the pawn chain at d4 relentlessly",
      "White bolsters with c3, expands with b4, and kicks Black's knight with g4",
      "Black looks for the second pawn break with ...f7-f6"
    ],
    famousPlayers: "Aaron Nimzowitsch, Evgeny Sveshnikov, Alexei Shirov",
    targetPawnStructure: "Interlocking pawn chains: White (c3-d4-e5) vs Black (c5-d5-e6)",
    middlegameStrategy: {
      corePawnStructure: "Closed interlocking pawn chain. White points toward the kingside (e5), while Black points toward the queenside (c5).",
      whitePlans: [
        {
          title: "Queenside Expansion & Kingside Clamp",
          description: "Hold the d4 pawn with Bb2, expand on the queenside with a3 and b4, and drive Black's pieces back with g4.",
          pawnBreaks: ["f4-f5"],
          keyMoves: ["a3", "b4", "Bb2", "g4", "Bd3"],
          piecePlacement: "Bishop on b2, Knight on f3, King on e1/f1"
        }
      ],
      blackPlans: [
        {
          title: "Shatter the Head of the Chain with ...f6",
          description: "After attacking d4, strike at the head of White's pawn chain with ...f7-f6 to open the f-file for the rook.",
          pawnBreaks: ["...c5xd4", "...f7-f6"],
          keyMoves: ["...f6", "...Be7", "...O-O", "...Rc8"],
          piecePlacement: "Queen on b6, Knights applying maximum pressure on d4"
        }
      ],
      criticalSquares: ["d4", "e5", "f6", "b4"],
      endgameTransitionNote: "Black's 'bad' French bishop on c8/d7 can become a major handicap in endgames unless traded or activated via e8-h5."
    }
  },

  // --- CARO-KANN DEFENSE FAMILY ---
  {
    eco: 'B18',
    name: "Caro-Kann Defense: Classical (Capablanca)",
    moves: [
      'e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Bf5', 'Ng3', 'Bg6',
      'h4', 'h6', 'Nf3', 'Nd7', 'h5', 'Bh7', 'Bd3', 'Bxd3', 'Qxd3', 'e6',
      'Bd2', 'Ngf6', 'O-O-O', 'Be7', 'Kb1', 'O-O'
    ],
    category: 'e4',
    side: 'black',
    description: "The gold standard of solid defense. Unlike the French Defense, Black solves the problem of the light-squared bishop by developing it to f5 before playing ...e6. The position is rock-solid and bulletproof.",
    keyIdeas: [
      "Develop the light-squared bishop to f5 outside the pawn chain before playing ...e6",
      "Trade light-squared bishops on d3 to eliminate White's primary attacking piece",
      "White castles queenside and gains space with h4-h5",
      "Black castles kingside and prepares the liberating ...c6-c5 central break"
    ],
    famousPlayers: "José Raúl Capablanca, Anatoly Karpov, Ding Liren, Alireza Firouzja",
    targetPawnStructure: "Semi-open center: White e4 vs Black e6/c6 pawn fortress",
    middlegameStrategy: {
      corePawnStructure: "Solid asymmetrical center. White has an e4 pawn against Black's c6/e6 pawn wall. White has pushed h4-h5, cramping Black's kingside pawn structure.",
      whitePlans: [
        {
          title: "Central Breakthrough with c4 & d5",
          description: "Castle queenside, push c4 to support central dominance, and look for tactical knight leaps to e4 or e5.",
          pawnBreaks: ["c2-c4", "d4-d5"],
          keyMoves: ["Kb1", "c4", "Ne4", "Qe2", "Rhe1"],
          piecePlacement: "King safe on b1, Rooks on e1 and d1, Queen on e2"
        }
      ],
      blackPlans: [
        {
          title: "The Liberating ...c5 Break",
          description: "Complete kingside castling, position the queen on c7, and blow open the center with the thematic ...c6-c5 pawn break.",
          pawnBreaks: ["...c6-c5"],
          keyMoves: ["...c5", "...Qc7", "...Rfe8", "...Rad8"],
          piecePlacement: "Knights on d7 and f6, Rooks on central files, Queen on c7"
        }
      ],
      criticalSquares: ["e5", "d5", "c5", "h5", "e4"],
      endgameTransitionNote: "Black has no structural weaknesses; in queenless endgames, Black often enjoys equal or slightly superior winning chances."
    }
  },

  // =========================================================================
  // 2. D4 OPENINGS: QUEEN'S GAMBIT, SLAV, KID, GRÜNFELD, NIMZO-INDIAN, LONDON
  // =========================================================================

  // --- QUEEN'S GAMBIT & DEFENSES ---
  {
    eco: 'D63',
    name: "Queen's Gambit Declined: Orthodox Defense",
    moves: [
      'd4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O',
      'Nf3', 'Nbd7', 'Rc1', 'c6', 'Bd3', 'dxc4', 'Bxc4', 'Nd5', 'Bxe7', 'Qxe7',
      'O-O', 'Nxc3', 'Rxc3', 'e5', 'Qc2', 'exd4', 'exd4', 'Nf6'
    ],
    category: 'd4',
    side: 'black',
    description: "The immortal classical defense to 1. d4. Black maintains a firm grip on the center with ...d5 and ...e6, then executes Capablanca's famous freeing maneuver (...Nd5) to exchange pieces and achieve the vital ...e5 pawn break.",
    keyIdeas: [
      "Maintain the central anchor on d5",
      "Execute Capablanca's freeing maneuver: ...Nd5 to trade minor pieces",
      "Achieve the central pawn break ...e6-e5 to activate the c8 bishop",
      "White plays for active piece pressure down the c- and e-files"
    ],
    famousPlayers: "José Raúl Capablanca, Alexander Alekhine, Garry Kasparov",
    targetPawnStructure: "Semi-open center; White has d4 IQP after exchanges vs Black active piece placement",
    middlegameStrategy: {
      corePawnStructure: "After ...e5 and exd4, White ends up with an Isolated Queen's Pawn on d4 with active piece coordination, while Black has equalized development with an outpost on d5.",
      whitePlans: [
        {
          title: "Pressure Down the C- and E-Files",
          description: "Use the rook on c3 and e1 to apply pressure on the half-open files, aiming at Black's kingside with Bd3 and Qe2.",
          pawnBreaks: ["d4-d5"],
          keyMoves: ["Re1", "Qe2", "Bd3", "Ne5"],
          piecePlacement: "Rook on c3/e1, Bishop on d3, Knight on e5"
        }
      ],
      blackPlans: [
        {
          title: "Blockade d5 & Activate Light-Squared Bishop",
          description: "Place a knight securely on d5, develop the light-squared bishop to g4 or e6, and target White's d4 pawn.",
          pawnBreaks: ["...c6-c5"],
          keyMoves: ["...Nd5", "...Bg4", "...Rfe8", "...Rad8"],
          piecePlacement: "Knight on d5, Bishop on g4, Rooks active on central files"
        }
      ],
      criticalSquares: ["d5", "e5", "d4", "c7"],
      endgameTransitionNote: "With multiple minor pieces exchanged, Black is completely solid and easily draws or outplays White in simplified endings."
    }
  },
  {
    eco: 'D35',
    name: "Queen's Gambit Declined: Exchange Variation",
    moves: [
      'd4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'cxd5', 'exd5', 'Bg5', 'c6',
      'Qc2', 'Be7', 'e3', 'Nbd7', 'Bd3', 'O-O', 'Nge2', 'Re8', 'O-O', 'Nf8',
      'f3', 'Be6', 'Rad1', 'Rc8', 'Kh1', 'a6'
    ],
    category: 'd4',
    side: 'white',
    description: "Kasparov and Botvinnik's favorite weapon against the QGD. By exchanging cxd5, White fixes the central pawn structure and initiates the legendary 'Queenside Minority Attack' (a3, b4, b5) to create permanent weaknesses in Black's pawn structure.",
    keyIdeas: [
      "The 'Minority Attack': White pushes a3, b4, b5 to attack Black's c6 pawn",
      "Create an isolated or backward c6 pawn for Black",
      "Alternative plan: Central breakthrough with f3 and e4",
      "Black seeks kingside counterplay with ...Nf8, ...Ng6, and ...Nh5"
    ],
    famousPlayers: "Garry Kasparov, Mikhail Botvinnik, Vladimir Kramnik",
    targetPawnStructure: "Carlsbad Pawn Structure: White pawns on d4/e3 vs Black pawns on d5/c6/e6",
    middlegameStrategy: {
      corePawnStructure: "The Carlsbad pawn structure: White has pawns on a2, b2, d4, e3; Black has pawns on a7, b7, c6, d5. White has fewer queenside pawns (2 vs 3), which enables the famous Minority Attack.",
      whitePlans: [
        {
          title: "The Queenside Minority Attack",
          description: "Advance a3 and b4, followed by b5, forcing an exchange on c6 to create a weak, backward c6 pawn on the open c-file.",
          pawnBreaks: ["b4-b5", "e3-e4"],
          keyMoves: ["Rab1", "a4", "b4", "b5", "bxc6"],
          piecePlacement: "Rooks on b1 and c1, Queen on c2, Bishop on d3"
        },
        {
          title: "Central Steamroller with e3-e4",
          description: "Prepare the central advance with f3, e4, taking control of the center and launching a kingside attack.",
          pawnBreaks: ["e3-e4"],
          keyMoves: ["f3", "e4", "Bf2", "Ng3"],
          piecePlacement: "Knight on e2, Bishop on d3, Pawns on e4 and d4"
        }
      ],
      blackPlans: [
        {
          title: "Kingside Knight Raid",
          description: "Reroute knights toward the kingside (...Nf8 -> ...Ng6), plant a knight on e4, and attack White's king.",
          pawnBreaks: ["...c6-c5", "...f7-f5"],
          keyMoves: ["...Nf8", "...Ng6", "...Ne4", "...f5"],
          piecePlacement: "Knight on e4, Rook on e8, Bishop on d6"
        }
      ],
      criticalSquares: ["c6", "b5", "e4", "d4"],
      endgameTransitionNote: "If White saddles Black with a backward pawn on c6, the resulting rook and minor piece endgame is heavily favorable for White."
    }
  },
  {
    eco: 'D48',
    name: "Slav Defense: Meran Variation",
    moves: [
      'd4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'e6', 'e3', 'Nbd7',
      'Bd3', 'dxc4', 'Bxc4', 'b5', 'Bd3', 'a6', 'e4', 'c5', 'e5', 'cxd4',
      'Nxb5', 'axb5', 'exf6', 'gxf6', 'O-O', 'Qb6'
    ],
    category: 'd4',
    side: 'black',
    description: "One of the most complex, theoretical openings in world championship history. Black allows White to build an ideal pawn center with e4, only to counter-strike violently with ...b5, ...a6, and ...c5, resulting in blazing tactical warfare.",
    keyIdeas: [
      "Black surrenders the center temporarily to expand on the queenside with ...b5 and ...c5",
      "White launches central space with e4-e5 pushing for initiative",
      "Razor-sharp complications where every single move requires tactical precision"
    ],
    famousPlayers: "Viswanathan Anand, Vladimir Kramnik, Garry Kasparov, Alexey Shirov",
    targetPawnStructure: "Dynamic unbalanced pawn skeleton; Black has queenside pawn play vs White central initiative",
    middlegameStrategy: {
      corePawnStructure: "High tactical volatility. Black has traded pawns on c4 and c5, gaining a queenside pawn majority (a6/b5) and an open g-file after ...gxf6.",
      whitePlans: [
        {
          title: "Exploit Black's Damaged Kingside",
          description: "Target Black's doubled, isolated f-pawns and king safety with active piece play (Qe2, Rd1, Bf4).",
          pawnBreaks: ["d4-d5"],
          keyMoves: ["Qe2", "Rd1", "Bf4", "Re1"],
          piecePlacement: "Rook on d1 pinning Black's pieces, Queen on e2"
        }
      ],
      blackPlans: [
        {
          title: "Bishop Pair & Queenside Pawn Roll",
          description: "Fianchetto the light-squared bishop to b7, place the queen on b6, and advance the queenside pawns while using the open g-file.",
          pawnBreaks: ["...b5-b4"],
          keyMoves: ["...Bb7", "...Qb6", "...Rg8", "...b4"],
          piecePlacement: "Bishop on b7 radiating along the long diagonal, Rook on g8"
        }
      ],
      criticalSquares: ["e5", "d5", "b5", "c5", "g2"],
      endgameTransitionNote: "Black's bishop pair and queenside majority make Black very dangerous in endgames if White fails to deliver an early knockout."
    }
  },

  // --- KING'S INDIAN DEFENSE ---
  {
    eco: 'E99',
    name: "King's Indian Defense: Mar del Plata (Classical)",
    moves: [
      'd4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'Nf3', 'O-O',
      'Be2', 'e5', 'O-O', 'Nc6', 'd5', 'Ne7', 'Ne1', 'Nd7', 'Be3', 'f5',
      'f3', 'f4', 'Bf2', 'g5', 'Rc1', 'Ng6', 'c5', 'Nf6', 'cxd6', 'cxd6'
    ],
    category: 'd4',
    side: 'black',
    description: "The most ferocious, uncompromising battle in chess. The center is completely locked (White d5 vs Black e5). White attacks on the queenside with c5 aiming to break through, while Black launches an all-out kingside pawn avalanche (...f5, ...f4, ...g5, ...g4) aiming for checkmate.",
    keyIdeas: [
      "Completely locked pawn center: White attacks queenside, Black attacks kingside",
      "Black pawn avalanche: ...f5 -> ...f4 -> ...g5 -> ...g4 to mate White's king",
      "White's c-file breakthrough: c5, cxd6, Nb5, Rc7 to invade Black's queenside",
      "A pure race to see who strikes first!"
    ],
    famousPlayers: "Garry Kasparov, Bobby Fischer, Hikaru Nakamura, Teimour Radjabov",
    targetPawnStructure: "Permanently locked center: White (c4-d5-e4) vs Black (c7-d6-e5-f4)",
    middlegameStrategy: {
      corePawnStructure: "Locked central pawn chains pointing in opposite directions. White's pawn chain points toward the queenside (c5), while Black's chain points directly toward White's king (f4).",
      whitePlans: [
        {
          title: "Queenside Invasion via C-File",
          description: "Break open the queenside with c5 and cxd6, infiltrate rooks to c7, and capture Black's queenside pawns (a7, b7, d6).",
          pawnBreaks: ["c4-c5", "b2-b4"],
          keyMoves: ["c5", "cxd6", "Nb5", "Rc7", "b4"],
          piecePlacement: "Rook on c7, Knight on b5, Bishop on f2 defending kingside"
        }
      ],
      blackPlans: [
        {
          title: "The Kingside Checkmating Avalanche",
          description: "Push ...g5, ...h5, ...g4, bring the knight to h4 or g6, and sacrifice pieces on g2/h2 to deliver checkmate.",
          pawnBreaks: ["...g5-g4", "...f4-f3"],
          keyMoves: ["...g5", "...Ng6", "...h5", "...g4", "...Rf7", "...Bf8"],
          piecePlacement: "Knights on g6 and f6, Rook on f7/g7, Bishop on f8"
        }
      ],
      criticalSquares: ["c7", "d6", "g4", "f3", "g2", "h2"],
      endgameTransitionNote: "White wins almost all endgames because of superior queenside pawn structure; Black must play for checkmate or heavy piece dominance in the middlegame."
    }
  },

  // --- GRÜNFELD DEFENSE ---
  {
    eco: 'D85',
    name: "Grünfeld Defense: Exchange Variation",
    moves: [
      'd4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5', 'cxd5', 'Nxd5', 'e4', 'Nxc3',
      'bxc3', 'Bg7', 'Nf3', 'c5', 'Rb1', 'O-O', 'Be2', 'cxd4', 'cxd4',
      'Qa5+', 'Bd2', 'Qxa2', 'O-O', 'Bg4', 'Bg5', 'h6', 'Be3', 'Nc6'
    ],
    category: 'd4',
    side: 'black',
    description: "The dynamic hypermodern masterpiece championed by Garry Kasparov against Anatoly Karpov. Black allows White to construct a massive classical pawn center (c3, d4, e4), only to bombard it from afar with ...Bg7, ...c5, and queenside piece pressure.",
    keyIdeas: [
      "Surrender the center to White, then relentlessly attack it from the flanks",
      "The monster bishop on g7 exerts relentless pressure on d4",
      "Strike with ...c5 and ...Nc6 to undermine White's pawn foundation",
      "White relies on a dominant central pawn space advantage"
    ],
    famousPlayers: "Garry Kasparov, Peter Svidler, Maxime Vachier-Lagrave, Bobby Fischer",
    targetPawnStructure: "White dominant pawn center (d4/e4) vs Black queenside pawn counterplay and g7 bishop pressure",
    middlegameStrategy: {
      corePawnStructure: "White holds a big central pawn duo (d4/e4) with an open b-file. Black has traded the c-pawn and seeks to undermine d4 while utilizing outside passed queenside pawns.",
      whitePlans: [
        {
          title: "Central Domination & Kingside Attack",
          description: "Use the d4/e4 pawn center to restrict Black's pieces, advance d4-d5 when appropriate, and attack along the open b-file and kingside.",
          pawnBreaks: ["d4-d5", "e4-e5"],
          keyMoves: ["Be3", "O-O", "d5", "Rb3", "Qd2"],
          piecePlacement: "Rook on b1, Bishops on e2 and e3, central pawns controlling c5 and e5"
        }
      ],
      blackPlans: [
        {
          title: "Bombard White's Center & Push the A-Pawn",
          description: "Attack d4 with ...Bg4 and ...Nc6, and push the outside passed a-pawn (...a5-a4) to force White onto the defensive.",
          pawnBreaks: ["...c7-c5"],
          keyMoves: ["...Bg4", "...Nc6", "...a5", "...Rfd8"],
          piecePlacement: "Bishop on g7, Bishop on g4 pinning, Queen on a2/a5"
        }
      ],
      criticalSquares: ["d4", "c3", "b2", "d5", "a2"],
      endgameTransitionNote: "Black's outside passed a-pawn is a lethal weapon in endgames if White's central initiative is contained."
    }
  },

  // --- NIMZO-INDIAN DEFENSE ---
  {
    eco: 'E54',
    name: "Nimzo-Indian Defense: Rubinstein Variation",
    moves: [
      'd4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'e3', 'O-O', 'Bd3', 'd5',
      'Nf3', 'c5', 'O-O', 'Nc6', 'a3', 'Bxc3', 'bxc3', 'dxc4', 'Bxc4', 'Qc7',
      'Bd3', 'e5', 'Qc2', 'Re8', 'Nxe5', 'Nxe5', 'dxe5', 'Qxe5'
    ],
    category: 'd4',
    side: 'black',
    description: "One of the most respected defenses against 1. d4 at the World Championship level. Black pins White's knight with 3...Bb4, damages White's pawn structure (doubled c-pawns), and targets the resulting positional weaknesses.",
    keyIdeas: [
      "Inflict doubled c-pawns on White by trading the bishop on c3",
      "Control the vital central e4 square",
      "Strike with ...c5 and ...e5 to challenge White's center",
      "White possesses the bishop pair and central space"
    ],
    famousPlayers: "Akiba Rubinstein, Anatoly Karpov, Viswanathan Anand, Ding Liren",
    targetPawnStructure: "White doubled pawns on c3/c4 vs Black harmonious central pawn chain",
    middlegameStrategy: {
      corePawnStructure: "White has doubled pawns on c3 and c4 with an isolated a-pawn, but possesses the bishop pair and dynamic central attacking chances. Black has a clean, solid pawn structure.",
      whitePlans: [
        {
          title: "Bishop Pair & Kingside Attack",
          description: "Use the two bishops (Bd3 and Bb2/e3) aiming at Black's kingside, push f2-f4, and generate an attacking storm against Black's king.",
          pawnBreaks: ["f2-f4", "e3-e4"],
          keyMoves: ["Bd3", "f4", "e4", "Bb2", "Rae1"],
          piecePlacement: "Bishops on d3 and b2 pointing at h7 and g7, Queen on c2"
        }
      ],
      blackPlans: [
        {
          title: "Blockade & Target Doubled C-Pawns",
          description: "Target White's weak doubled pawn on c4 using ...Na5, ...Ba6, and ...Rc8, locking down the position to neutralize White's bishops.",
          pawnBreaks: ["...c5xd4"],
          keyMoves: ["...Na5", "...Ba6", "...Rc8", "...Qe5"],
          piecePlacement: "Knight on a5, Bishop on a6, Rooks on c8 and d8"
        }
      ],
      criticalSquares: ["c4", "e4", "d5", "c3"],
      endgameTransitionNote: "In simplified endgames, White's doubled c-pawns are often static targets that Black can exploit to win."
    }
  },

  // --- LONDON SYSTEM ---
  {
    eco: 'D02',
    name: "London System: Main Line (Classical)",
    moves: [
      'd4', 'd5', 'Bf4', 'Nf6', 'e3', 'c5', 'c3', 'Nc6', 'Nd2', 'e6',
      'Ngf3', 'Bd6', 'Bg3', 'O-O', 'Bd3', 'b6', 'Ne5', 'Bb7', 'f4', 'Ne7',
      'Qf3', 'Nf5', 'Bf2', 'Be7', 'g4', 'Nd6'
    ],
    category: 'd4',
    side: 'white',
    description: "The ultimate modern weapon popularized by Magnus Carlsen and Gata Kamsky. White constructs the impenetrable 'London Pyramid' (d4, e3, c3) with the dark-squared bishop actively developed outside the chain on f4 before playing e3.",
    keyIdeas: [
      "Construct the rock-solid 'London Pyramid' pawn foundation: c3-d4-e3",
      "Develop the dark-squared bishop to f4 BEFORE closing the pawn chain with e3",
      "Anchor a monster knight on e5 supported by f4 (The Pillsbury Attack)",
      "Launch a devastating kingside attack with g4 and Qf3"
    ],
    famousPlayers: "Magnus Carlsen, Gata Kamsky, Ding Liren, Hikaru Nakamura",
    targetPawnStructure: "The London Pyramid: White solid pawns on c3/d4/e3/f4 with outposts on e5",
    middlegameStrategy: {
      corePawnStructure: "Impenetrable London Pyramid. White's pawns on c3, d4, e3, and f4 lock down the center, giving White complete immunity from central counter-strikes while preparing a kingside storm.",
      whitePlans: [
        {
          title: "The Pillsbury Kingside Attack",
          description: "Plant the knight on e5, support it with f4, swing the queen to f3/h3, and push g4-g5 to blow open Black's kingside.",
          pawnBreaks: ["g4-g5", "e3-e4"],
          keyMoves: ["Ne5", "f4", "Qf3", "g4", "g5", "Qh3"],
          piecePlacement: "Knight anchored on e5, Bishop on d3, Queen on f3/h3, Rook on h1"
        }
      ],
      blackPlans: [
        {
          title: "Queenside Pressure & Center Strike",
          description: "Attack White's b2 and d4 pawns with ...Qb6 and ...cxd4, route knights via ...Ne7-f5-d6, and contest the e5 outpost.",
          pawnBreaks: ["...c5xd4", "...e6-e5"],
          keyMoves: ["...Qb6", "...cxd4", "...Ne7", "...Nf5", "...Nd6"],
          piecePlacement: "Queen on b6, Knight on d6 controlling key squares, Bishop on b7"
        }
      ],
      criticalSquares: ["e5", "d4", "f4", "b2", "e4"],
      endgameTransitionNote: "White's solid pawn chain ensures an easy, risk-free endgame if the kingside attack does not break through."
    }
  },

  // =========================================================================
  // 3. FLANK & HYPERMODERN OPENINGS: ENGLISH, CATALAN, RETI, KIA
  // =========================================================================
  {
    eco: 'A28',
    name: "English Opening: Four Knights Variation",
    moves: [
      'c4', 'e5', 'Nc3', 'Nf6', 'Nf3', 'Nc6', 'g3', 'd5', 'cxd5', 'Nxd5',
      'Bg2', 'Nb6', 'O-O', 'Be7', 'a3', 'O-O', 'b4', 'Be6', 'Rb1', 'f6',
      'd3', 'Nd4', 'Nd2', 'c6'
    ],
    category: 'flank',
    side: 'white',
    description: "A Sicilian Defense with colors reversed and White having an extra tempo! White controls the center from the flank with 1. c4, fianchettoes the light-squared bishop on g2, and expands rapidly on the queenside with a3 and b4.",
    keyIdeas: [
      "Flank control of the central d5 square without committing central pawns early",
      "Fianchetto bishop on g2 exerting long-diagonal laser pressure",
      "Queenside expansion with a3, b4, and Rb1",
      "Black holds a classical center with pawns on e5 and f6"
    ],
    famousPlayers: "Mikhail Botvinnik, Garry Kasparov, Magnus Carlsen, Levon Aronian",
    targetPawnStructure: "Reversed Sicilian: White has queenside pawn space (b4) vs Black solid center (e5/f6)",
    middlegameStrategy: {
      corePawnStructure: "Reversed Dragon structure: White has exchanged the c-pawn for Black's d-pawn, giving White an extra central pawn and queenside pawn majority.",
      whitePlans: [
        {
          title: "Queenside Pawn Avalanche",
          description: "Push b4-b5, opening the queenside and combining with the g2 bishop to pressure Black's queenside pieces.",
          pawnBreaks: ["b4-b5", "d3-d4"],
          keyMoves: ["a3", "b4", "Rb1", "b5", "Ne4"],
          piecePlacement: "Bishop on g2, Rook on b1, Knight on e4"
        }
      ],
      blackPlans: [
        {
          title: "Central Knight Outposts",
          description: "Solidify e5 with ...f6, anchor the knight on d4, and prepare central counterplay with ...Qd7 and ...Rad8.",
          pawnBreaks: ["...f6-f5"],
          keyMoves: ["...Nd4", "...Be6", "...Qd7", "...Rad8"],
          piecePlacement: "Knight anchored on d4, Bishop on e6, Queen on d7"
        }
      ],
      criticalSquares: ["d5", "d4", "b5", "c6"],
      endgameTransitionNote: "White's queenside pawn majority (a- and b-pawns) frequently creates a winning passed pawn in rook endings."
    }
  },
  {
    eco: 'E04',
    name: "Catalan Opening: Open Catalan (Main Line)",
    moves: [
      'd4', 'Nf6', 'c4', 'e6', 'g3', 'd5', 'Bg2', 'dxc4', 'Nf3', 'Be7',
      'O-O', 'O-O', 'Qc2', 'a6', 'Qxc4', 'b5', 'Qc2', 'Bb7', 'Bd2', 'Be4',
      'Qc1', 'Bb7', 'Bf4', 'Nd5', 'Nc3', 'Nxf4', 'Qxf4'
    ],
    category: 'flank',
    side: 'white',
    description: "The ultimate hypermodern weapon favored by Vladimir Kramnik and Magnus Carlsen. White combines the Queen's Gambit (d4+c4) with a kingside fianchetto (g3+Bg2). The Catalan bishop on g2 exerts monstrous positional pressure down the long diagonal.",
    keyIdeas: [
      "The 'Catalan Bishop' on g2 dominates the board along the h1-a8 diagonal",
      "Regain the c4 pawn with Qc2/Qxc4 while maintaining central space",
      "Dominate the open c-file and prevent Black's easy piece coordination"
    ],
    famousPlayers: "Vladimir Kramnik, Magnus Carlsen, Garry Kasparov, Daniil Dubov",
    targetPawnStructure: "Catalan structure: White has d4/c4 space vs Black queenside expansion with ...b5",
    middlegameStrategy: {
      corePawnStructure: "Semi-open center: Black has surrendered the d5 pawn with ...dxc4, gaining queenside space with ...b5. White controls the central d4 square and open c-file.",
      whitePlans: [
        {
          title: "Long Diagonal Domination",
          description: "Maximize the power of the g2 bishop, seize the open c-file with rooks (Rfd1, Rac1), and prepare the central push e2-e4.",
          pawnBreaks: ["e2-e4", "d4-d5"],
          keyMoves: ["Qc2", "Bg2", "Rfd1", "Rac1", "e4"],
          piecePlacement: "Bishop on g2, Queen on f4/c2, Rooks on c1 and d1"
        }
      ],
      blackPlans: [
        {
          title: "Neutralize the Catalan Bishop",
          description: "Blunt the g2 bishop by cementing ...Bb7, contest the c-file with ...Rc8, and break in the center with ...c5.",
          pawnBreaks: ["...c7-c5"],
          keyMoves: ["...b5", "...Bb7", "...Nd7", "...c5", "...Rc8"],
          piecePlacement: "Bishop on b7, Knight on d7/d5, Rooks on c8 and d8"
        }
      ],
      criticalSquares: ["c4", "c7", "d5", "e4", "b7"],
      endgameTransitionNote: "The Catalan bishop on g2 remains a permanent asset deep into the endgame, constantly restricting Black's rooks and knights."
    }
  },

  // =========================================================================
  // 4. FAMOUS OPENING TRAPS (FULL ACCURATE PUNISHING LINES)
  // =========================================================================
  {
    eco: 'C57',
    name: "Fried Liver Attack (Full Punishment Line)",
    moves: [
      'e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Nxd5',
      'Nxf7', 'Kxf7', 'Qf3+', 'Ke6', 'Nc3', 'Ncb4', 'a3', 'Nxc2+', 'Kd1', 'Nxa1',
      'Nxd5', 'Kd6', 'd4', 'c6', 'dxe5+', 'Kd7', 'Qf7+', 'Be7', 'e6+', 'Kd6',
      'Bf4+', 'Kc5', 'b3', 'cxd5', 'Bc7', 'Qxc7', 'Qxe7+', 'Qxe7'
    ],
    category: 'traps',
    side: 'white',
    description: "The most famous and feared attacking trap in chess. When Black plays the natural 5...Nxd5?, White unleashes the devastating piece sacrifice 6. Nxf7! dragging the Black King into the center of the board where it is relentlessly hunted down.",
    keyIdeas: [
      "Sacrifice knight on f7 dragging Black's king to e6",
      "Pincer the pinned d5 knight with Qf3+ and Nc3",
      "Rip open the center with d4 and Bf4+ to deliver checkmate",
      "Black's king is forced onto a deadly walk into White's territory"
    ],
    famousPlayers: "Giulio Cesare Polerio (1610), Club players worldwide",
    targetPawnStructure: "Shattered king safety; Black king hunted on the central squares",
    middlegameStrategy: {
      corePawnStructure: "White has sacrificed a knight and rook for total destruction of Black's king safety. Black's king is stranded on c5/d6 with zero pawn cover.",
      whitePlans: [
        {
          title: "Total King Annihilation",
          description: "Relentlessly check the exposed Black king with Bf4+, d4+, and Qf7+ until checkmate is delivered.",
          pawnBreaks: ["d2-d4", "e5-e6"],
          keyMoves: ["Qf3+", "Nc3", "d4", "Bf4+", "e6+"],
          piecePlacement: "All pieces participating in the king hunt"
        }
      ],
      blackPlans: [
        {
          title: "Survive the Crossfire",
          description: "Hold the d5 knight at all costs with ...Ke6 and ...Ncb4, and try to give back material to escape the mating net.",
          pawnBreaks: ["...c7-c6"],
          keyMoves: ["...Ke6", "...Ncb4", "...Kd6", "...c6"],
          piecePlacement: "King desperately seeking shelter on the queenside"
        }
      ],
      criticalSquares: ["f7", "e6", "d5", "c2", "c5"],
      endgameTransitionNote: "There is rarely an endgame; White either checkmates Black within 20 moves or Black miraculously survives with extra material."
    }
  },
  {
    eco: 'C50',
    name: "Blackburne Shilling Gambit Trap",
    moves: [
      'e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nd4', 'Nxe5', 'Qg5', 'Nxf7', 'Qxg2',
      'Rf1', 'Qxe4+', 'Be2', 'Nf3#'
    ],
    category: 'traps',
    side: 'black',
    description: "Joseph Henry Blackburne's legendary trap. Black plays the dubious 3...Nd4?! baiting White into capturing the e5 pawn. When White greedily grabs on f7, Black's Queen infiltrates g2 and e4, ending in a sensational smothered checkmate with ...Nf3#!",
    keyIdeas: [
      "Bait White into capturing on e5 and f7",
      "Counter-attack with 4...Qg5! attacking both White's knight and g2 pawn",
      "Deliver a stunning smothered checkmate with ...Nf3#"
    ],
    famousPlayers: "Joseph Henry Blackburne",
    targetPawnStructure: "Tactical catastrophe for White: smothered checkmate on the board",
    middlegameStrategy: {
      corePawnStructure: "Rapid tactical miniature. White's greed leads directly to fatal king encirclement.",
      whitePlans: [
        {
          title: "The Correct Refutation",
          description: "Never play 4. Nxe5?!. Instead, play 4. Nxd4! exd4 5. O-O with a commanding lead in development and winning advantage.",
          pawnBreaks: ["d2-d4"],
          keyMoves: ["Nxd4", "O-O", "d3", "f4"],
          piecePlacement: "King safely castled, dominant development"
        }
      ],
      blackPlans: [
        {
          title: "The Trap Execution",
          description: "Play ...Qg5! hitting e5 and g2, capture on e4 with check, and deliver smothered mate with ...Nf3#.",
          pawnBreaks: [],
          keyMoves: ["...Qg5", "...Qxg2", "...Qxe4+", "...Nf3#"],
          piecePlacement: "Knight delivering smothered mate on f3"
        }
      ],
      criticalSquares: ["g2", "e4", "f3", "f7"],
      endgameTransitionNote: "Game ends on move 7 with smothered checkmate."
    }
  },
  {
    eco: 'C41',
    name: "Légal's Mate Trap",
    moves: [
      'e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4', 'Nc3', 'Nc6', 'h3', 'Bh5',
      'Nxe5', 'Bxd1', 'Bxf7+', 'Ke7', 'Nd5#'
    ],
    category: 'traps',
    side: 'white',
    description: "Sire de Légal's immortal Queen sacrifice (1750). Black pins White's knight to the Queen. White shockingly sacrifices the Queen with 5. Nxe5!, followed by 6. Bxf7+ Ke7 7. Nd5# - pure poetry in chess tactics!",
    keyIdeas: [
      "Pseudo-sacrifice of the Queen to exploit Black's uncastled king",
      "Deflect the pinned bishop to capture White's Queen on d1",
      "Coordinate the two knights and bishop to deliver instant checkmate"
    ],
    famousPlayers: "Sire de Légal (1750), Paul Morphy",
    targetPawnStructure: "Sudden death checkmate miniature",
    middlegameStrategy: {
      corePawnStructure: "Tactical miniature illustrating the danger of an uncastled king and premature bishop pins.",
      whitePlans: [
        {
          title: "The Immortal Mate",
          description: "Sacrifice the Queen with Nxe5! to deliver mate on f7 and d5 with minor pieces.",
          pawnBreaks: [],
          keyMoves: ["Nxe5", "Bxf7+", "Nd5#"],
          piecePlacement: "Knights on e5 and d5, Bishop on f7"
        }
      ],
      blackPlans: [
        {
          title: "Refuting the Pseudo-Sacrifice",
          description: "Black must not capture the queen! Instead, 5...Nxe5! 6. Qxh5 Nxc4 leaves Black ahead a full piece.",
          pawnBreaks: [],
          keyMoves: ["...Nxe5", "...Nxc4"],
          piecePlacement: "Black's knight captures the dangerous bishop"
        }
      ],
      criticalSquares: ["f7", "d5", "d1", "e5"],
      endgameTransitionNote: "Game concludes on move 7 with checkmate."
    }
  },
  {
    eco: 'C65',
    name: "Fishing Pole Trap",
    moves: [
      'e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6', 'O-O', 'Ng4', 'h3', 'h5',
      'hxg4', 'hxg4', 'Nh2', 'Qh4', 'Re1', 'Qxh2+', 'Kf1', 'Nd4', 'd3', 'Qh1#'
    ],
    category: 'traps',
    side: 'black',
    description: "The classic blitz trap! Black baits White by placing a knight on g4 and supporting it with ...h5 ('The Fishing Pole'). If White takes the bait with hxg4??, the h-file opens like a floodgate for Black's rook, leading to an unstoppable checkmate.",
    keyIdeas: [
      "Dangle the bait knight on g4 and support it with ...h5",
      "If White captures with hxg4, the open h-file becomes a checkmating highway",
      "Bring the Queen to h4 to deliver checkmate on h1 or h2"
    ],
    famousPlayers: "Club & blitz tactical trap",
    targetPawnStructure: "Open h-file checkmating attack against White's castled king",
    middlegameStrategy: {
      corePawnStructure: "Kingside open file destruction. White's castled kingside pawns are torn open.",
      whitePlans: [
        {
          title: "Ignore the Bait & Counter in the Center",
          description: "Never capture on g4! Instead, play 5. c3 or 5. d4 or 5. Re1, ignoring Black's trick.",
          pawnBreaks: ["d2-d4", "c2-c3"],
          keyMoves: ["c3", "d4", "Re1", "Nc3"],
          piecePlacement: "Central control with rapid development"
        }
      ],
      blackPlans: [
        {
          title: "Floodgate Checkmate",
          description: "Invade with ...Qh4, cut off White's king escape squares with ...Nd4, and deliver mate on h1.",
          pawnBreaks: [],
          keyMoves: ["...h5", "...hxg4", "...Qh4", "...Nd4", "...Qh1#"],
          piecePlacement: "Queen on h4/h1, Knight on d4 blocking escape"
        }
      ],
      criticalSquares: ["h4", "h2", "h1", "d4"],
      endgameTransitionNote: "Unstoppable checkmate on move 10."
    }
  },
  {
    eco: 'C71',
    name: "Noah's Ark Trap",
    moves: [
      'e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'd6', 'd4', 'b5',
      'Bb3', 'Nxd4', 'Nxd4', 'exd4', 'Qxd4', 'c5', 'Qd5', 'Be6', 'Qc6+', 'Bd7',
      'Qd5', 'c4'
    ],
    category: 'traps',
    side: 'black',
    description: "The ancient Noah's Ark trap in the Ruy Lopez. Black lures White into capturing pawns on d4, then traps White's prized light-squared 'Spanish' bishop on b3 using a cage of pawns: ...a6, ...b5, ...c5, and ...c4!",
    keyIdeas: [
      "Kick the bishop with ...a6 and ...b5",
      "Use pawns on c5 and c4 to build a wooden cage trapping the bishop on b3",
      "Win a clean piece early in the opening"
    ],
    famousPlayers: "Steinitz, Endre Steiner",
    targetPawnStructure: "Black traps White's light-squared bishop with ...b5 and ...c4",
    middlegameStrategy: {
      corePawnStructure: "Black's queenside pawns (b5, c4) encircle and suffocate White's light-squared bishop.",
      whitePlans: [
        {
          title: "Avoid the Bishop Trap",
          description: "Play 6. c3 to give the bishop an escape square on c2, or avoid 8. Qxd4?! by playing 8. Bd5 instead.",
          pawnBreaks: ["c2-c3"],
          keyMoves: ["c3", "Bc2", "d4"],
          piecePlacement: "Bishop safe on c2"
        }
      ],
      blackPlans: [
        {
          title: "Spring the Cage with ...c4",
          description: "Block the bishop's diagonals and push ...c4 to capture the trapped bishop.",
          pawnBreaks: ["...c5-c4"],
          keyMoves: ["...c5", "...Be6", "...c4"],
          piecePlacement: "Pawns locked on b5 and c4 winning the minor piece"
        }
      ],
      criticalSquares: ["b3", "c4", "c5", "d4"],
      endgameTransitionNote: "Black wins comfortably with an extra minor piece."
    }
  },
  {
    eco: 'D51',
    name: "Elephant Trap (Queen's Gambit)",
    moves: [
      'd4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Nbd7', 'cxd5', 'exd5',
      'Nxd5', 'Nxd5', 'Bxd8', 'Bb4+', 'Qd2', 'Bxd2+', 'Kxd2', 'Kxd8'
    ],
    category: 'traps',
    side: 'black',
    description: "The famous Queen's Gambit trap. White believes Black blundered the d5 pawn because the f6 knight is pinned to the Queen. White plays 6. Nxd5??, only to be stunned by 6...Nxd5! 7. Bxd8 Bb4+ winning back the Queen with an extra minor piece!",
    keyIdeas: [
      "Bait White with the apparently 'pinned' knight on f6",
      "White's 6. Nxd5?? greedily grabs the d5 pawn",
      "Black unleashes 7...Bb4+! forcing 8. Qd2, winning a full piece"
    ],
    famousPlayers: "Historical Queen's Gambit trap dating to the 19th century",
    targetPawnStructure: "Black ahead a full minor piece with a clean position",
    middlegameStrategy: {
      corePawnStructure: "Clean endgame position where Black emerges with a full knight advantage.",
      whitePlans: [
        {
          title: "Proper Opening Play",
          description: "Do not grab the d5 pawn! Play 6. e3 and continue normal piece development with Nf3 and Bd3.",
          pawnBreaks: ["e3-e4"],
          keyMoves: ["e3", "Nf3", "Bd3", "O-O"],
          piecePlacement: "Normal piece development without premature pawn grabbing"
        }
      ],
      blackPlans: [
        {
          title: "Punish the Greed",
          description: "Play ...Bb4+ delivering check, trade queens on d2, and recapture the bishop on d8 to remain up a knight.",
          pawnBreaks: [],
          keyMoves: ["...Nxd5", "...Bb4+", "...Bxd2+", "...Kxd8"],
          piecePlacement: "King on d8, extra knight active on d5"
        }
      ],
      criticalSquares: ["d5", "b4", "d2", "d8"],
      endgameTransitionNote: "Black has a completely winning endgame with a clean extra minor piece."
    }
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
