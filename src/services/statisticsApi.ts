import useAuth from '../hooks/useAuth';
import type { UserStatisticsData, UserStatisticsResponse } from '../interfaces/statistics';

export const statisticsApi = useAuth.injectEndpoints({
  endpoints: (builder) => ({
    getStatistics: builder.query<UserStatisticsResponse, string>({
      query: (userId) => `users/${userId}/statistics`,
      providesTags: [{ type: 'UserStatistics', id: 'UPDATE_USER_STATISTICS' }],
    }),
    updateStatistics: builder.mutation<
      UserStatisticsResponse,
      { userId: string; body: UserStatisticsData }
    >({
      query: ({ userId, body }) => ({
        url: `users/${userId}/statistics`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'UserStatistics', id: 'UPDATE_USER_STATISTICS' }],
    }),
  }),
});

export const { useGetStatisticsQuery, useLazyGetStatisticsQuery, useUpdateStatisticsMutation } =
  statisticsApi;
