import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { SprintResultPage, SprintState } from '../../interfaces/SprintState';
import { GameStatsShort } from '../../interfaces/statistics';
// import { GameStatsShort } from '../../interfaces/statistics';
// import { AggregatedWord } from '../../interfaces/userAggregatedWords';
import { Word } from '../../interfaces/words';
import getCurrentDate from '../../shared/getCurrentDate';

const initialState: SprintState = {
  sprintGroup: 0,
  sprintPage: 0,
  sprintWrongAnswers: [],
  sprintCorrectAnswers: [],
  resultPage: SprintResultPage.PIE_CHART,
  stats: {
    date: getCurrentDate(),
    newWords: 0,
    learnedWords: 0,
    longestWinStreak: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
  },
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
    setResultPage: (state, action: PayloadAction<SprintResultPage>) => {
      state.resultPage = action.payload;
    },
    setStats: (state, action: PayloadAction<GameStatsShort>) => {
      state.stats = action.payload;
    },
    clearStats: (state) => {
      state.stats = initialState.stats;
    },
  },
});

export const {
  setSprintGroup,
  setSprintPage,
  setSprintCorrectAnswers,
  setSprintWrongAnswers,
  setResultPage,
  setStats,
  clearStats,
} = sprintSlice.actions;

export const selectSprintGroup = (state: RootState): number => state.sprint.sprintGroup;
export const selectSprintPage = (state: RootState): number => state.sprint.sprintPage;
export const selectSprintWrongAnswers = (state: RootState): Word[] =>
  state.sprint.sprintWrongAnswers;
export const selectSprintCorrectAnswers = (state: RootState): Word[] =>
  state.sprint.sprintCorrectAnswers;
export const selectResultPage = (state: RootState): SprintResultPage => state.sprint.resultPage;
export const selectStats = (state: RootState): GameStatsShort => state.sprint.stats;

export default sprintSlice.reducer;
