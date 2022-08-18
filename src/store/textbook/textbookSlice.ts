import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TextbookState } from '../../interfaces/textbook';
import type { RootState } from '..';

const initialState: TextbookState = {
  group: 0,
  page: 0,
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
  },
});

export const { setGroup, setPage } = textbookSlice.actions;

export const selectCurrentGroup = (state: RootState): number => state.textbook.group;
export const selectCurrentPage = (state: RootState): number => state.textbook.page;

export default textbookSlice.reducer;