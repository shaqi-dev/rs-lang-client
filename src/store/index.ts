import { configureStore } from '@reduxjs/toolkit';
import counter from './counter/counter.slice';
import useAuth from '../services/useAuth';
import auth from './auth/authSlice';

export const store = configureStore({
  reducer: {
    [useAuth.reducerPath]: useAuth.reducer,
    counter,
    auth,
  },
  middleware: (curryGetDefaultMiddleware) => curryGetDefaultMiddleware().concat(useAuth.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
