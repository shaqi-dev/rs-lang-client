import type { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setCredentials } from '../store/auth/authSlice';
import { API_BASE } from '../services/endpoints';
import type { RootState } from '../store';
import type { SignInResponse } from '../interfaces/signIn';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const { accessToken } = state.auth;

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
      headers.set('Accept', `application/json`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let res = await baseQuery(args, api, extraOptions);

  const isExpiredToken = res.error?.status === 'PARSING_ERROR' && res.error.originalStatus === 403;

  if (isExpiredToken) {
    const state = api.getState() as RootState;
    const { username, userId } = state.auth;

    // Require testing
    const { data } = await baseQuery(`/users/${userId}/tokens`, api, extraOptions);

    if (data) {
      const { token: accessToken, refreshToken } = data as SignInResponse;

      api.dispatch(setCredentials({ username, userId, accessToken, refreshToken }));

      res = await baseQuery(args, api, extraOptions);
    }
  } else {
    api.dispatch(logout());
  }

  return res;
};

const useAuth = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

export default useAuth;
