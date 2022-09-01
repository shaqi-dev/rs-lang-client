import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { AudiocallState, AudiocallResultPage } from '../../interfaces/AudiocallState';
import { AggregatedWord } from '../../interfaces/userAggregatedWords';
import { Word } from '../../interfaces/words';

const initialState: AudiocallState = {
  answers: [],
  shouldContinue: false,
  disableAnswers: false,
  wrongAnswers: [],
  correctAnswers: [],
  resultPage: AudiocallResultPage.PIE_CHART,
};

const audiocallSlice = createSlice({
  name: 'audiocall',
  initialState,
  reducers: {
    setAnswers: (state, action: PayloadAction<Word[] | AggregatedWord[]>) => {
      state.answers = action.payload;
    },
    setShouldContinue: (state, action: PayloadAction<boolean>) => {
      state.shouldContinue = action.payload;
    },
    setDisableAnswers: (state, action: PayloadAction<boolean>) => {
      state.disableAnswers = action.payload;
    },
    setWrongAnswers: (state, action: PayloadAction<Word[] | AggregatedWord[]>) => {
      state.wrongAnswers = action.payload;
    },
    setCorrectAnswers: (state, action: PayloadAction<Word[] | AggregatedWord[]>) => {
      state.correctAnswers = action.payload;
    },
    setResultPage: (state, action: PayloadAction<AudiocallResultPage>) => {
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

export const selectAnswers = (state: RootState): Word[] | AggregatedWord[] =>
  state.audiocall.answers;
export const selectShouldContinue = (state: RootState): boolean => state.audiocall.shouldContinue;
export const selectDisableAnswers = (state: RootState): boolean => state.audiocall.disableAnswers;
export const selectWrongAnswers = (state: RootState): Word[] | AggregatedWord[] =>
  state.audiocall.wrongAnswers;
export const selectCorrectAnswers = (state: RootState): Word[] | AggregatedWord[] =>
  state.audiocall.correctAnswers;
export const selectResultPage = (state: RootState): AudiocallResultPage =>
  state.audiocall.resultPage;

export default audiocallSlice.reducer;
