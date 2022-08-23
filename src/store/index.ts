import { configureStore } from '@reduxjs/toolkit';
import { loadState, saveState } from '../shared/localStorage';
import counter from './counter/counter.slice';
import useAuth from '../hooks/useAuth';
import auth from './auth/authSlice';
import textbook from './textbook/textbookSlice';
import audiocall from './audiocall/audiocallSlice';
import { wordsApi } from '../services/wordsApi';

// parsing state from localStorage
const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    [useAuth.reducerPath]: useAuth.reducer,
    [wordsApi.reducerPath]: wordsApi.reducer,
    counter,
    auth,
    textbook,
    audiocall,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(useAuth.middleware, wordsApi.middleware),
  devTools: true,
});

// saving state to localStorage
store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
