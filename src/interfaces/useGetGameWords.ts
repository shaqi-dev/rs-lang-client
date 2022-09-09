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

export type GetGameWordsResponse = Word[] | AggregatedWord[] | undefined;
