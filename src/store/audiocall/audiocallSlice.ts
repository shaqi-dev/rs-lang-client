import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import AudiocallAnswerInfo from '../../interfaces/audiocallAnswerInfo';
import AudiocallState from '../../interfaces/audiocallState';
import { Word } from '../../interfaces/words';

const initialState: AudiocallState = {
  audiocallAnswers: [],
  audiocallShouldContinue: false,
  audiocallDisableAnswers: false,
  audiocallWrongAnswers: [],
  audiocallCorrectAnswers: [],
  audiocallResultPage: '',
};

const audiocallSlice = createSlice({
  name: 'audiocall',
  initialState,
  reducers: {
    setAudiocallAnswers: (state, action: PayloadAction<AudiocallAnswerInfo[]>) => {
      state.audiocallAnswers = action.payload;
    },
    setAudiocallShouldContinue: (state, action: PayloadAction<boolean>) => {
      state.audiocallShouldContinue = action.payload;
    },
    setAudiocallDisableAnswers: (state, action: PayloadAction<boolean>) => {
      state.audiocallDisableAnswers = action.payload;
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
  setAudiocallAnswers,
  setAudiocallShouldContinue,
  setAudiocallDisableAnswers,
  setAudiocallCorrectAnswers,
  setAudiocallWrongAnswers,
  setAudiocallResultPage,
} = audiocallSlice.actions;

export const selectAudiocallAnswers = (state: RootState): AudiocallAnswerInfo[] =>
  state.audiocall.audiocallAnswers;
export const selectAudiocallShouldContinue = (state: RootState): boolean =>
  state.audiocall.audiocallShouldContinue;
export const selectAudiocallDisableAnswers = (state: RootState): boolean =>
  state.audiocall.audiocallDisableAnswers;
export const selectAudiocallWrongAnswers = (state: RootState): Word[] =>
  state.audiocall.audiocallWrongAnswers;
export const selectAudiocallCorrectAnswers = (state: RootState): Word[] =>
  state.audiocall.audiocallCorrectAnswers;
export const selectAudiocallResultPage = (state: RootState): string =>
  state.audiocall.audiocallResultPage;

export default audiocallSlice.reducer;
