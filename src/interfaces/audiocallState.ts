import { Word } from './words';

interface AudiocallState {
  audiocallGroup: number;
  audiocallPage: number;
  audiocallCurrentWord: number;
  audiocallAnswers: { word: string; wordIndex: number }[];
  audiocallShouldContinue: boolean;
  audiocallDisableAnswers: boolean;
  audiocallCorrectChoise: string;
  audiocallWrongChoise: string;
  audiocallResultPage: string;
  audiocallWrongAnswers: Word[];
  audiocallCorrectAnswers: Word[];
}

export default AudiocallState;
