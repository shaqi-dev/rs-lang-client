import { Word } from './words';
import { UserWordOptional } from './userWords';
import UserWordDifficulty from '../shared/enums/UserWordDifficulty';

export interface GetUserAggregatedWordsData {
  userId: string | null;
  group: number | string;
  page: number | string;
  wordsPerPage?: number | string;
  filter?: string;
}

interface AggregatedUserWord {
  difficulty: UserWordDifficulty;
  optional?: UserWordOptional;
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
  userWord?: AggregatedUserWord;
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
