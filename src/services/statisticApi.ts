import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE } from './endpoints';
import type { UserStatistics } from '../interfaces/statistics';

export const statisticsApi = createApi({
  reducerPath: 'statisticsApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE }),
  endpoints: (builder) => ({
    getStatistics: builder.query<UserStatistics, string>({
      query: (userId) => `users/${userId}/statistics`,
    }),
    updateStatistics: builder.query<UserStatistics, { userId: string; body: UserStatistics }>({
      query: ({ userId, body }) => ({
        url: `users/${userId}/statistics`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const {
  useGetStatisticsQuery,
  useLazyGetStatisticsQuery,
  useUpdateStatisticsQuery,
  useLazyUpdateStatisticsQuery,
} = statisticsApi;
