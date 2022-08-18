import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TextbookState } from '../../interfaces/textbook';
import type { RootState } from '..';
import type { Word } from '../../interfaces/words';

const initialState: TextbookState = {
  group: 0,
  page: 0,
  word: null,
};

const textbookSlice = createSlice({
  name: 'textbook',
  initialState,
  reducers: {
    setGroup: (state, action: PayloadAction<number>) => {
      state.group = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setWord: (state, action: PayloadAction<Word>) => {
      state.word = action.payload;
    },
  },
});

export const { setGroup, setPage, setWord } = textbookSlice.actions;

export const selectCurrentGroup = (state: RootState): number => state.textbook.group;
export const selectCurrentPage = (state: RootState): number => state.textbook.page;
export const selectCurrentWord = (state: RootState): Word | null => state.textbook.word;

export default textbookSlice.reducer;
