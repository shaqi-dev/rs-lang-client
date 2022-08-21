export interface GetUserWordByIdData {
  id: string;
  wordId: string;
}

export interface MutateUserWordBody {
  difficulty: string;
  optional: {};
}

export interface MutateUserWordData {
  id: string;
  wordId: string;
  body: MutateUserWordBody;
}
