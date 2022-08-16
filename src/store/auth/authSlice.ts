import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

export interface AuthState {
  username: string | null;
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  username: null,
  userId: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      const { username, userId, accessToken, refreshToken } = action.payload;

      state.username = username;
      state.userId = userId;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    logOut: (state) => {
      const { username, userId, accessToken, refreshToken } = initialState;

      state.username = username;
      state.userId = userId;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export const selectCurrentUsername = (state: RootState): string | null => state.auth.username;
export const selectCurrentUserId = (state: RootState): string | null => state.auth.userId;
export const selectCurrentAccessToken = (state: RootState): string | null => state.auth.accessToken;
export const selectCurrentRefreshToken = (state: RootState): string | null =>
  state.auth.refreshToken;

export default authSlice.reducer;
