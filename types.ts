
export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export type Language = 'en' | 'zh';

export interface SRSState {
  interval: number; // Days until next review
  repetition: number; // Number of consecutive successful recalls
  efactor: number; // Ease factor (starts at 2.5)
  dueDate: number; // Timestamp (ms)
}

export interface Question {
  id: number;
  title: string;
  titleCn: string;
  slug: string; // for leetcode url
  difficulty: Difficulty;
  tags: string[];
  description: string;
  descriptionCn: string;
  solutionIdea: string;
  solutionIdeaCn: string;
  timeComplexity: string;
  spaceComplexity: string;
  exampleInput: string;
  exampleOutput: string;
}

export interface Flashcard extends Question {
  srs: SRSState;
  isNew: boolean;
}

export enum Rating {
  Forgot = 0,    // 忘记了 (Reset progress)
  Hazy = 3,      // 有印象 (Hard/Struggle)
  Mastered = 5   // 记住了 (Easy/Perfect)
}
