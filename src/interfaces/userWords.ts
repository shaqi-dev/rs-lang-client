import WordDifficulty from '../shared/enums/WordDifficulty';

export interface UserWord {
  id: string;
  difficulty: WordDifficulty;
  optional: {};
  wordId: string;
}

export interface GetUserWordByIdData {
  userId: string;
  wordId: string;
}

export interface MutateUserWordBody {
  difficulty: WordDifficulty;
  optional: {};
}

export interface MutateUserWordData {
  userId: string;
  wordId: string;
  body: MutateUserWordBody;
}
