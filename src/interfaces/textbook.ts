import TextbookView from '../shared/enums/TextbookView';
import { AggregatedWord } from './userAggregatedWords';
import type { Word } from './words';

export interface TextbookState {
  view: TextbookView;
  group: number;
  page: number;
  word: Word | AggregatedWord | null;
  maxPages: number;
}
