import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

interface AudiocallState {
  audiocallGroup: number;
  audiocallPage: number;
}

const initialState: AudiocallState = {
  audiocallGroup: 0,
  audiocallPage: 0,
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
  },
});

export const { setAudiocallGroup, setAudiocallPage } = audiocallSlice.actions;

export const selectAudiocallGroup = (state: RootState): number => state.audiocall.audiocallGroup;
export const selectAudiocallPage = (state: RootState): number => state.audiocall.audiocallPage;

export default audiocallSlice.reducer;
