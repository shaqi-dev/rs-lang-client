import useAuth from '../hooks/useAuth';
import type {
  AggregatedWord,
  GetUserAggregatedWordByIdData,
  GetUserAggregatedWordsData,
  GetUserAggregatedWordsResponse,
} from '../interfaces/userAggregatedWords';

export const userWordsApi = useAuth.injectEndpoints({
  endpoints: (builder) => ({
    getUserAggregatedWords: builder.query<
      GetUserAggregatedWordsResponse,
      GetUserAggregatedWordsData
    >({
      query: ({ userId, group, page, wordsPerPage, filter }) => {
        let result = `users/${userId}/aggregatedWords?group=${group}&page=${page}`;

        if (wordsPerPage) {
          result += `&wordsPerPage=${wordsPerPage}`;
        }

        if (filter) {
          result += `&filter=${filter}`;
        }

        return result;
      },
      providesTags: (result) =>
        result
          ? [
              ...result[0].paginatedResults.map((word) => ({
                type: 'UserWords' as const,
                id: word._id,
              })),
              'UserWords',
            ]
          : ['UserWords'],
    }),
    getUserAggregatedWordById: builder.query<AggregatedWord[], GetUserAggregatedWordByIdData>({
      query: ({ userId, wordId }) => `users/${userId}/aggregatedWords/${wordId}`,
      providesTags: (result) =>
        result ? [{ type: 'UserWords', id: result[0]._id }] : ['UserWords'],
    }),
  }),
});

export const { useLazyGetUserAggregatedWordsQuery, useLazyGetUserAggregatedWordByIdQuery } =
  userWordsApi;
