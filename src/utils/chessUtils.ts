export interface CapturedPiecesSummary {
  whiteCaptured: string[]; // pieces taken from Black
  blackCaptured: string[]; // pieces taken from White
  materialAdvantage: number; // positive = White advantage, negative = Black advantage
}

const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9
};

export function getCapturedPieces(fen: string): CapturedPiecesSummary {
  const initial = { p: 8, n: 2, b: 2, r: 2, q: 1 };
  const currentWhite = { p: 0, n: 0, b: 0, r: 0, q: 0 };
  const currentBlack = { p: 0, n: 0, b: 0, r: 0, q: 0 };

  const positionPart = (fen || '').split(' ')[0] || '';
  for (const char of positionPart) {
    const lower = char.toLowerCase() as keyof typeof initial;
    if (initial[lower] !== undefined) {
      if (char === char.toUpperCase()) {
        currentWhite[lower] = (currentWhite[lower] || 0) + 1;
      } else {
        currentBlack[lower] = (currentBlack[lower] || 0) + 1;
      }
    }
  }

  const whiteCaptured: string[] = [];
  const blackCaptured: string[] = [];

  let whiteScore = 0;
  let blackScore = 0;

  (['q', 'r', 'b', 'n', 'p'] as const).forEach(piece => {
    // Pieces Black has lost (White captured)
    const missingBlack = Math.max(0, initial[piece] - (currentBlack[piece] || 0));
    for (let i = 0; i < missingBlack; i++) {
      whiteCaptured.push(piece);
      whiteScore += PIECE_VALUES[piece];
    }

    // Pieces White has lost (Black captured)
    const missingWhite = Math.max(0, initial[piece] - (currentWhite[piece] || 0));
    for (let i = 0; i < missingWhite; i++) {
      blackCaptured.push(piece);
      blackScore += PIECE_VALUES[piece];
    }
  });

  return {
    whiteCaptured,
    blackCaptured,
    materialAdvantage: whiteScore - blackScore
  };
}

export const PIECE_ICONS: Record<string, string> = {
  p: '♟',
  n: '♞',
  b: '♝',
  r: '♜',
  q: '♛'
};
