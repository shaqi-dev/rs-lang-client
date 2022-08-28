import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { Word } from '../../interfaces/words';

interface AudiocallState {
  audiocallGroup: number;
  audiocallPage: number;
  audiocallWrongAnswers: Word[];
  audiocallCorrectAnswers: Word[];
}

const initialState: AudiocallState = {
  audiocallGroup: 0,
  audiocallPage: 0,
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
  setAudiocallCorrectAnswers,
  setAudiocallWrongAnswers,
} = audiocallSlice.actions;

export const selectAudiocallGroup = (state: RootState): number => state.audiocall.audiocallGroup;
export const selectAudiocallPage = (state: RootState): number => state.audiocall.audiocallPage;
export const selectAudiocallWrongAnswers = (state: RootState): Word[] =>
  state.audiocall.audiocallWrongAnswers;
export const selectAudiocallCorrectAnswers = (state: RootState): Word[] =>
  state.audiocall.audiocallCorrectAnswers;

export default audiocallSlice.reducer;
