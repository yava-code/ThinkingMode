export enum ModelMode {
  FAST = 'FAST',
  THINKING = 'THINKING'
}

export interface SimulationStep {
  id: string;
  type: 'input' | 'process' | 'output';
  content: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  timestamp: number;
}

export interface Scenario {
  id: string;
  title: string;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  trap: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'drying-time',
    title: 'The Drying Time Trap',
    question: 'If it takes 10 minutes to dry 1 shirt in the sun, how long does it take to dry 5 shirts?',
    difficulty: 'Easy',
    trap: 'Impulse says 50 minutes. Reality is concurrent (10 minutes).',
  },
  {
    id: 'word-count',
    title: 'The "Strawberry" Test',
    question: 'How many times does the letter "r" appear in the word "Strawberry"?',
    difficulty: 'Medium',
    trap: 'Tokenization sees the word as chunks, missing individual letters without breakdown.',
  },
  {
    id: 'sister-logic',
    title: 'The Sibling Paradox',
    question: 'Alice has 4 brothers. Each brother has 3 sisters. How many sisters does Alice have?',
    difficulty: 'Hard',
    trap: 'Impulse math (4*3=12) fails. They share sisters. The answer depends on including Alice.',
  }
];