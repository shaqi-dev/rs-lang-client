import type { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import {
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../store/auth/authSlice';
import { API_BASE } from '../services/endpoints';
import type { RootState } from '../store';
import type { SignInResponse } from '../interfaces/signIn';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE,
  prepareHeaders: (headers, { getState }) => {
    const { accessToken } = (getState() as RootState).auth;

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions);

  const invalidToken = result.error && result.error.status === 401;

  if (invalidToken) {
    const { username, userId } = (api.getState() as RootState).auth;
    const { data } = await baseQuery(`users/${userId}/tokens`, api, extraOptions);

    if (data) {
      const { token: accessToken, refreshToken } = data as SignInResponse;

      api.dispatch(setCredentials({ username, userId, accessToken, refreshToken }));

      result = await baseQuery(args, api, extraOptions);
    }
  }
  // else {
  //   api.dispatch(logout());
  // }

  return result;
};

const useAuth = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['UserWords', 'Auth'],
  endpoints: () => ({}),
});

export default useAuth;
