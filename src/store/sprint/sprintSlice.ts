import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { Word } from '../../interfaces/words';

interface SprintState {
  sprintGroup: number;
  sprintPage: number;
  sprintWrongAnswers: Word[];
  sprintCorrectAnswers: Word[];
}

const initialState: SprintState = {
  sprintGroup: 0,
  sprintPage: 0,
  sprintWrongAnswers: [],
  sprintCorrectAnswers: [],
};

const sprintSlice = createSlice({
  name: 'sprint',
  initialState,
  reducers: {
    setSprintGroup: (state, action: PayloadAction<number>) => {
      state.sprintGroup = action.payload;
    },
    setSprintPage: (state, action: PayloadAction<number>) => {
      state.sprintPage = action.payload;
    },
    setSprintWrongAnswers: (state, action: PayloadAction<Word[]>) => {
      state.sprintWrongAnswers = action.payload;
    },
    setSprintCorrectAnswers: (state, action: PayloadAction<Word[]>) => {
      state.sprintCorrectAnswers = action.payload;
    },
  },
});

export const { setSprintGroup, setSprintPage, setSprintCorrectAnswers, setSprintWrongAnswers } =
  sprintSlice.actions;

export const selectSprintGroup = (state: RootState): number => state.sprint.sprintGroup;
export const selectSprintPage = (state: RootState): number => state.sprint.sprintPage;
export const selectSprintWrongAnswers = (state: RootState): Word[] =>
  state.sprint.sprintWrongAnswers;
export const selectSprintCorrectAnswers = (state: RootState): Word[] =>
  state.sprint.sprintCorrectAnswers;

export default sprintSlice.reducer;
