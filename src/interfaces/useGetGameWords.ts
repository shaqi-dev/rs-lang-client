import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import TextbookView from '../shared/enums/TextbookView';
import { AggregatedWord } from './userAggregatedWords';
import { Word } from './words';

export interface GetGameWordsData {
  group: number;
  page: number;
  userId?: string | null;
  fromTextbook?: boolean;
  textbookView?: TextbookView;
  wordsPerPage?: number;
}

export interface GetGameWordsResponse {
  data: Word[] | AggregatedWord[] | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  isLoading: boolean;
}
