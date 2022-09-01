import { Word } from './words';

interface AudiocallState {
  answers: { word: string; wordIndex: number }[];
  shouldContinue: boolean;
  disableAnswers: boolean;
  resultPage: string;
  wrongAnswers: Word[];
  correctAnswers: Word[];
}

export default AudiocallState;
