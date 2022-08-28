import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import AudiocallAnswerInfo from '../../interfaces/audiocallAnswerInfo';
import AudiocallState from '../../interfaces/audiocallState';
import { Word } from '../../interfaces/words';

const initialState: AudiocallState = {
  audiocallGroup: 0,
  audiocallPage: 0,
  audiocallCurrentWord: 0,
  audiocallAnswers: [],
  audiocallShouldContinue: false,
  audiocallDisableAnswers: false,
  audiocallCorrectChoise: '',
  audiocallWrongChoise: '',
  audiocallWrongAnswers: [],
  audiocallCorrectAnswers: [],
  audiocallResultPage: '',
};

const audiocallSlice = createSlice({
  name: 'audiocall',
  initialState,
  reducers: {
    setAudiocallGroup: (state, action: PayloadAction<number>) => {
      state.audiocallGroup = action.payload;
    },
    setAudiocallPage: (state, action: PayloadAction<number>) => {
      state.audiocallPage = action.payload;
    },
    setAudiocallCurrentWord: (state, action: PayloadAction<number>) => {
      state.audiocallCurrentWord = action.payload;
    },
    setAudiocallAnswers: (state, action: PayloadAction<AudiocallAnswerInfo[]>) => {
      state.audiocallAnswers = action.payload;
    },
    setAudiocallShouldContinue: (state, action: PayloadAction<boolean>) => {
      state.audiocallShouldContinue = action.payload;
    },
    setAudiocallDisableAnswers: (state, action: PayloadAction<boolean>) => {
      state.audiocallDisableAnswers = action.payload;
    },
    setAudiocallCorrectChoise: (state, action: PayloadAction<string>) => {
      state.audiocallCorrectChoise = action.payload;
    },
    setAudiocallWrongChoise: (state, action: PayloadAction<string>) => {
      state.audiocallWrongChoise = action.payload;
    },
    setAudiocallWrongAnswers: (state, action: PayloadAction<Word[]>) => {
      state.audiocallWrongAnswers = action.payload;
    },
    setAudiocallCorrectAnswers: (state, action: PayloadAction<Word[]>) => {
      state.audiocallCorrectAnswers = action.payload;
    },
    setAudiocallResultPage: (state, action: PayloadAction<string>) => {
      state.audiocallResultPage = action.payload;
    },
  },
});

export const {
  setAudiocallGroup,
  setAudiocallPage,
  setAudiocallCurrentWord,
  setAudiocallAnswers,
  setAudiocallShouldContinue,
  setAudiocallDisableAnswers,
  setAudiocallCorrectChoise,
  setAudiocallWrongChoise,
  setAudiocallCorrectAnswers,
  setAudiocallWrongAnswers,
  setAudiocallResultPage,
} = audiocallSlice.actions;

export const selectAudiocallGroup = (state: RootState): number => state.audiocall.audiocallGroup;
export const selectAudiocallPage = (state: RootState): number => state.audiocall.audiocallPage;
export const selectAudiocallCurrentWord = (state: RootState): number =>
  state.audiocall.audiocallCurrentWord;
export const selectAudiocallAnswers = (state: RootState): AudiocallAnswerInfo[] =>
  state.audiocall.audiocallAnswers;
export const selectAudiocallShouldContinue = (state: RootState): boolean =>
  state.audiocall.audiocallShouldContinue;
export const selectAudiocallDisableAnswers = (state: RootState): boolean =>
  state.audiocall.audiocallDisableAnswers;
export const selectAudiocallCorrectChoise = (state: RootState): string =>
  state.audiocall.audiocallCorrectChoise;
export const selectAudiocallWrongChoise = (state: RootState): string =>
  state.audiocall.audiocallWrongChoise;
export const selectAudiocallWrongAnswers = (state: RootState): Word[] =>
  state.audiocall.audiocallWrongAnswers;
export const selectAudiocallCorrectAnswers = (state: RootState): Word[] =>
  state.audiocall.audiocallCorrectAnswers;
export const selectAudiocallResultPage = (state: RootState): string =>
  state.audiocall.audiocallResultPage;

export default audiocallSlice.reducer;
