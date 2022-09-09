import { GameStatsShort } from './statistics';
import { AggregatedWord } from './userAggregatedWords';
import { Word } from './words';

export enum SprintResultPage {
  PIE_CHART,
  WORDS,
}
export interface SprintState {
  sprintGroup: number;
  sprintPage: number;
  sprintWrongAnswers: Word[] | AggregatedWord[];
  sprintCorrectAnswers: Word[] | AggregatedWord[];
  resultPage: SprintResultPage;
  stats: GameStatsShort;
}
