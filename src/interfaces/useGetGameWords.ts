import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { AggregatedWord } from './userAggregatedWords';
import { Word } from './words';

export interface GetGameWordsData {
  fromTextbook: boolean;
  group: number;
  page: number;
  userId: string | null;
  wordsPerPage?: number;
  gameType?: string;
}

export interface GetGameWordsResponse {
  data: Word[] | AggregatedWord[] | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  isLoading: boolean;
}
