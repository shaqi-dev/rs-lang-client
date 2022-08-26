import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import TextbookView from '../shared/enums/TextbookView';
import { AggregatedWord } from './userAggregatedWords';
import { Word } from './words';

export interface GetTextbookWordsData {
  view: TextbookView;
  group: number;
  page: number;
  userId: string | null;
  wordsPerPage?: number;
}

export interface GetTextbookWordsResponse {
  words: Word[] | AggregatedWord[] | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  isLoading: boolean;
  maxPages: number;
  isLearned: boolean;
}
