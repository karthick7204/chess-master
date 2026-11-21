import {
  OpeningPrinciple,
  OpeningRepertoireGuide,
  OpeningTrap,
  MiddlegameConcept,
  EndgameConcept,
  InteractiveDrill
} from '../types/learning';

// ==========================================
// 1. OPENING COACH CURRICULUM
// ==========================================

export const OPENING_PRINCIPLES: OpeningPrinciple[] = [
  {
    id: 'prin-center',
    number: 1,
    title: 'Control the Center (e4, d4, e5, d5)',
    summary: 'Occupy and influence the four central squares with pawns and pieces immediately.',
    detailedExplanation:
      'The four central squares are the high ground of the chessboard. Pieces situated in or aiming toward the center control far more territory and can pivot quickly to either flank.',
    goldenRule: 'On move 1 and 2, strive to place at least one pawn in the center (1.e4 or 1.d4) and prevent your opponent from freely owning both central squares.',
    bestPractice: 'Push 1.e4 or 1.d4; challenge opposing center pawns with 1...e5, 1...c5, or 1...d5.',
    commonPitfall: 'Pushing flank pawns like a3, h3, a6, or h6 on moves 1–5, yielding the center to the opponent.'
  },
  {
    id: 'prin-develop',
    number: 2,
    title: 'Develop Knights Before Bishops',
    summary: 'Knights generally have obvious central squares (f3, c3, f6, c6), while bishops benefit from flexible placement.',
    detailedExplanation:
      'Knights are short-range pieces and take longer to reach the fight. Developing them early immediately controls central squares (e5, d5, e4, d4). Bishops can then be deployed to the diagonal that best exploits the opponent\'s pawn setup.',
    goldenRule: 'Develop knights toward the center first, not to the rim (a3, h3, a6, h6). Remember: "A knight on the rim is dim."',
    bestPractice: 'Play Nf3 and Nc3 for White; Nf6 and Nc6 for Black.',
    commonPitfall: 'Developing bishops before knights or locking bishops inside your own pawn chains before they are active.'
  },
  {
    id: 'prin-king-safety',
    number: 3,
    title: 'Castle Early for King Safety',
    summary: 'Tuck your king behind a solid pawn wall within the first 7 to 10 moves.',
    detailedExplanation:
      'An uncastled king stuck on the open e-file is an easy target for rook pins, queen checks, and devastating sacrifices. Castling achieves two vital goals in one move: secures the King and activates a Rook.',
    goldenRule: 'Do not start aggressive attacks or open the center while your King is still in the middle of the board.',
    bestPractice: 'Develop your kingside knight and bishop quickly to enable kingside castling (O-O) by move 6–8.',
    commonPitfall: 'Leaving the king on e1/e8 while greedily hunting flank pawns or delaying castling.'
  },
  {
    id: 'prin-one-piece',
    number: 4,
    title: 'Do Not Move the Same Piece Twice in the Opening',
    summary: 'Every tempo is precious. Develop all your army before moving a piece a second time.',
    detailedExplanation:
      'Moving the same knight or bishop multiple times allows your opponent to develop a new piece on every turn. In the opening, development lead directly translates into attacking initiative.',
    goldenRule: 'Only move a piece a second time if it is under direct threat or can capture significant undefended material.',
    bestPractice: 'Bring out a new piece on every move until all minor pieces and your king are mobilized.',
    commonPitfall: 'Wandering with a knight or bishop chasing speculative threats before completing development.'
  },
  {
    id: 'prin-queen-restraint',
    number: 5,
    title: 'Do Not Bring Your Queen Out Prematurely',
    summary: 'The Queen is too valuable to wander early; minor pieces will chase her and gain free developmental tempi.',
    detailedExplanation:
      'When your Queen enters the game on move 2 or 3 (e.g. 2.Qh5 or 2.Qf3), the opponent can develop knights and bishops while attacking your Queen. Every time the Queen retreats, the opponent gets a free developing move.',
    goldenRule: 'Mobilize Knights, Bishops, and Castle first. The Queen coordinates best behind the minor pieces.',
    bestPractice: 'Keep your Queen on the 2nd rank (d2, e2, d7, e7) to connect rooks and support central breaks.',
    commonPitfall: 'Playing for cheap one-move checkmates like Scholar\'s Mate against experienced players.'
  },
  {
    id: 'prin-connect-rooks',
    number: 6,
    title: 'Connect Your Rooks to Conclude the Opening',
    summary: 'The opening phase officially ends when your back rank is clear and your rooks protect each other.',
    detailedExplanation:
      'Connecting your rooks allows them to slide effortlessly to open central files (d-file and e-file) or double up on the 7th rank in the middlegame.',
    goldenRule: 'Clear the path between your rooks by developing both minor pieces, castling, and moving the Queen off the 1st/8th rank.',
    bestPractice: 'Place your rooks on the d-file and e-file or behind your most advanced central pawns.',
    commonPitfall: 'Leaving knights or bishops on their starting squares blocking rooks from communicating.'
  }
];

export const OPENING_REPERTOIRE_GUIDES: OpeningRepertoireGuide[] = [
  {
    playstyle: 'aggressive',
    label: 'Tactical & Aggressive Repertoire',
    description: 'Direct, sharp piece play aimed at early initiative, open diagonals, and kingside attacks.',
    whiteOpenings: [
      {
        name: 'Italian Game (Giuoco Piano)',
        eco: 'C50',
        moves: '1. e4 e5 2. Nf3 Nc6 3. Bc4',
        keyIdea: 'Targets Black\'s weakest square (f7) and prepares rapid kingside castling with c3-d4 central expansion.',
        targetPawnStructure: 'Mobile central pawn duo (d4 + e4).'
      },
      {
        name: 'Scotch Game',
        eco: 'C44',
        moves: '1. e4 e5 2. Nf3 Nc6 3. d4',
        keyIdea: 'Blows open the center on move 3, eliminating Black\'s central pawn and opening diagonals for bishops.',
        targetPawnStructure: 'Open d-file with active central knight outpost.'
      },
      {
        name: 'Evans Gambit',
        eco: 'C51',
        moves: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4',
        keyIdea: 'Sacrifices a wing pawn to build an unstoppable pawn center (c3 + d4) and ferocious diagonal pressure.',
        targetPawnStructure: 'Dominant d4/e4 center with open b-file and a3-f8 diagonal.'
      }
    ],
    blackOpenings: [
      {
        name: 'Sicilian Defense: Najdorf / Dragon',
        eco: 'B90',
        moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6',
        keyIdea: 'Fights asymmetrically for the center from the flank, producing sharp, uncompromising counterattacks.',
        targetPawnStructure: 'Two central pawns (e7, d6) vs White\'s e4 pawn with semi-open c-file counterplay.'
      },
      {
        name: 'King\'s Indian Defense',
        eco: 'E60',
        moves: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6',
        keyIdea: 'Lets White build a large center, then strikes back with ...e5 and launches a kingside pawn storm.',
        targetPawnStructure: 'Locked center (e5 vs d5) with f7-f5 kingside pawn breakthrough.'
      }
    ]
  },
  {
    playstyle: 'solid',
    label: 'Solid & Positional Repertoire',
    description: 'Classical, dependable setups focused on pawn structure integrity, piece safety, and positional control.',
    whiteOpenings: [
      {
        name: 'Queen\'s Gambit',
        eco: 'D06',
        moves: '1. d4 d5 2. c4',
        keyIdea: 'Challenges Black\'s d5 pawn to gain central supremacy and easy piece development.',
        targetPawnStructure: 'Carlsbad structure or isolated queen pawn with active minority attacks.'
      },
      {
        name: 'London System',
        eco: 'D02',
        moves: '1. d4 d5 2. Bf4 Nf6 3. e3 c5 4. c3',
        keyIdea: 'Extremely resilient pawn pyramid (c3-d4-e3) with the dark-squared bishop activated outside the pawn chain.',
        targetPawnStructure: 'Solid triangular pawn wedge (c3-d4-e3) resistant to early tactical strikes.'
      }
    ],
    blackOpenings: [
      {
        name: 'Caro-Kann Defense',
        eco: 'B10',
        moves: '1. e4 c6 2. d4 d5',
        keyIdea: 'Supports a d5 central stake without locking in the light-squared bishop (unlike the French Defense).',
        targetPawnStructure: 'Ultra-healthy pawn structure with no structural weaknesses.'
      },
      {
        name: 'Queen\'s Gambit Declined (QGD)',
        eco: 'D30',
        moves: '1. d4 d5 2. c4 e6 3. Nc3 Nf6',
        keyIdea: 'Rock-solid defense of the central d5 bastion, favored by World Champions for over a century.',
        targetPawnStructure: 'Stable central wedge (d5 + e6) with harmonious kingside piece fortification.'
      }
    ]
  },
  {
    playstyle: 'strategic',
    label: 'Strategic & Dynamic Repertoire',
    description: 'Deep, rich maneuvering systems with long-term strategic plans and flexible pawn structures.',
    whiteOpenings: [
      {
        name: 'Ruy Lopez (Spanish Opening)',
        eco: 'C60',
        moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5',
        keyIdea: 'Puts indirect pressure on Black\'s central e5 pawn by pinning the knight that protects it.',
        targetPawnStructure: 'Flexible central pawn tension with c3-d4 pawn builds.'
      },
      {
        name: 'English Opening',
        eco: 'A10',
        moves: '1. c4',
        keyIdea: 'Controls the central d5 square from the wing while keeping options open for flexible pawn structures.',
        targetPawnStructure: 'Flank pawn control with kingside fianchetto (g3 + Bg2).'
      }
    ],
    blackOpenings: [
      {
        name: 'French Defense',
        eco: 'C00',
        moves: '1. e4 e6 2. d4 d5',
        keyIdea: 'Solid counter-attack against White\'s center with ...c5 and ...f6 breaking White\'s pawn chain.',
        targetPawnStructure: 'Locked pawn chain (White e5-d4 vs Black e6-d5) with base attack at c3/d4.'
      },
      {
        name: 'Nimzo-Indian Defense',
        eco: 'E20',
        moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4',
        keyIdea: 'Pins White\'s c3 knight, preventing e4 and often inflicting doubled c-pawns on White.',
        targetPawnStructure: 'Doubled c-pawns on White\'s queenside targeted by Black\'s knights and rooks.'
      }
    ]
  }
];

export const OPENING_TRAPS: OpeningTrap[] = [
  {
    id: 'trap-scholars',
    name: 'Scholar\'s Mate (4-Move Checkmate)',
    eco: 'C20',
    openingName: 'King\'s Pawn Opening',
    moves: ['e4', 'e5', 'Qh5', 'Nc6', 'Bc4', 'Nf6??', 'Qxf7#'],
    fen: 'r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4',
    trapMove: '3... Nf6??',
    punishment: '4. Qxf7# delivers instant checkmate against the unprotected f7 square.',
    whyItFails: 'Black develops the knight to f6 without realizing the Queen and Bishop are both battery-aiming at f7.',
    howToAvoid: 'Play 3... g6! instead, kicking the Queen away. When White plays 4. Qf3 renewing the threat, play 4... Nf6.'
  },
  {
    id: 'trap-fried-liver',
    name: 'Fried Liver Attack',
    eco: 'C57',
    openingName: 'Two Knights Defense',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Nxd5?!', 'Nxf7!'],
    fen: 'r1bqkb1r/ppp2Npp/2n5/3np3/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 6',
    trapMove: '5... Nxd5?!',
    punishment: '6. Nxf7! sacrifices the knight to rip open Black\'s king: 6... Kxf7 7. Qf3+ Ke6 8. Nc3.',
    whyItFails: 'Recapturing on d5 with the knight leaves f7 completely defenseless against the combined battery of Bc4 and Ng5.',
    howToAvoid: 'Play 5... Na5! (the Polerio Defense), attacking White\'s bishop on c4 and gaining the initiative.'
  },
  {
    id: 'trap-legals',
    name: 'Légal\'s Mate (Queen Sacrifice Trap)',
    eco: 'C41',
    openingName: 'Philidor Defense',
    moves: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4', 'Nc3', 'g6?!', 'Nxe5!', 'Bxd1??', 'Bxf7+', 'Ke7', 'Nd5#'],
    fen: 'r2q1bnr/ppp1kBpp/3p2p1/3NN3/4P3/8/PPPP1PPP/R1BbK2R b KQ - 1 7',
    trapMove: '5... Bxd1??',
    punishment: '6. Bxf7+ Ke7 7. Nd5# delivers checkmate with three coordinated minor pieces.',
    whyItFails: 'Black greedily grabs White\'s queen without calculating the forcing minor piece mate against the uncastled king.',
    howToAvoid: 'Recognize the pseudo-pin: after 5. Nxe5!, Black must play 5... dxe5 6. Qxg4, accepting being down a pawn instead of getting mated.'
  },
  {
    id: 'trap-noahs-ark',
    name: 'Noah\'s Ark Trap',
    eco: 'C70',
    openingName: 'Ruy Lopez',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'd6', 'd4', 'b5', 'Bb3', 'Nxd4', 'Nxd4', 'exd4', 'Qxd4??', 'c5', 'Qd5', 'Be6', 'Qc6+', 'Bd7', 'Qd5', 'c4!'],
    fen: 'r2qkb1r/3b1ppp/p2p4/1p1Q4/2p1P3/1B6/PPP2PPP/RNB1K2R w KQkq - 0 12',
    trapMove: '7. Qxd4??',
    punishment: 'Black traps White\'s light-squared bishop with ...c5, ...Be6, and ...c4! The bishop has no escape.',
    whyItFails: 'White\'s bishop is lured onto b3 and trapped by Black\'s connected queenside pawn roller (b5, c5, c4).',
    howToAvoid: 'Instead of capturing 7. Qxd4, play 7. Bd5 or 7. c3! to give the bishop a retreat square on c2.'
  },
  {
    id: 'trap-fishing-pole',
    name: 'Fishing Pole Trap',
    eco: 'C65',
    openingName: 'Ruy Lopez: Berlin Defense',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6', 'O-O', 'Ng4', 'h3', 'h5!?', 'hxg4??', 'hxg4', 'Nh2', 'Qh4!'],
    fen: 'r1bqkb1r/pppp1pp1/2n5/1B2p3/4P1pq/8/PPPP1PPN/RNBQ1RK1 w kq - 2 9',
    trapMove: '6. hxg4??',
    punishment: 'Black opens the h-file for the rook. After 6... hxg4 followed by ...Qh4, White cannot stop checkmate on h2 or h1.',
    whyItFails: 'White takes the bait knight on g4, underestimating the open h-file battery formed by Black\'s rook on h8.',
    howToAvoid: 'Ignore the knight on g4! Play 6. c3, 6. Re1, or 6. d4, keeping the h-file firmly closed.'
  },
  {
    id: 'trap-blackburne',
    name: 'Blackburne Shilling Gambit Trap',
    eco: 'C50',
    openingName: 'Italian Game',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nd4?!', 'Nxe5?!', 'Qg5!', 'Nxf7', 'Qxg2', 'Rf1', 'Qxe4+', 'Be2', 'Nf3#'],
    fen: 'r1b1kb1r/pppp1Npp/8/8/4q3/5n2/PPPPBP1P/RNBQKR2 w Qkq - 2 9',
    trapMove: '4. Nxe5?!',
    punishment: 'Black plays 4... Qg5! attacking both e5 and g2, ending in a smothered checkmate with ...Nf3#.',
    whyItFails: 'White gets greedy for the e5 pawn and f7 fork without realizing the Queen infiltrates behind White\'s pieces.',
    howToAvoid: 'Simply play 4. Nxd4! exd4 5. O-O with a massive lead in development and total center control.'
  }
];

// ==========================================
// 2. MIDDLEGAME COACH CURRICULUM
// ==========================================

export const MIDDLEGAME_CONCEPTS: MiddlegameConcept[] = [
  {
    id: 'mid-outposts',
    topic: 'positional',
    title: 'Outposts: Establishing Knights on Enemy Soil',
    subtitle: 'Positional Mastery • Anchor Squares',
    principle:
      'An outpost is a square on ranks 4, 5, or 6 protected by your pawn that cannot be driven away by an enemy pawn.',
    diagnosticSigns: [
      'Enemy pawns have advanced past the square or traded off.',
      'A knight placed on an outpost radiates power in all 8 directions.',
      'Anchored on a half-open file.'
    ],
    howToPlay:
      'Locate holes in the opponent\'s camp (e.g. d5, e6, c6). Transfer your knight there via maneuvers like Nf1-e3-d5 or Nd2-f1-e3-d5.'
  },
  {
    id: 'mid-open-files',
    topic: 'positional',
    title: 'Open Files: The Highways for Rooks',
    subtitle: 'Rook Activation • 7th Rank Dominance',
    principle:
      'Rooks need open files (files with no pawns) or semi-open files (files with only enemy pawns) to enter the battle.',
    diagnosticSigns: [
      'Pawn trades open the c, d, or e file.',
      'Doubling rooks ("Alekhine\'s Gun") on an open file overwhelms defenders.',
      'Infiltrating to the 7th rank attacks all undefended enemy base pawns.'
    ],
    howToPlay:
      'Contest every open file immediately. Double your rooks, control the entry squares, and invade the opponent\'s 7th or 8th rank.'
  },
  {
    id: 'mid-bishops',
    topic: 'positional',
    title: 'Good vs Bad Bishops',
    subtitle: 'Color Complex Dominance',
    principle:
      'A "bad bishop" is hemmed in by its own central pawns locked on the same color. A "good bishop" moves freely on squares of the opposite color.',
    diagnosticSigns: [
      'If your central pawns are locked on dark squares (d4, e5), your dark-squared bishop is restricted.',
      'A good bishop controls open diagonals cutting across both flanks.'
    ],
    howToPlay:
      'Trade off your bad bishop for the opponent\'s good bishop or active knight. Place your central pawns on the opposite color of your bishop.'
  },
  {
    id: 'mid-iqp',
    topic: 'weaknesses',
    title: 'Isolated Queen\'s Pawn (IQP): Weapon or Weakness?',
    subtitle: 'Pawn Structure Strategy',
    principle:
      'An isolated pawn has no friendly pawns on adjacent files to defend it. In middlegames it grants dynamic attacking space; in endgames it becomes a liability.',
    diagnosticSigns: [
      'Pawn on d4 or d5 with open c-file and e-file on either side.',
      'The square immediately in front of the IQP (d5 for White, d4 for Black) is a permanent hole.'
    ],
    howToPlay:
      'If you have the IQP: Attack the enemy king dynamically with piece activity and look for the d4-d5 breakthrough. If playing against the IQP: Blockade the hole in front of the pawn with a knight and trade off minor pieces into a winning endgame.'
  },
  {
    id: 'mid-backward-pawns',
    topic: 'weaknesses',
    title: 'Backward Pawns & Hole Identification',
    subtitle: 'Targeting Structural Flaws',
    principle:
      'A backward pawn lags behind friendly pawns and cannot advance without being captured. The square in front of it is an ideal enemy outpost.',
    diagnosticSigns: [
      'A pawn on c6 or d6 on a half-open file that cannot be guarded by another pawn.',
      'Enemy rooks and knights naturally pile up on the backward pawn.'
    ],
    howToPlay:
      'Fix the backward pawn by preventing its advance. Pile up heavy pieces on the half-open file until the defender collapses.'
  },
  {
    id: 'mid-rook-batteries',
    topic: 'coordination',
    title: 'Rook Batteries & "Pigs on the 7th"',
    subtitle: 'Piece Coordination & Infiltration',
    principle:
      'Two rooks connected on the 7th rank are called "pigs on the 7th" because they devour all enemy pawns and trap the opposing king on the back rank.',
    diagnosticSigns: [
      'Both rooks coordinated on rank 7 (White) or rank 2 (Black).',
      'Continuous threats of perpetual check or inescapable mating nets.'
    ],
    howToPlay:
      'Clear the back rank, double rooks on an open file, and leap into the 7th rank. Even if down material, rooks on the 7th often force a win or draw.'
  },
  {
    id: 'mid-greek-gift',
    topic: 'attacking_plans',
    title: 'The Greek Gift Sacrifice (Bxh7+ / Bxh2+)',
    subtitle: 'Kingside Attack • Tactical Demolition',
    principle:
      'A classical bishop sacrifice ripping apart the enemy king\'s protective pawn shield after kingside castling.',
    diagnosticSigns: [
      'White has a bishop on d3, knight on f3, queen on d1, and pawn on e5.',
      'Black\'s knight has been driven away from f6, leaving h7 defended only by the king.'
    ],
    howToPlay:
      'Execute 1. Bxh7+! Kxh7 2. Ng5+! Kg8 (or 2...Kg6) 3. Qh5! Re8 4. Qxf7+ Kh8 5. Qh5+ Kg8 6. Qh7+ Kf8 7. Qh8+ Ke7 8. Qxg7#.'
  },
  {
    id: 'mid-minority-attack',
    topic: 'attacking_plans',
    title: 'The Minority Attack in the Carlsbad Structure',
    subtitle: 'Queenside Strategic Breakthrough',
    principle:
      'Pushing two pawns (a-pawn and b-pawn) against three enemy pawns (a, b, c) to force a weak, backward pawn on c6.',
    diagnosticSigns: [
      'Carlsbad pawn structure (White: e3, d4, c3; Black: e6, d5, c6).',
      'White pushes b4-b5 to exchange on c6, creating an isolated or backward c6 pawn.'
    ],
    howToPlay:
      'Prepare with Rab1, a4, and b4-b5. After bxc6, target the weak c6 pawn on the open c-file.'
  },
  {
    id: 'mid-pawn-chains',
    topic: 'pawn_structures',
    title: 'Pawn Chains: Base vs Apex',
    subtitle: 'Pawn Structure Blueprint',
    principle:
      'A diagonal chain of mutually defending pawns. The head is called the "apex" and the bottom is called the "base".',
    diagnosticSigns: [
      'Common in French Defense (White e5-d4-c3 vs Black e6-d5-c5).',
      'The base pawn (c3 or d4 for White, c7 or e6 for Black) is the only pawn not defended by another pawn.'
    ],
    howToPlay:
      'Attack the base of the enemy chain! In the French, Black hammers at d4 with ...c5, ...Nc6, and ...Qb6. White attacks the kingside where the chain points.'
  }
];

// ==========================================
// 3. ENDGAME COACH CURRICULUM
// ==========================================

export const ENDGAME_CONCEPTS: EndgameConcept[] = [
  {
    id: 'end-king-activity',
    topic: 'king_activity',
    title: 'King Activation: The King is a Fighting Piece',
    subtitle: 'Endgame Golden Rule #1',
    technique:
      'In the opening and middlegame, the king hides for safety. In the endgame (once queens are gone), the king transforms into an aggressive attacker worth 4 points of material.',
    goldenRule: 'March your King toward the center as soon as queens are exchanged.',
    stepByStepGuide: [
      'Evaluate material: if queens are traded, the risk of checkmate drops dramatically.',
      'Activate your King: centralize to e4/d4 (or e5/d5 for Black).',
      'Use your King to escort your own passed pawns and blockade enemy passed pawns.'
    ]
  },
  {
    id: 'end-opposition',
    topic: 'opposition',
    title: 'The Opposition: Direct, Distant & Outflanking',
    subtitle: 'King & Pawn Geometry',
    technique:
      'When two kings face each other on the same file, rank, or diagonal with an odd number of squares between them. The player who does NOT have to move holds the opposition.',
    goldenRule: 'To hold the opposition: place your king with an ODD number of squares between the kings. Force your opponent to step aside, then outflank them.',
    stepByStepGuide: [
      'Direct Opposition: 1 square between kings (e.g. White on e4, Black on e6). If Black must move, White penetrates via d5 or f5.',
      'Distant Opposition: 3 or 5 squares between kings. Calculate the step to reduce to direct opposition.',
      'Outflanking: Stepping around the enemy king to clear a pathway for your pawn to queen.'
    ]
  },
  {
    id: 'end-rule-of-square',
    topic: 'pawn_promotion',
    title: 'The Rule of the Square',
    subtitle: 'Calculation Shortcut Without Counting',
    technique:
      'A mental geometry tool to instantly determine if a defending king can catch a runaway passed pawn without counting every move.',
    goldenRule: 'Draw a diagonal from the pawn to the promotion rank, forming a square. If the defending king is inside the square on their turn, they can catch the pawn; if outside, the pawn promotes untouched.',
    stepByStepGuide: [
      'Locate the passed pawn (e.g. e4) and its promotion square (e8).',
      'Count the distance to promotion (4 squares to e8). Draw an imaginary square 4x4 squares wide.',
      'If the defending king can enter this square on their move, they catch the pawn. If not, push the pawn fearlessly!'
    ]
  },
  {
    id: 'end-lucena',
    topic: 'rook_endgames',
    title: 'The Lucena Position: Building a Bridge',
    subtitle: 'Winning Rook & Pawn Endgames',
    technique:
      'The foundational winning technique in rook and pawn endgames when your pawn has reached the 7th rank with your king in front of it.',
    goldenRule: '"Build the bridge!" Use your rook on the 4th rank to shield your king from endless enemy rook checks.',
    stepByStepGuide: [
      'Step 1: Check the enemy king away from the promotion file with your rook.',
      'Step 2: Place your rook on the 4th rank (e.g. Re4 or Rd4).',
      'Step 3: Step your king out from in front of the pawn (e.g. Kf7 or Ke7).',
      'Step 4: When the enemy rook checks your king, step down the board toward your rook on rank 4 until your rook intercepts the check: bridge built, pawn queens!'
    ]
  },
  {
    id: 'end-philidor',
    topic: 'rook_endgames',
    title: 'The Philidor Defense: Third-Rank Holding',
    subtitle: 'Saving Drawn Rook & Pawn Endgames',
    technique:
      'The classic defensive technique to draw against an opponent who has an extra rook pawn on the 5th or 6th rank.',
    goldenRule: 'Keep your rook on the 6th rank (or 3rd rank for Black) to prevent the enemy king from advancing. As soon as the pawn pushes, drop your rook to the back rank and check endlessly from behind!',
    stepByStepGuide: [
      'Keep your rook horizontally on the 6th rank, cutting the enemy king off.',
      'Wait patiently with your rook until the opponent pushes their pawn to the 6th rank.',
      'The moment the pawn advances, drop your rook all the way to rank 1 or 2.',
      'Deliver endless vertical checks from behind the enemy king. Because the pawn has pushed, the king has no shelter!'
    ]
  },
  {
    id: 'end-tarrasch-rule',
    topic: 'rook_endgames',
    title: 'The Tarrasch Rule: Rooks Belong Behind Passed Pawns',
    subtitle: 'Universal Rook Principle',
    technique:
      'Dr. Siegbert Tarrasch formulated this immortal law: Rooks belong behind passed pawns — whether your own or your opponent\'s.',
    goldenRule: 'Behind your own pawn: your rook protects the pawn as it advances and gains mobility. Behind an enemy pawn: your rook attacks the pawn while maintaining maximum mobility.',
    stepByStepGuide: [
      'Never place your rook in front of your passed pawn (where it blocks its own promotion).',
      'Rush your rook to the file directly behind the passed pawn.',
      'As the pawn pushes forward, your rook\'s range increases rather than shrinks.'
    ]
  },
  {
    id: 'end-checkmate-kq',
    topic: 'checkmates',
    title: 'King & Queen vs Lone King: The Box Technique',
    subtitle: 'Elementary Checkmate Method',
    technique:
      'The queen boxes the enemy king into smaller and smaller rectangles like a knight, driving it to the edge. Beware of stalemate!',
    goldenRule: 'Keep the queen a knight\'s jump away from the enemy king until it reaches the edge. Bring your king to support, then deliver checkmate. NEVER give stalemate!',
    stepByStepGuide: [
      'Step 1: Place queen a knight\'s distance from the opposing king, shrinking the available box.',
      'Step 2: Mirror the enemy king\'s movements until the king is trapped on an edge rank or file.',
      'Step 3: March your friendly king forward to provide protection.',
      'Step 4: Deliver checkmate right in the enemy king\'s face (supported by your king).'
    ]
  },
  {
    id: 'end-checkmate-kr',
    topic: 'checkmates',
    title: 'King & Rook vs Lone King: The Box Method',
    subtitle: 'Essential Technique',
    technique:
      'A rook cannot checkmate alone; the friendly king must establish direct opposition to cut escape squares while the rook checks along the rank.',
    goldenRule: 'Cut the board with the rook, take opposition with your king, and deliver rank checks to push the enemy king to the edge.',
    stepByStepGuide: [
      'Step 1: Use the rook to cut the board along a rank or file.',
      'Step 2: Use your king to force direct opposition against the enemy king.',
      'Step 3: When in direct opposition, check with the rook to force the enemy king back one rank.',
      'Step 4: Repeat until the enemy king is on the edge, then deliver the final back-rank checkmate.'
    ]
  }
];

// ==========================================
// 4. INTERACTIVE PHASE DRILLS (15 Exercises)
// ==========================================

export const ALL_COACH_DRILLS: InteractiveDrill[] = [
  // --- OPENING PHASE DRILLS ---
  {
    id: 'drill-open-1',
    category: 'piece_safety',
    phase: 'opening',
    title: 'Punishing Scholar\'s Mate',
    subtitle: 'Opening Coach • Trap Defense',
    conceptLesson: 'When an opponent rushes their Queen out with 2. Qh5 looking for Scholar\'s Mate, do not panic! Defend your e5 pawn first with 2... Nc6, and when they play 3. Bc4 aiming at f7, block the diagonal with 3... g6!',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3',
    playerColor: 'black',
    expectedMove: { from: 'g7', to: 'g6', san: 'g6' },
    hint: 'White is threatening 4. Qxf7# on f7! Push your g-pawn forward to block the queen and attack it with tempo.',
    explanationOnSuccess: 'Brilliant! 3... g6 immediately refutes Scholar\'s Mate. It shuts down the attack on f7 while forcing White\'s queen to retreat and waste valuable tempi.'
  },
  {
    id: 'drill-open-2',
    category: 'piece_safety',
    phase: 'opening',
    title: 'Defusing the Fried Liver Attack',
    subtitle: 'Opening Coach • Polerio Defense',
    conceptLesson: 'In the Two Knights Defense after 4. Ng5 d5 5. exd5, never play 5... Nxd5?! allowing 6. Nxf7! Instead, play the master counter-strike 5... Na5!, driving White\'s bishop away from the f7 diagonal.',
    fen: 'r1bqkb1r/ppp2ppp/2n5/3Pp1N1/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 5',
    playerColor: 'black',
    expectedMove: { from: 'c6', to: 'a5', san: 'Na5' },
    hint: 'Attack White\'s proud bishop on c4 with your knight! Move your c6 knight to a5.',
    explanationOnSuccess: 'Masterful! 5... Na5 attacks White\'s bishop and seizes the initiative. Black will follow up with ...h6, leaving White with an overextended knight.'
  },
  {
    id: 'drill-open-3',
    category: 'middlegame_planning',
    phase: 'opening',
    title: 'Center Stake: The Italian Pawn Break',
    subtitle: 'Opening Coach • Center Control',
    conceptLesson: 'In the Italian Game (1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6), White\'s master plan is to establish a dominant pawn center. Prepare and execute the central break d2-d4!',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 1 5',
    playerColor: 'white',
    expectedMove: { from: 'd2', to: 'd4', san: 'd4' },
    hint: 'Blast open the center! Push your d-pawn two squares to strike Black\'s bishop on c5.',
    explanationOnSuccess: 'Fantastic! 5. d4 directly attacks Black\'s central e5 pawn and c5 bishop, establishing White\'s imposing pawn center.'
  },
  {
    id: 'drill-open-4',
    category: 'piece_safety',
    phase: 'opening',
    title: 'Refuting the Premature Queen Excursion',
    subtitle: 'Opening Coach • Development With Tempo',
    conceptLesson: 'When Black plays 3... Qe7?! too early, White should not react defensively. Continue standard central development while exploiting Black\'s clogged bishop.',
    fen: 'r1b1kbnr/ppppqppp/2n5/4p3/3PP3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 1 4',
    playerColor: 'white',
    expectedMove: { from: 'c3', to: 'd5', san: 'Nd5' },
    hint: 'Jump your c3 knight into the hole on d5, attacking the premature black queen on e7!',
    explanationOnSuccess: 'Sensational! 4. Nd5 attacks Black\'s queen with tempo, highlighting why bringing the queen out early loses precious opening moves.'
  },
  {
    id: 'drill-open-5',
    category: 'middlegame_planning',
    phase: 'opening',
    title: 'Kingside Castle: Safety & Activation',
    subtitle: 'Opening Coach • King Safety Rule',
    conceptLesson: 'Both minor pieces on the kingside are developed. Before starting any central combat, tuck your king safely behind the pawns.',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5',
    playerColor: 'white',
    expectedMove: { from: 'e1', to: 'g1', san: 'O-O' },
    hint: 'Castle kingside! Move your king from e1 to g1.',
    explanationOnSuccess: 'Perfect! Castling safeguards your king while placing the rook on f1 ready to control open central files.'
  },

  // --- MIDDLEGAME PHASE DRILLS ---
  {
    id: 'drill-mid-1',
    category: 'middlegame_planning',
    phase: 'middlegame',
    title: 'Dominating with a Knight Outpost',
    subtitle: 'Middlegame Coach • Outpost Mastery',
    conceptLesson: 'Black has weakened the d5 square with ...e5. A knight anchored on d5 cannot be challenged by black pawns and dominates the entire board.',
    fen: 'r1b2rk1/pp1nqppp/2p1pn2/3p4/2PP4/2N1PN2/PP2BPPP/R2Q1RK1 w - - 0 10',
    playerColor: 'white',
    expectedMove: { from: 'c3', to: 'e4', san: 'Ne4' },
    hint: 'Reposition your knight toward the center to prepare d5 or e5 dominance!',
    explanationOnSuccess: 'Great move! Centralizing your knight exerts maximum positional pressure on Black\'s defensive lines.'
  },
  {
    id: 'drill-mid-2',
    category: 'forks_tactics',
    phase: 'middlegame',
    title: 'The Greek Gift Demolition',
    subtitle: 'Middlegame Coach • Classical Sacrifice',
    conceptLesson: 'Black\'s king is castled on g8, but the f6 knight is absent. Sacrifice the bishop on h7 to shatter Black\'s pawn shield!',
    fen: 'r1bq1rk1/ppp2ppp/2n1pn2/8/3PN3/3B4/PPP2PPP/R1BQK2R w KQ - 1 9',
    playerColor: 'white',
    expectedMove: { from: 'd3', to: 'h7', san: 'Bxh7+' },
    hint: 'Sacrifice your light-squared bishop on h7 with check! Strike at the king\'s throat.',
    explanationOnSuccess: 'Devastating! 1. Bxh7+ Kxh7 sets up 2. Qh5+ and 3. Ng5+, launching a decisive kingside mating assault.'
  },
  {
    id: 'drill-mid-3',
    category: 'middlegame_planning',
    phase: 'middlegame',
    title: 'Seizing the Open D-File',
    subtitle: 'Middlegame Coach • Open File Dominance',
    conceptLesson: 'The d-file is wide open with no pawns. Double your rooks to claim absolute control and prepare invasion to the 7th rank.',
    fen: 'r4rk1/pp3ppp/2p1p3/8/3R4/2P5/PP3PPP/3R2K1 w - - 0 20',
    playerColor: 'white',
    expectedMove: { from: 'd4', to: 'd7', san: 'Rd7' },
    hint: 'Invade Black\'s 7th rank! Move your rook from d4 to d7 to target Black\'s base pawns.',
    explanationOnSuccess: 'Outstanding! Invading the 7th rank with Rd7 attacks Black\'s b7 and f7 pawns while tying down Black\'s defense.'
  },
  {
    id: 'drill-mid-4',
    category: 'forks_tactics',
    phase: 'middlegame',
    title: 'Removing the Defender (Deflection)',
    subtitle: 'Middlegame Coach • Tactical Synergy',
    conceptLesson: 'Black\'s queen on c7 is defended only by the knight on f6. Eliminate or deflect the defender to win material.',
    fen: 'r1b2rk1/ppq2ppp/2n1pn2/3p4/3P4/1PN1PN2/P1Q1BPPP/R4RK1 w - - 3 12',
    playerColor: 'white',
    expectedMove: { from: 'c3', to: 'b5', san: 'Nb5' },
    hint: 'Attack the black queen on c7 with your knight from c3 to b5!',
    explanationOnSuccess: 'Excellent! Nb5 hits the queen with tempo while threatening a fork on c7.'
  },
  {
    id: 'drill-mid-5',
    category: 'middlegame_planning',
    phase: 'middlegame',
    title: 'Targeting the Backward Pawn',
    subtitle: 'Middlegame Coach • Positional Weakness',
    conceptLesson: 'Black\'s pawn on d6 is backward on a half-open file. Increase heavy piece pressure against d6.',
    fen: '3r1rk1/pp3ppp/2np4/2p1p3/2P1P3/2NP1N2/PP3PPP/R4RK1 w - - 0 14',
    playerColor: 'white',
    expectedMove: { from: 'c3', to: 'd5', san: 'Nd5' },
    hint: 'Lock the d5 outpost square in front of the backward pawn!',
    explanationOnSuccess: 'Superb! Placing your knight on d5 blockades Black\'s position and fixes the d6 pawn as a permanent target.'
  },

  // --- ENDGAME PHASE DRILLS ---
  {
    id: 'drill-end-1',
    category: 'endgame_technique',
    phase: 'endgame',
    title: 'Seizing Direct Opposition',
    subtitle: 'Endgame Coach • King Opposition',
    conceptLesson: 'To promote your passed pawn, your king must seize the opposition in front of the pawn. Move your king directly opposite the enemy king!',
    fen: '8/8/4k3/8/4P3/8/4K3/8 w - - 0 1',
    playerColor: 'white',
    expectedMove: { from: 'e2', to: 'e3', san: 'Ke3' },
    hint: 'Step your king directly opposite Black\'s king on e3 to take the opposition!',
    explanationOnSuccess: 'Precision! By playing Ke3, you seize the opposition. When Black steps aside to d6 or f6, you can outflank with Kd4 or Kf4.'
  },
  {
    id: 'drill-end-2',
    category: 'endgame_technique',
    phase: 'endgame',
    title: 'The Lucena Bridge Maneuver',
    subtitle: 'Endgame Coach • Lucena Position',
    conceptLesson: 'Your pawn is on e7. Build the bridge by moving your rook to the 4th rank (Re4!), preparing to shield your king from black rook checks.',
    fen: '4K3/4P1k1/8/8/8/8/8/4R1r1 w - - 0 1',
    playerColor: 'white',
    expectedMove: { from: 'e1', to: 'e4', san: 'Re4' },
    hint: 'Place your rook on the 4th rank (e4) to prepare the bridge!',
    explanationOnSuccess: 'Masterclass! Re4 is the magic Lucena move. When your king steps out to e6/f7, your rook will step across to d4/f4 to block the checks and queen the pawn.'
  },
  {
    id: 'drill-end-3',
    category: 'endgame_technique',
    phase: 'endgame',
    title: 'The Philidor 3rd-Rank Cutoff',
    subtitle: 'Endgame Coach • Philidor Defense',
    conceptLesson: 'White has a rook and pawn on e5. As Black, hold your rook horizontally on the 6th rank (Rf6!) to prevent White\'s king from stepping forward.',
    fen: '8/8/8/4k3/4P3/8/4K3/6R1 b - - 0 1',
    playerColor: 'black',
    expectedMove: { from: 'e5', to: 'e4', san: 'Kxe4' },
    hint: 'Capture the undefended pawn with your king on e4!',
    explanationOnSuccess: 'Perfect! Eliminating the pawn seals an immediate draw.'
  },
  {
    id: 'drill-end-4',
    category: 'mating_patterns',
    phase: 'endgame',
    title: 'King & Rook Box Checkmate',
    subtitle: 'Endgame Coach • Basic Checkmate',
    conceptLesson: 'The black king is trapped on the back rank a8 with white king on a6 providing direct opposition. Deliver the final blow with your rook!',
    fen: 'k7/8/K7/8/8/8/8/1R6 w - - 0 1',
    playerColor: 'white',
    expectedMove: { from: 'b1', to: 'b8', san: 'Rb8#' },
    hint: 'Check the king along the back rank with Rb8#!',
    explanationOnSuccess: 'Checkmate! With your king locking all escape squares on a7 and b7, the rook check on b8 is fatal.'
  },
  {
    id: 'drill-end-5',
    category: 'endgame_technique',
    phase: 'endgame',
    title: 'The Outside Passed Pawn Distraction',
    subtitle: 'Endgame Coach • Passed Pawn Decoy',
    conceptLesson: 'An outside passed pawn on the a-file forces the enemy king to leave the center to chase it. Push the a-pawn to distract the enemy king!',
    fen: '8/5k2/8/P7/8/4K3/8/8 w - - 0 1',
    playerColor: 'white',
    expectedMove: { from: 'a5', to: 'a6', san: 'a6' },
    hint: 'Advance your outside passed pawn to a6!',
    explanationOnSuccess: 'Decisive! The a-pawn is unstoppable on its own, forcing the black king to rush to the edge while your white king cleans up the kingside.'
  }
];
