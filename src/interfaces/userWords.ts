import UserWordDifficulty from '../shared/userWordDifficulty';

export interface UserWord {
  id: string;
  difficulty: UserWordDifficulty;
  optional: {};
  wordId: string;
}

export interface GetUserWordByIdData {
  userId: string;
  wordId: string;
}

export interface MutateUserWordBody {
  difficulty: UserWordDifficulty;
  optional: {};
}

export interface MutateUserWordData {
  userId: string;
  wordId: string;
  body: MutateUserWordBody;
}
