import { CoachPersonality } from '../types/chess';

export const COACH_PERSONALITIES: CoachPersonality[] = [
  {
    id: 'sophia',
    name: 'Coach Sophia',
    title: 'International Master & Chief Mentor',
    rating: 2350,
    avatar: '👩‍🏫',
    style: 'encouraging',
    description: 'Patient, warm, and highly pedagogical. Specializes in opening principles, king safety, and constructive encouragement.'
  },
  {
    id: 'mikhail',
    name: 'GM Mikhail',
    title: 'Grandmaster & Tactical Specialist',
    rating: 2620,
    avatar: '🧙‍♂️',
    style: 'tactical',
    description: 'Sharp, alert, and passionate about attacking motifs, sacrifices, forks, and explosive combinations.'
  },
  {
    id: 'capablanca',
    name: 'Master Jose',
    title: 'Positional Strategist',
    rating: 2580,
    avatar: '🧐',
    style: 'positional',
    description: 'Calm, methodical, and classical. Teaches piece harmony, pawn structure, outposts, and flawless endgame technique.'
  }
];
