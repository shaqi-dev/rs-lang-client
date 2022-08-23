import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TextbookState } from '../../interfaces/textbook';
import type { RootState } from '..';
import type { Word } from '../../interfaces/words';
import { AggregatedWord } from '../../interfaces/userAggregatedWords';

const initialState: TextbookState = {
  view: 'main',
  group: 0,
  page: 0,
  word: null,
  maxPages: 30,
};

const textbookSlice = createSlice({
  name: 'textbook',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<'main' | 'user'>) => {
      state.view = action.payload;
    },
    setGroup: (state, action: PayloadAction<number>) => {
      state.group = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setWord: (state, action: PayloadAction<Word | AggregatedWord | null>) => {
      state.word = action.payload;
    },
    setMaxPages: (state, action: PayloadAction<number>) => {
      state.maxPages = action.payload;
    },
  },
});

export const { setView, setGroup, setPage, setWord, setMaxPages } = textbookSlice.actions;

export const selectCurrentView = (state: RootState): 'main' | 'user' => state.textbook.view;
export const selectCurrentGroup = (state: RootState): number => state.textbook.group;
export const selectCurrentPage = (state: RootState): number => state.textbook.page;
export const selectCurrentWord = (state: RootState): Word | AggregatedWord | null =>
  state.textbook.word;
export const selectCurrentMaxPages = (state: RootState): number => state.textbook.maxPages;

export default textbookSlice.reducer;
