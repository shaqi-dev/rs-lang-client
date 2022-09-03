import type { RootState } from '../store';

export const loadState = (): object | undefined => {
  const serialState = localStorage.getItem('reduxState');
  if (serialState === null) return undefined;
  return JSON.parse(serialState) as RootState;
};

export const saveState = (state: RootState): void => {
  const serialState = JSON.stringify(state);
  localStorage.setItem('reduxState', serialState);
};

export const clearState = (): void => {
  localStorage.removeItem('reduxState');
};
