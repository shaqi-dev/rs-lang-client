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
  audiocallWrongAnswers: [],
  audiocallCorrectAnswers: [],
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
    setAudiocallWrongAnswers: (state, action: PayloadAction<Word[]>) => {
      state.audiocallWrongAnswers = action.payload;
    },
    setAudiocallCorrectAnswers: (state, action: PayloadAction<Word[]>) => {
      state.audiocallCorrectAnswers = action.payload;
    },
  },
});

export const {
  setAudiocallGroup,
  setAudiocallPage,
  setAudiocallCurrentWord,
  setAudiocallAnswers,
  setAudiocallShouldContinue,
  setAudiocallCorrectAnswers,
  setAudiocallWrongAnswers,
} = audiocallSlice.actions;

export const selectAudiocallGroup = (state: RootState): number => state.audiocall.audiocallGroup;
export const selectAudiocallPage = (state: RootState): number => state.audiocall.audiocallPage;
export const selectAudiocallCurrentWord = (state: RootState): number =>
  state.audiocall.audiocallCurrentWord;
export const selectAudiocallAnswers = (state: RootState): AudiocallAnswerInfo[] =>
  state.audiocall.audiocallAnswers;
export const selectAudiocallShouldContinue = (state: RootState): boolean =>
  state.audiocall.audiocallShouldContinue;
export const selectAudiocallWrongAnswers = (state: RootState): Word[] =>
  state.audiocall.audiocallWrongAnswers;
export const selectAudiocallCorrectAnswers = (state: RootState): Word[] =>
  state.audiocall.audiocallCorrectAnswers;

export default audiocallSlice.reducer;
