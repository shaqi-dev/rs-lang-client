import useAuth from '../hooks/useAuth';
import type {
  GetUserWordByIdData,
  MutateUserWordData,
  MutateUserWordBody,
  UserWord,
} from '../interfaces/userWords';

export const userWordsApi = useAuth.injectEndpoints({
  endpoints: (builder) => ({
    getUserWords: builder.query<UserWord[], string | null>({
      query: (userId) => `users/${userId}/words`,
      providesTags: ['UserWords'],
    }),
    getUserWordById: builder.query<UserWord, GetUserWordByIdData>({
      query: ({ userId, wordId }) => `users/${userId}/words/${wordId}`,
      providesTags: ['UserWords'],
    }),
    createUserWord: builder.mutation<MutateUserWordBody, MutateUserWordData>({
      query: ({ userId, wordId, body }) => ({
        url: `users/${userId}/words/${wordId}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['UserWords'],
    }),
    updateUserWord: builder.mutation<MutateUserWordBody, MutateUserWordData>({
      query: ({ userId, wordId, body }) => ({
        url: `users/${userId}/words/${wordId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['UserWords'],
    }),
    deleteUserWord: builder.mutation<void, MutateUserWordData>({
      query: ({ userId, wordId, body }) => ({
        url: `users/${userId}/words/${wordId}`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['UserWords'],
    }),
  }),
});

export const {
  useGetUserWordsQuery,
  useGetUserWordByIdQuery,
  useCreateUserWordMutation,
  useUpdateUserWordMutation,
  useDeleteUserWordMutation,
} = userWordsApi;
