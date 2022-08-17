import { configureStore } from '@reduxjs/toolkit';
import counter from './counter/counter.slice';
import useAuth from '../services/useAuth';
import auth from './auth/authSlice';
import textbook from './textbook/textbookSlice';
import { loadState, saveState } from '../shared/localStorage';

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    [useAuth.reducerPath]: useAuth.reducer,
    counter,
    auth,
    textbook,
  },
  preloadedState,
  middleware: (curryGetDefaultMiddleware) => curryGetDefaultMiddleware().concat(useAuth.middleware),
  devTools: true,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
