import { AggregatedWord } from './userAggregatedWords';
import type { Word } from './words';

export interface TextbookState {
  view: 'main' | 'user';
  group: number;
  page: number;
  word: Word | AggregatedWord | null;
  maxPages: number;
}
