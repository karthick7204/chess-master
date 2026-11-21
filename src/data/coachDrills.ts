import { InteractiveDrill } from '../types/learning';

export const COACH_DRILLS: InteractiveDrill[] = [
  // ==========================================
  // 1. PIECE SAFETY (Hanging pieces & blunder prevention)
  // ==========================================
  {
    id: 'safety-1',
    category: 'piece_safety',
    title: 'Saving the Targeted Bishop',
    subtitle: 'Piece Safety • CPR Technique',
    conceptLesson: 'Before making any move, check which of your pieces are currently in your opponent\'s crosshairs. If an attacked piece has no guard, remember C.P.R: Capture the attacker, Protect the piece, or Run away to safety.',
    fen: 'r1bqk2r/ppp2ppp/2n5/1B1p4/1b1Pn3/2N2N2/PPP2PPP/R1BQK2R w KQkq - 0 8',
    playerColor: 'white',
    expectedMove: { from: 'c1', to: 'd2', san: 'Bd2' },
    hint: 'Your knight on c3 is pinned to your king and attacked twice. Unpin and defend it with your dark-squared bishop!',
    explanationOnSuccess: 'Excellent! Bd2 cleanly neutralizes the pin on your king, adding a firm defender to the c3 knight and safeguarding your position.'
  },
  {
    id: 'safety-2',
    category: 'piece_safety',
    title: 'The Hanging Rook Alarm',
    subtitle: 'Piece Safety • Perimeter Awareness',
    conceptLesson: 'Rooks on open or semi-open files can often be ambushed along long diagonals. Always scan the board for long-range enemy bishops aiming at undefended rooks.',
    fen: 'r3k2r/pppq1ppp/2n1bn2/3p4/1b1P4/2N1BN2/PPP1BPPP/R2Q1RK1 w kq - 6 9',
    playerColor: 'white',
    expectedMove: { from: 'c3', to: 'a4', san: 'Na4' },
    hint: 'Black is preparing to increase pressure on c3. Reposition your knight to a4 to challenge the bishop and guard b2!',
    explanationOnSuccess: 'Solid defense! By identifying the pressure on your queenside, you repositioned proactively without shedding material.'
  },

  // ==========================================
  // 2. FORKS & TACTICS (Double attacks)
  // ==========================================
  {
    id: 'fork-1',
    category: 'forks_tactics',
    title: 'The Royal Knight Fork',
    subtitle: 'Tactics • Knight Geometry',
    conceptLesson: 'Knights are the ultimate fork specialists because they jump over pieces and attack squares of opposite colors. Look for squares where your knight can hit the King and Queen simultaneously.',
    fen: 'r1b1k2r/pp3ppp/2n1p3/2q5/4n3/2N2N2/PPP1BPPP/R2QK2R w KQkq - 0 10',
    playerColor: 'white',
    expectedMove: { from: 'c3', to: 'e4', san: 'Nxe4' },
    hint: 'Black left their knight on e4 unprotected while their queen is active on c5. Eliminate the knight to win material and threaten the queen!',
    explanationOnSuccess: 'Brilliant! You captured the loose knight on e4 while attacking the queen on c5 with tempo!'
  },
  {
    id: 'fork-2',
    category: 'forks_tactics',
    title: 'The Central Pawn Fork',
    subtitle: 'Tactics • Pawn Double Attack',
    conceptLesson: 'Pawns capture diagonally, making them lethal when pushed between two enemy minor pieces. When an opponent leaves two pieces on the same rank separated by one square, strike with a pawn fork!',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/3PP3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 5',
    playerColor: 'white',
    expectedMove: { from: 'd4', to: 'd5', san: 'd5' },
    hint: 'Push your d-pawn forward! Notice how d5 attacks both Black\'s knight on c6 and controls the central highway.',
    explanationOnSuccess: 'Outstanding! The pawn push to d5 attacks the knight on c6 with tempo, winning space and dictating the initiative.'
  },

  // ==========================================
  // 3. MIDDLEGAME PLANNING (Post-opening strategy)
  // ==========================================
  {
    id: 'middlegame-1',
    category: 'middlegame_planning',
    title: 'Seizing the Open Highway',
    subtitle: 'Middlegame • Rook Coordination',
    conceptLesson: 'Once opening development and castling are complete, rooks belong on open files (files with no pawns). Dominating the open file gives you invasion outposts into the opponent\'s camp.',
    fen: 'r4rk1/pp1q1ppp/2n1bn2/3p4/3P4/2N1BN2/PP2BPPP/R2Q1RK1 w - - 4 11',
    playerColor: 'white',
    expectedMove: { from: 'f3', to: 'e5', san: 'Ne5' },
    hint: 'Plant your knight firmly onto the golden central outpost on e5 where it radiates power over the entire board!',
    explanationOnSuccess: 'Masterful! Ne5 anchors a monster knight on the key central outpost, supported by the d4 pawn.'
  },
  {
    id: 'middlegame-2',
    category: 'middlegame_planning',
    title: 'Controlling the D-File',
    subtitle: 'Middlegame • Central File Domination',
    conceptLesson: 'When a central file is open or half-open, bring your rooks into the center. A rook on the d-file or e-file creates constant threats against enemy pieces.',
    fen: 'r2q1rk1/pp1b1ppp/2n1pn2/8/3P4/2NB1N2/PP3PPP/R2QR1K1 w - - 0 13',
    playerColor: 'white',
    expectedMove: { from: 'd1', to: 'e2', san: 'Qe2' },
    hint: 'Connect your rooks by moving your queen to e2, preparing to double rooks on the central files!',
    explanationOnSuccess: 'Textbook strategic planning! Qe2 unites your rooks and completes your middlegame preparation for central breakthrough.'
  },

  // ==========================================
  // 4. MATING PATTERNS (Finishing technique)
  // ==========================================
  {
    id: 'mate-1',
    category: 'mating_patterns',
    title: 'The Classic Back-Rank Mate',
    subtitle: 'Mating Patterns • Corridor Technique',
    conceptLesson: 'When an opponent\'s king is castled behind an unbroken pawn wall (f7-g7-h7) with no escape square ("luft"), a single rook or queen reaching the back rank delivers an inescapable checkmate.',
    fen: '3r2k1/5ppp/8/8/8/8/4QPPP/6K1 w - - 0 1',
    playerColor: 'white',
    expectedMove: { from: 'e2', to: 'e8', san: 'Qe8#' },
    hint: 'The Black king has no breathing room on the back rank. Invade with your Queen all the way to e8!',
    explanationOnSuccess: 'Checkmate! 🎉 The classic back-rank corridor mate. Always remember to check for or create "luft" (h3/h6) to prevent this!'
  },
  {
    id: 'mate-2',
    category: 'mating_patterns',
    title: 'The Queen & Bishop Battery',
    subtitle: 'Mating Patterns • Weak Complex Exploitation',
    conceptLesson: 'The Queen supported by a Bishop or Knight targeting the f7 or h7 square is the most frequent mating net in chess. The Queen lands right in front of the king with point-blank protection.',
    fen: 'r1b2rk1/pp3ppp/2n5/3p4/1b6/2NBQN2/PPP2PPP/R4RK1 w - - 0 12',
    playerColor: 'white',
    expectedMove: { from: 'e3', to: 'e4', san: 'Qe4' },
    hint: 'Align your queen toward h7 by centralizing to e4, threatening both a discovered attack and unstoppable checkmate threats!',
    explanationOnSuccess: 'Devastating attack! Qe4 creates an overwhelming battery aiming at h7, forcing Black into total concession.'
  },

  // ==========================================
  // 5. ENDGAME TECHNIQUE (King activation & conversion)
  // ==========================================
  {
    id: 'endgame-1',
    category: 'endgame_technique',
    title: 'The Active King in the Endgame',
    subtitle: 'Endgame Technique • The King is a Weapon',
    conceptLesson: 'In the opening and middlegame, your King must hide in safety. But the moment queens are traded off and an endgame begins, the King transitions from a target into your strongest active attacking piece!',
    fen: '8/5k2/4p3/4P3/8/5K2/8/8 w - - 0 1',
    playerColor: 'white',
    expectedMove: { from: 'f3', to: 'e4', san: 'Ke4' },
    hint: 'March your King forward into the center! Ke4 seizes control of the key squares around the e-pawns.',
    explanationOnSuccess: 'Flawless endgame technique! In king-and-pawn endgames, the player who activates their king first wins the day.'
  },
  {
    id: 'endgame-2',
    category: 'endgame_technique',
    title: 'Passed Pawn Escort',
    subtitle: 'Endgame Technique • Shouldering Opposition',
    conceptLesson: 'A passed pawn must be pushed with King support. Keep your king in front of or beside your passed pawn to pave its road to promotion.',
    fen: '8/8/8/3P4/4K3/8/5k2/8 w - - 0 1',
    playerColor: 'white',
    expectedMove: { from: 'd5', to: 'd6', san: 'd6' },
    hint: 'Your passed pawn is unopposed! Push d6 forward on the path to becoming a new Queen.',
    explanationOnSuccess: 'Decisive! The passed pawn marches forward, completely outside the reach of the enemy king.'
  }
];
