# ChessMaster Coach AI ♟️🎓

An interactive, pedagogical chess coach web application built with React, TypeScript, Tailwind CSS, Stockfish analysis heuristics, and the ECO Opening Explorer.

Unlike traditional chess apps that act only as rigid tutorials or quiet engine analyzers, **ChessMaster Coach** operates like an actual live private grandmaster session:
- **Coach "Thinking Aloud"**: Explains *why* the coach chose their specific move (central control, tactical pin, king safety, open files, or piece coordination).
- **Player Move Evaluation**: Identifies openings by name and ECO code, flags moves (*Book*, *Best*, *Inaccuracy*, *Mistake*, *Blunder*), explains tactical pitfalls in plain English, and draws recommended arrows.
- **Interactive Coaching Tools**: "Take Back & Try Again", "Show Threat", "Best Move Hint", and Text-to-Speech audio commentary.
- **100% Free, Offline & Zero-Token**: Instant responses with 0ms latency and no API keys required.

---

## Features

1. **Side-by-Side Coach Studio**:
   - Live chessboard in the front with real-time arrow visualizers (green for best moves, red for threats).
   - Evaluation Bar dynamically tracking centipawn balance and mate threats.
   - Live Coach Commentary Feed with move quality badges and tactical explanations.
2. **Opening Recognition**:
   - Recognizes major openings and variations (e.g., *Ruy Lopez: Berlin Defense*, *Sicilian Defense: Najdorf*, *Queen's Gambit Declined*, *King's Indian Defense*).
3. **Multi-Personality Coaches**:
   - **Coach Sophia**: Supportive, patient, focuses on fundamentals and opening principles.
   - **GM Mikhail**: Sharp, tactical, aggressive, loves sacrifices and forks.
   - **Master Jose**: Positional, clean, emphasizes piece harmony and endgame technique.
4. **Interactive Action Bar**:
   - `Take Back`: Rewind moves to retry when you blunder.
   - `Best Move`: Draws green arrow indicating optimal continuation.
   - `Threat`: Highlights opponent's most dangerous attacking ideas in red.
   - `Flip Board`: Switch perspectives anytime.
   - `Spoken Audio`: Native Web Speech synthesis speaks the coach's thoughts aloud.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Run

```bash
# Navigate to project
cd chess-master

# Install dependencies (already installed)
npm install

# Start local development server
npm run dev
```

Open your browser at `http://localhost:5173`.
