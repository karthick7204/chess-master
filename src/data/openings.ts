import { OpeningInfo } from '../types/chess';

export const OPENINGS_DATABASE: OpeningInfo[] = [
  // ==========================================
  // 1. E4 OPENINGS (KING'S PAWN & DEFENSES)
  // ==========================================
  {
    eco: 'B00',
    name: "King's Pawn Game",
    moves: ['e4'],
    category: 'e4',
    side: 'white',
    description: "The most popular first move in chess! It immediately seizes control of the central squares (d5 and f5) and frees diagonals for both the Queen and light-squared Bishop.",
    keyIdeas: [
      "Seize control of d5 and f5 central squares",
      "Open rapid diagonal development for Queen and Bishop",
      "Prepare for open tactical game"
    ],
    famousPlayers: "Bobby Fischer, Garry Kasparov, Paul Morphy"
  },
  {
    eco: 'C20',
    name: "King's Pawn Game: Open Game",
    moves: ['e4', 'e5'],
    category: 'e4',
    side: 'black',
    description: "Symmetric and classic. Black directly challenges White for the center and opens development pathways.",
    keyIdeas: [
      "Directly challenge White's central space claim",
      "Control d4 square with the e5 pawn",
      "Equalize piece development symmetrically"
    ],
    famousPlayers: "Magnus Carlsen, Viswanathan Anand, Anatoly Karpov"
  },
  {
    eco: 'C40',
    name: "King's Knight Opening",
    moves: ['e4', 'e5', 'Nf3'],
    category: 'e4',
    side: 'white',
    description: "The gold standard: developing a piece toward the center while immediately attacking Black's undefended e5 pawn and preparing kingside castling.",
    keyIdeas: [
      "Develop knight toward the center with tempo",
      "Attack undefended e5 pawn immediately",
      "Prepare kingside castling (O-O)"
    ],
    famousPlayers: "Garry Kasparov, Bobby Fischer"
  },
  {
    eco: 'C50',
    name: "Italian Game (Giuoco Piano)",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    category: 'e4',
    side: 'white',
    description: "A foundational opening focusing on rapid kingside piece development and targeting Black's vulnerable f7 pawn, the weakest square on the board.",
    keyIdeas: [
      "Aim light-squared bishop directly at the sensitive f7 square",
      "Prepare rapid kingside castling by move 4 or 5",
      "Build a central pawn duo with c3 and d4"
    ],
    famousPlayers: "Garry Kasparov, Hikaru Nakamura, Wesley So"
  },
  {
    eco: 'C51',
    name: "Italian Game: Evans Gambit",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4'],
    category: 'e4',
    side: 'white',
    description: "A fierce romantic gambit. White sacrifices the b4 wing pawn to gain rapid development, build a massive pawn center with c3 and d4, and launch a furious attack.",
    keyIdeas: [
      "Sacrifice b-pawn to deflect Black's bishop and gain time",
      "Construct unstoppable d4+e4 pawn center with c3",
      "Rip open lines against the uncastled black king"
    ],
    famousPlayers: "Paul Morphy, Garry Kasparov, Adolf Anderssen"
  },
  {
    eco: 'C55',
    name: "Two Knights Defense",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6'],
    category: 'e4',
    side: 'black',
    description: "An aggressive, tactical counter-attack by Black, challenging White's e4 pawn instead of passively defending.",
    keyIdeas: [
      "Counter-attack White's e4 pawn dynamically",
      "Invite sharp tactical complications instead of passive defense",
      "Prepare the Polerio counter-strike 5...Na5 against 4.Ng5 d5"
    ],
    famousPlayers: "Mikhail Tal, Paul Keres, Alexander Alekhine"
  },
  {
    eco: 'C60',
    name: "Ruy Lopez (Spanish Opening)",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
    category: 'e4',
    side: 'white',
    description: "One of the oldest and deepest openings in chess history. White puts indirect pressure on e5 by attacking the knight defending it.",
    keyIdeas: [
      "Pressure e5 by threatening the defender on c6",
      "Maintain flexible pawn tension with c3 and d4",
      "Create rich, long-term strategic middlegames"
    ],
    famousPlayers: "Bobby Fischer, Garry Kasparov, Fabiano Caruana"
  },
  {
    eco: 'C65',
    name: "Ruy Lopez: Berlin Defense",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6'],
    category: 'e4',
    side: 'black',
    description: "Known as the 'Berlin Wall'. Black ignores White's bishop threat and directly counterattacks White's central e4 pawn.",
    keyIdeas: [
      "Counter-attack White's e4 pawn immediately",
      "Neutralize White's attacking initiative into an endgame wall",
      "Proven drawing weapon at World Championship levels"
    ],
    famousPlayers: "Vladimir Kramnik, Magnus Carlsen, Viswanathan Anand"
  },
  {
    eco: 'C70',
    name: "Ruy Lopez: Morphy Defense",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6'],
    category: 'e4',
    side: 'black',
    description: "The most common response in the Ruy Lopez. Black puts the question to White's bishop immediately: capture the knight or retreat.",
    keyIdeas: [
      "Put the question to White's bishop immediately",
      "Gain queenside space with ...b5 after Ba4",
      "Harmoniously develop bishop to b7 or e7"
    ],
    famousPlayers: "Paul Morphy, Garry Kasparov, Magnus Carlsen"
  },
  {
    eco: 'C44',
    name: "Scotch Game",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4'],
    category: 'e4',
    side: 'white',
    description: "White blows open the center immediately on move 3 to create open lines for pieces.",
    keyIdeas: [
      "Strike in the center immediately on move 3",
      "Open d-file and diagonals for bishops",
      "Avoid deep theoretical memorization of the Ruy Lopez"
    ],
    famousPlayers: "Garry Kasparov, Magnus Carlsen"
  },
  {
    eco: 'C42',
    name: "Petrov's Defense (Russian Game)",
    moves: ['e4', 'e5', 'Nf3', 'Nf6'],
    category: 'e4',
    side: 'black',
    description: "A rock-solid symmetrical defense where Black counter-attacks White's e4 pawn instead of defending e5.",
    keyIdeas: [
      "Symmetrically strike White's e4 pawn",
      "Extremely solid and resilient pawn structure",
      "Hardest defense for White to break down"
    ],
    famousPlayers: "Fabiano Caruana, Vladimir Kramnik, Anatoly Karpov"
  },
  {
    eco: 'C30',
    name: "King's Gambit",
    moves: ['e4', 'e5', 'f4'],
    category: 'e4',
    side: 'white',
    description: "The classic romantic opening! White offers a wing pawn to divert Black's e5 pawn, conquer the center with d4, and open the f-file for the rook.",
    keyIdeas: [
      "Divert Black's central pawn with the f4 sacrifice",
      "Build a full pawn center with d4",
      "Open the f-file for rook attacks against f7"
    ],
    famousPlayers: "Boris Spassky, Paul Morphy, David Bronstein"
  },
  {
    eco: 'B20',
    name: "Sicilian Defense",
    moves: ['e4', 'c5'],
    category: 'e4',
    side: 'black',
    description: "The most aggressive and successful counter to 1. e4! Black fights for the center from the flank, aiming for an asymmetrical, dynamic middlegame.",
    keyIdeas: [
      "Fight for the d4 square from the c-file flank",
      "Exchange c-pawn for White's central d-pawn (cxd4)",
      "Secure two central pawns (e and d) and semi-open c-file"
    ],
    famousPlayers: "Garry Kasparov, Bobby Fischer, Alexander Grischuk"
  },
  {
    eco: 'B90',
    name: "Sicilian Defense: Najdorf Variation",
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'],
    category: 'e4',
    side: 'black',
    description: "The favorite weapon of World Champions Garry Kasparov and Bobby Fischer. Extremely sharp, flexible, and uncompromising.",
    keyIdeas: [
      "Prevent White knights and bishops from landing on b5",
      "Prepare ...e5 central expansion or ...b5 queenside storm",
      "Maximum tactical richness and winning chances for Black"
    ],
    famousPlayers: "Bobby Fischer, Garry Kasparov, Maxime Vachier-Lagrave"
  },
  {
    eco: 'B70',
    name: "Sicilian Defense: Dragon Variation",
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6'],
    category: 'e4',
    side: 'black',
    description: "Named after the constellation Draco. Black fianchettoes the dark-squared bishop onto the long diagonal, aiming directly at White's queenside.",
    keyIdeas: [
      "Fianchetto bishop on g7 aiming down the h8-a1 diagonal",
      "Fierce opposite-side castling race: Black attacks queenside, White attacks kingside",
      "Sacrifice rook on c3 (Rxc3) to shatter White's king"
    ],
    famousPlayers: "Bent Larsen, Hikaru Nakamura, Teimour Radjabov"
  },
  {
    eco: 'B22',
    name: "Sicilian Defense: Alapin Variation",
    moves: ['e4', 'c5', 'c3'],
    category: 'e4',
    side: 'white',
    description: "White prepares to establish a dominant pawn center with d4, neutralizing Black's typical Sicilian counterplay.",
    keyIdeas: [
      "Support d4 push with the c3 pawn",
      "Maintain a broad, classical pawn center",
      "Avoid sharp Open Sicilian theory"
    ],
    famousPlayers: "Evgeny Sveshnikov, Sergei Tiviakov"
  },
  {
    eco: 'C00',
    name: "French Defense",
    moves: ['e4', 'e6'],
    category: 'e4',
    side: 'black',
    description: "A resilient, counter-attacking opening. Black prepares d5 to challenge White's center while maintaining a solid pawn chain.",
    keyIdeas: [
      "Challenge White's center with an immediate ...d5",
      "Form a resilient pawn chain (e6 + d5)",
      "Counter-attack the base of White's chain with ...c5 and ...f6"
    ],
    famousPlayers: "Mikhail Botvinnik, Viktor Korchnoi, Ding Liren"
  },
  {
    eco: 'C02',
    name: "French Defense: Advance Variation",
    moves: ['e4', 'e6', 'd4', 'd5', 'e5'],
    category: 'e4',
    side: 'white',
    description: "White gains spatial territory on the kingside and locks the center, while Black focuses on undermining White's d4 pawn with c5.",
    keyIdeas: [
      "Lock the center with e5 and seize kingside space",
      "Cramp Black's pieces and build a kingside attacking wedge",
      "Defend the d4 pawn against Black's ...c5, ...Nc6, and ...Qb6 pressure"
    ],
    famousPlayers: "Aaron Nimzowitsch, Alexey Shirov"
  },
  {
    eco: 'B10',
    name: "Caro-Kann Defense",
    moves: ['e4', 'c6'],
    category: 'e4',
    side: 'black',
    description: "One of the most solid defenses in all of chess. Black supports a central d5 push without boxing in the light-squared bishop.",
    keyIdeas: [
      "Prepare ...d5 with c6 support without locking the light-squared bishop",
      "Develop bishop smoothly to f5 or g4",
      "Extremely robust pawn structure with no inherent weaknesses"
    ],
    famousPlayers: "Anatoly Karpov, Alireza Firouzja, Hikaru Nakamura"
  },
  {
    eco: 'B12',
    name: "Caro-Kann Defense: Advance Variation",
    moves: ['e4', 'c6', 'd4', 'd5', 'e5', 'Bf5'],
    category: 'e4',
    side: 'black',
    description: "White locks the center with e5, but unlike the French Defense, Black smoothly develops the bishop outside the pawn chain to f5.",
    keyIdeas: [
      "Activate bishop on f5 before locking pawns with ...e6",
      "Strike at White's d4 center with ...c5",
      "Healthy, harmonious piece layout with zero bad bishops"
    ],
    famousPlayers: "Anatoly Karpov, Magnus Carlsen"
  },
  {
    eco: 'B01',
    name: "Scandinavian Defense",
    moves: ['e4', 'd5'],
    category: 'e4',
    side: 'black',
    description: "Black immediately challenges White's e4 pawn on move 1, forcing an open center.",
    keyIdeas: [
      "Force immediate central confrontation on move 1",
      "After 2.exd5 Qxd5 3.Nc3, retreat Queen safely to a5 or d6",
      "Easy, rapid minor piece development"
    ],
    famousPlayers: "Magnus Carlsen, Ian Rogers"
  },

  // ==========================================
  // 2. D4 OPENINGS (QUEEN'S PAWN & DEFENSES)
  // ==========================================
  {
    eco: 'D00',
    name: "Queen's Pawn Opening",
    moves: ['d4'],
    category: 'd4',
    side: 'white',
    description: "A solid, strategic opening move. Unlike 1. e4, the d4 pawn is already protected by the queen, leading to richer positional maneuvering.",
    keyIdeas: [
      "Control central squares c5 and e5",
      "Maintain protected pawn on d4 from move 1",
      "Build deep, maneuvering positional structures"
    ],
    famousPlayers: "Garry Kasparov, Vladimir Kramnik, Magnus Carlsen"
  },
  {
    eco: 'D02',
    name: "London System",
    moves: ['d4', 'd5', 'Nf3', 'Nf6', 'Bf4'],
    category: 'd4',
    side: 'white',
    description: "The popular, rock-solid system. White develops the dark-squared bishop outside the pawn pyramid before playing e3, creating an unshakeable fortress.",
    keyIdeas: [
      "Develop dark-squared bishop to f4 before playing e3",
      "Erect solid pawn pyramid (c3, d4, e3)",
      "Establish strong knight outpost on e5"
    ],
    famousPlayers: "Magnus Carlsen, Ding Liren, Gata Kamsky"
  },
  {
    eco: 'D06',
    name: "Queen's Gambit",
    moves: ['d4', 'd5', 'c4'],
    category: 'd4',
    side: 'white',
    description: "White offers a wing pawn to deflect Black's central d5 pawn and seize total control of the central squares with e4.",
    keyIdeas: [
      "Challenge Black's d5 bastion with the c4 wing pawn",
      "Conquer the center with e4 after pawn exchange",
      "The most respected 1.d4 opening in chess history"
    ],
    famousPlayers: "Garry Kasparov, Anatoly Karpov, Alexander Alekhine"
  },
  {
    eco: 'D20',
    name: "Queen's Gambit Accepted (QGA)",
    moves: ['d4', 'd5', 'c4', 'dxc4'],
    category: 'd4',
    side: 'white',
    description: "Black accepts the gambit pawn. White will easily regain the pawn while enjoying a superior center and quicker development.",
    keyIdeas: [
      "White rapidly regains c4 with Bxc4",
      "Dominate the open center with e4",
      "Black attempts counterplay against White's center with ...c5"
    ],
    famousPlayers: "Viswanathan Anand, Levon Aronian"
  },
  {
    eco: 'D30',
    name: "Queen's Gambit Declined (QGD)",
    moves: ['d4', 'd5', 'c4', 'e6'],
    category: 'd4',
    side: 'black',
    description: "The classical response played in dozens of World Championships. Black firmly protects d5 with a rock-solid pawn chain.",
    keyIdeas: [
      "Anchor the d5 pawn with ...e6",
      "Develop kingside minor pieces safely before castling",
      "Free the light-squared bishop later via ...dxc4 and ...c5 or ...e5"
    ],
    famousPlayers: "Garry Kasparov, Anatoly Karpov, Magnus Carlsen"
  },
  {
    eco: 'D10',
    name: "Slav Defense",
    moves: ['d4', 'd5', 'c4', 'c6'],
    category: 'd4',
    side: 'black',
    description: "A revered defense that protects the d5 center pawn with c6, keeping the diagonal open for the light-squared bishop.",
    keyIdeas: [
      "Solidify d5 with ...c6 without blocking the light-squared bishop",
      "Option to capture on c4 and hold the pawn with ...b5",
      "Extremely sound pawn structure favoured in World Championship matches"
    ],
    famousPlayers: "Vassily Smyslov, Viswanathan Anand, Vladimir Kramnik"
  },
  {
    eco: 'E60',
    name: "King's Indian Defense (KID)",
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'],
    category: 'd4',
    side: 'black',
    description: "A ferocious, hypermodern favorite of Garry Kasparov. Black lets White occupy the center, castles quickly, and launches a crushing pawn storm on White's king.",
    keyIdeas: [
      "Let White build a broad pawn center (d4, c4, e4)",
      "Strike back with ...e5 or ...c5 to lock or challenge the center",
      "Launch a devastating kingside pawn avalanche with ...f5 and ...g5"
    ],
    famousPlayers: "Garry Kasparov, Bobby Fischer, Hikaru Nakamura"
  },
  {
    eco: 'E20',
    name: "Nimzo-Indian Defense",
    moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'],
    category: 'd4',
    side: 'black',
    description: "One of Black's most respected defenses. Black pins White's knight on c3, controlling e4 and threatening to double White's pawns.",
    keyIdeas: [
      "Pin the c3 knight to control the e4 square from afar",
      "Willingness to trade bishop for knight (Bxc3) to double White's pawns",
      "Target White's static doubled c-pawns on the queenside"
    ],
    famousPlayers: "Aaron Nimzowitsch, Magnus Carlsen, Vladimir Kramnik"
  },
  {
    eco: 'D80',
    name: "Grünfeld Defense",
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5'],
    category: 'd4',
    side: 'black',
    description: "Hypermodern dynamic mastery: Black allows White a huge center (cxd5, e4) only to bombard it with Bg7, c5, and Qa5.",
    keyIdeas: [
      "Allow White a massive pawn center with e4",
      "Immediately attack the center with ...Bg7, ...c5, and ...Nc6",
      "Dynamic piece activity and pressure on White's d4 pawn"
    ],
    famousPlayers: "Garry Kasparov, Peter Svidler, Maxime Vachier-Lagrave"
  },
  {
    eco: 'A80',
    name: "Dutch Defense",
    moves: ['d4', 'f5'],
    category: 'd4',
    side: 'black',
    description: "An aggressive, asymmetrical counter. Black immediately clamps down on White's e4 square with the f-pawn.",
    keyIdeas: [
      "Control e4 square immediately with the f5 pawn",
      "Prepare a kingside attacking setup (Stonewall or Leningrad with g6)",
      "High winning chances and unbalanced pawn play"
    ],
    famousPlayers: "Hikaru Nakamura, Ian Nepomniachtchi"
  },

  // ==========================================
  // 3. FLANK & HYPERMODERN OPENINGS
  // ==========================================
  {
    eco: 'A10',
    name: "English Opening",
    moves: ['c4'],
    category: 'flank',
    side: 'white',
    description: "A flexible flank opening. White fights for the central d5 square without committing the d- or e-pawns right away.",
    keyIdeas: [
      "Control d5 from the flank without committing central pawns",
      "Fianchetto kingside bishop (g3 + Bg2) for long-diagonal pressure",
      "Transpose easily into 1.d4 Queen's Gambit lines"
    ],
    famousPlayers: "Mikhail Botvinnik, Garry Kasparov, Magnus Carlsen"
  },
  {
    eco: 'A04',
    name: "Réti Opening",
    moves: ['Nf3'],
    category: 'flank',
    side: 'white',
    description: "Hypermodern play named after Richard Réti. White controls central squares from a distance while keeping opening options completely open.",
    keyIdeas: [
      "Control e5 and d4 without placing pawns in the center yet",
      "Double fianchetto options (b3 + g3)",
      "Lure black pawns forward to strike them down later"
    ],
    famousPlayers: "Richard Réti, Vladimir Kramnik"
  },

  // ==========================================
  // 4. OPENING TRAPS & REFUTATIONS
  // ==========================================
  {
    eco: 'C20',
    name: "Scholar's Mate Trap",
    moves: ['e4', 'e5', 'Qh5', 'Nc6', 'Bc4', 'Nf6', 'Qxf7#'],
    category: 'traps',
    side: 'white',
    description: "The notorious 4-move checkmate targeting the sensitive f7 square with Queen and Bishop.",
    keyIdeas: [
      "White attacks the weakest square on the board (f7)",
      "Refutation for Black: 3...g6! kicks the queen and neutralizes the mate",
      "After 4.Qf3, Black plays 4...Nf6 with a solid development lead"
    ],
    famousPlayers: "Elementary & Club level games"
  },
  {
    eco: 'C57',
    name: "Fried Liver Attack Trap",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Nxd5', 'Nxf7'],
    category: 'traps',
    side: 'white',
    description: "White sacrifices the knight on f7 to drag Black's king into the center of the board under crossfire.",
    keyIdeas: [
      "White sacrifices knight on f7: 6...Kxf7 7.Qf3+ Ke6 8.Nc3",
      "Black refutation: Play 5...Na5! (Polerio Defense) instead of 5...Nxd5?!",
      "5...Na5 attacks White's bishop and claims the initiative"
    ],
    famousPlayers: "Classical Master Game Trap"
  },
  {
    eco: 'C41',
    name: "Légal's Mate (Queen Sacrifice)",
    moves: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Bg4', 'Nc3', 'g6', 'Nxe5', 'Bxd1', 'Bxf7+', 'Ke7', 'Nd5#'],
    category: 'traps',
    side: 'white',
    description: "The legendary queen sacrifice trap where three coordinated minor pieces deliver checkmate against the uncastled king.",
    keyIdeas: [
      "White sacrifices the queen with 5.Nxe5! exploiting the pinned bishop",
      "If Black takes the queen (5...Bxd1??), White mates with 6.Bxf7+ Ke7 7.Nd5#",
      "Black must play 5...dxe5 6.Qxg4, staying alive down a pawn"
    ],
    famousPlayers: "Sire de Légal (1750)"
  },
  {
    eco: 'C70',
    name: "Noah's Ark Trap",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'd6', 'd4', 'b5', 'Bb3', 'Nxd4', 'Nxd4', 'exd4', 'Qxd4', 'c5', 'Qd5', 'Be6', 'Qc6+', 'Bd7', 'Qd5', 'c4'],
    category: 'traps',
    side: 'black',
    description: "Trapping White's light-squared bishop in the Ruy Lopez with the connected pawn roller ...b5, ...c5, and ...c4.",
    keyIdeas: [
      "Black lures White's queen onto d4 with ...Nxd4 and ...exd4",
      "Pawn wedge ...c5, ...Be6, and ...c4 traps the bishop on b3",
      "White must play 7.c3! or 7.Bd5 instead of 7.Qxd4??"
    ],
    famousPlayers: "Historical Ruy Lopez trap"
  },
  {
    eco: 'C65',
    name: "Fishing Pole Trap",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6', 'O-O', 'Ng4', 'h3', 'h5', 'hxg4', 'hxg4', 'Nh2', 'Qh4'],
    category: 'traps',
    side: 'black',
    description: "Black dangles a bait knight on g4 and uses the open h-file with ...h5 and ...Qh4 for an unstoppable kingside checkmate.",
    keyIdeas: [
      "Black sacrifices knight on g4 to blast open the h-file for the rook",
      "If White captures with hxg4??, ...hxg4 followed by ...Qh4 mates",
      "White must ignore the bait and play 6.c3, 6.d4, or 6.Re1"
    ],
    famousPlayers: "Club & blitz tactical trap"
  },
  {
    eco: 'C50',
    name: "Blackburne Shilling Gambit Trap",
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nd4', 'Nxe5', 'Qg5', 'Nxf7', 'Qxg2', 'Rf1', 'Qxe4+', 'Be2', 'Nf3#'],
    category: 'traps',
    side: 'black',
    description: "Black baits White into capturing e5 and f7, then infiltrates with the Queen to deliver a smothered checkmate.",
    keyIdeas: [
      "Black plays 3...Nd4?! tempting 4.Nxe5?!",
      "Black retaliates with 4...Qg5! hitting e5 and g2",
      "Ends in a stunning smothered checkmate with ...Nf3#",
      "White refutation: Simply play 4.Nxd4! exd4 5.O-O with a huge lead"
    ],
    famousPlayers: "Joseph Henry Blackburne"
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
