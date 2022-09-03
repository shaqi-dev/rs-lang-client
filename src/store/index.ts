import { AnyAction, combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import { loadState, saveState } from '../shared/localStorage';
import counter from './counter/counter.slice';
import useAuth from '../hooks/useAuth';
import auth from './auth/authSlice';
import textbook from './textbook/textbookSlice';
import audiocall from './audiocall/audiocallSlice';
import sprint from './sprint/sprintSlice';
import { wordsApi } from '../services/wordsApi';

// parsing state from localStorage
const preloadedState = loadState();

const combinedReducer = combineReducers({
  [useAuth.reducerPath]: useAuth.reducer,
  [wordsApi.reducerPath]: wordsApi.reducer,
  counter,
  auth,
  textbook,
  audiocall,
  sprint,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === 'auth/logout') {
    state = {} as RootState;
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(useAuth.middleware, wordsApi.middleware),
  devTools: true,
});

// saving state to localStorage
store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof combinedReducer>;

export type AppDispatch = typeof store.dispatch;
