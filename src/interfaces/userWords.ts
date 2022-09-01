import WordDifficulty from '../shared/enums/UserWordDifficulty';

export interface GameStatistics {
  correctAnswers: number;
  incorrectAnswers: number;
  winStreak: number;
}

export interface UserWordOptional {
  learned?: boolean;
  games?: {
    audiocall?: GameStatistics;
    sprint?: GameStatistics;
  };
}

export interface UserWord {
  id: string;
  difficulty: WordDifficulty;
  optional?: UserWordOptional;
  wordId: string;
}

export interface GetUserWordByIdData {
  userId: string;
  wordId: string;
}

export interface MutateUserWordBody {
  difficulty: WordDifficulty;
  optional: UserWordOptional;
}

export interface MutateUserWordData {
  userId: string;
  wordId: string;
  body: MutateUserWordBody;
}
