import useAuth from '../hooks/useAuth';
import type {
  GetUserWordByIdData,
  MutateUserWordData,
  MutateUserWordResponse,
  UserWord,
} from '../interfaces/userWords';

export const userWordsApi = useAuth.injectEndpoints({
  endpoints: (builder) => ({
    getUserWords: builder.query<UserWord[], string | null>({
      query: (userId) => `users/${userId}/words`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((word) => ({ type: 'UserWords' as const, id: word.wordId })),
              'UserWords',
            ]
          : ['UserWords'],
    }),
    getUserWordById: builder.query<UserWord, GetUserWordByIdData>({
      query: ({ userId, wordId }) => `users/${userId}/words/${wordId}`,
      providesTags: (result) =>
        result ? [{ type: 'UserWords', id: result.wordId }] : ['UserWords'],
    }),
    createUserWord: builder.mutation<MutateUserWordResponse, MutateUserWordData>({
      query: ({ userId, wordId, body }) => ({
        url: `users/${userId}/words/${wordId}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'UserWords', id: result.wordId }] : ['UserWords'],
    }),
    updateUserWord: builder.mutation<MutateUserWordResponse, MutateUserWordData>({
      query: ({ userId, wordId, body }) => ({
        url: `users/${userId}/words/${wordId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'UserWords', id: result.wordId }] : ['UserWords'],
    }),
    deleteUserWord: builder.mutation<MutateUserWordResponse, GetUserWordByIdData>({
      query: ({ userId, wordId }) => ({
        url: `users/${userId}/words/${wordId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'UserWords', id: result.wordId }] : ['UserWords'],
    }),
  }),
});

export const {
  useGetUserWordsQuery,
  useLazyGetUserWordByIdQuery,
  useCreateUserWordMutation,
  useUpdateUserWordMutation,
  useDeleteUserWordMutation,
} = userWordsApi;
