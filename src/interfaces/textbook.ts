import type { Word } from './words';

export interface TextbookState {
  group: number;
  page: number;
  word: Word | null;
}
