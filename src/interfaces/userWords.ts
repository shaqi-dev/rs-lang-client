export interface UserWord {
  id: string;
  difficulty: string;
  optional: {};
  wordId: string;
}

export interface GetUserWordByIdData {
  userId: string;
  wordId: string;
}

export interface MutateUserWordBody {
  difficulty: string;
  optional: {};
}

export interface MutateUserWordData {
  userId: string;
  wordId: string;
  body: MutateUserWordBody;
}
