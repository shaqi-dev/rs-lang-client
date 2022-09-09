import WordDifficulty from '../shared/enums/UserWordDifficulty';

export interface GameStatistics {
  correctAnswers: number;
  incorrectAnswers: number;
}

export interface GameStatsWord extends GameStatistics {
  winStreak: number;
}

export interface UserWordOptional {
  learned?: boolean;
  games?: {
    audiocall?: GameStatsWord;
    sprint?: GameStatsWord;
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

export type MutateUserWordResponse = GetUserWordByIdData & MutateUserWordBody;

export interface MutateUserWordData {
  userId: string;
  wordId: string;
  body: MutateUserWordBody;
}
