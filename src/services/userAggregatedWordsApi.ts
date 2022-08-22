import useAuth from '../hooks/useAuth';
import type {
  GetUserAggregatedWordByIdData,
  GetUserAggregatedWordsData,
  GetUserAggregatedWordsResponse,
  UserWord,
} from '../interfaces/userAggregatedWords';

export const userWordsApi = useAuth.injectEndpoints({
  endpoints: (builder) => ({
    getUserAggregatedWords: builder.query<
      GetUserAggregatedWordsResponse,
      GetUserAggregatedWordsData
    >({
      query: ({ userId, group, page, wordsPerPage, filter }) =>
        `users/${userId}/aggregatedWords?group=${group}&page=${page}&=${
          wordsPerPage || '20'
        }&filter=${filter}`,
      providesTags: ['UserWords'],
    }),
    getUserAggregatedWordById: builder.query<UserWord, GetUserAggregatedWordByIdData>({
      query: ({ userId, wordId }) => `users/${userId}/aggregatedWords/${wordId}`,
      providesTags: ['UserWords'],
    }),
  }),
});

export const { useGetUserAggregatedWordsQuery, useGetUserAggregatedWordByIdQuery } = userWordsApi;
