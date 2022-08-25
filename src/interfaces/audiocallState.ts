import { Word } from './words';

interface AudiocallState {
  audiocallGroup: number;
  audiocallPage: number;
  audiocallCurrentWord: number;
  audiocallAnswers: { word: string; wordIndex: number }[];
  audiocallShouldContinue: boolean;
  audiocallDisableAnswers: boolean;
  audiocallWrongAnswers: Word[];
  audiocallCorrectAnswers: Word[];
}

export default AudiocallState;
