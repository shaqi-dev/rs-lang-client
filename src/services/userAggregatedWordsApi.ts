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
      providesTags: [
        { type: 'UserWords', id: 'CREATE_HARD_WORD' },
        { type: 'UserWords', id: 'DELETE_HARD_WORD' },
      ],
    }),
    getUserAggregatedWordById: builder.query<AggregatedWord, GetUserAggregatedWordByIdData>({
      query: ({ userId, wordId }) => `users/${userId}/aggregatedWords/${wordId}`,
      // providesTags: ['UserWords'],
    }),
  }),
});

export const { useLazyGetUserAggregatedWordsQuery, useLazyGetUserAggregatedWordByIdQuery } =
  userWordsApi;
