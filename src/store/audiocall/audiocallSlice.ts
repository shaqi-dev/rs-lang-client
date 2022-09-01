import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import AudiocallState from '../../interfaces/AudiocallState';
import { Word } from '../../interfaces/words';

export interface AudiocallAnswerInfo {
  word: string;
  wordIndex: number;
}

const initialState: AudiocallState = {
  answers: [],
  shouldContinue: false,
  disableAnswers: false,
  wrongAnswers: [],
  correctAnswers: [],
  resultPage: '',
};

const audiocallSlice = createSlice({
  name: 'audiocall',
  initialState,
  reducers: {
    setAnswers: (state, action: PayloadAction<AudiocallAnswerInfo[]>) => {
      state.answers = action.payload;
    },
    setShouldContinue: (state, action: PayloadAction<boolean>) => {
      state.shouldContinue = action.payload;
    },
    setDisableAnswers: (state, action: PayloadAction<boolean>) => {
      state.disableAnswers = action.payload;
    },
    setWrongAnswers: (state, action: PayloadAction<Word[]>) => {
      state.wrongAnswers = action.payload;
    },
    setCorrectAnswers: (state, action: PayloadAction<Word[]>) => {
      state.correctAnswers = action.payload;
    },
    setResultPage: (state, action: PayloadAction<string>) => {
      state.resultPage = action.payload;
    },
  },
});

export const {
  setAnswers,
  setShouldContinue,
  setDisableAnswers,
  setCorrectAnswers,
  setWrongAnswers,
  setResultPage,
} = audiocallSlice.actions;

export const selectAnswers = (state: RootState): AudiocallAnswerInfo[] => state.audiocall.answers;
export const selectShouldContinue = (state: RootState): boolean => state.audiocall.shouldContinue;
export const selectDisableAnswers = (state: RootState): boolean => state.audiocall.disableAnswers;
export const selectWrongAnswers = (state: RootState): Word[] => state.audiocall.wrongAnswers;
export const selectCorrectAnswers = (state: RootState): Word[] => state.audiocall.correctAnswers;
export const selectResultPage = (state: RootState): string => state.audiocall.resultPage;

export default audiocallSlice.reducer;
