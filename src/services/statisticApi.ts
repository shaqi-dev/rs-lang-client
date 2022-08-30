import useAuth from '../hooks/useAuth';
import type { UserStatisticsData, UserStatisticsResponse } from '../interfaces/statistics';

export const statisticsApi = useAuth.injectEndpoints({
  endpoints: (builder) => ({
    getStatistics: builder.query<UserStatisticsResponse, string>({
      query: (userId) => `users/${userId}/statistics`,
    }),
    updateStatistics: builder.query<
      UserStatisticsResponse,
      { userId: string; body: UserStatisticsData }
    >({
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
