
export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export type Language = 'en' | 'zh';

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
