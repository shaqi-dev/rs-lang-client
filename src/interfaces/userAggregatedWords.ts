import { Word } from './words';
import WordDifficulty from '../shared/enums/WordDifficulty';

export interface GetUserAggregatedWordsData {
  userId: string | null;
  group: number | string;
  page: number | string;
  wordsPerPage?: number | string;
  filter?: string;
}

export interface UserWord {
  difficulty: WordDifficulty;
  optional: {};
}

export interface AggregatedWord extends Word {
  audio: string;
  audioExample: string;
  audioMeaning: string;
  group: number;
  image: string;
  page: number;
  textExample: string;
  textExampleTranslate: string;
  textMeaning: string;
  textMeaningTranslate: string;
  transcription: string;
  userWord?: UserWord;
  word: string;
  wordTranslate: string;
  _id: string;
}

export type GetUserAggregatedWordsResponse = [
  {
    paginatedResults: AggregatedWord[];
    totalCount: [
      {
        count: number;
      }?,
    ];
  },
];

export interface GetUserAggregatedWordByIdData {
  userId: string;
  wordId: string;
}
