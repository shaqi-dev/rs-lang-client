import { GameStatsShort } from './statistics';
import { AggregatedWord } from './userAggregatedWords';
import { Word } from './words';

export enum AudiocallResultPage {
  PIE_CHART,
  WORDS,
}
export interface AudiocallState {
  answers: Word[] | AggregatedWord[];
  shouldContinue: boolean;
  disableAnswers: boolean;
  resultPage: AudiocallResultPage;
  wrongAnswers: Word[] | AggregatedWord[];
  correctAnswers: Word[] | AggregatedWord[];
  stats: GameStatsShort;
}
