import { Word } from './words';

interface AudiocallState {
  audiocallAnswers: { word: string; wordIndex: number }[];
  audiocallShouldContinue: boolean;
  audiocallDisableAnswers: boolean;
  audiocallResultPage: string;
  audiocallWrongAnswers: Word[];
  audiocallCorrectAnswers: Word[];
}

export default AudiocallState;
