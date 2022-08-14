import { BaseQueryApi, QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import {
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logOut, setCredentials } from '../store/auth/authSlice';
import { API_BASE } from './endpoints';
import type { RootState } from '../store';
import { SignInResponse } from '../interfaces/signIn';

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

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {},
): Promise<QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>> => {
  let res = await baseQuery(args, api, extraOptions);

  // "refresh token" feature below require testing
  if (res?.error?.status === 'PARSING_ERROR' && res.error.originalStatus === 403) {
    const state = api.getState() as RootState;
    const { username, userId } = state.auth;

    const refreshResult = await baseQuery(`/users/${userId}/tokens`, api, extraOptions);

    if (refreshResult?.data) {
      const { token: accessToken, refreshToken } = refreshResult.data as SignInResponse;

      api.dispatch(setCredentials({ username, userId, accessToken, refreshToken }));

      res = await baseQuery(args, api, extraOptions);
    }
  } else {
    api.dispatch(logOut());
  }

  return res;
};

const useAuth = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

export default useAuth;
