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
    }),
    getUserWordById: builder.query<UserWord, GetUserWordByIdData>({
      query: ({ userId, wordId }) => `users/${userId}/words/${wordId}`,
    }),
    createUserWord: builder.mutation<MutateUserWordBody, MutateUserWordData>({
      query: ({ userId, wordId, body }) => ({
        url: `users/${userId}/words/${wordId}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'UserWords', id: 'CREATE_WORD' }],
    }),
    updateUserWord: builder.mutation<MutateUserWordBody, MutateUserWordData>({
      query: ({ userId, wordId, body }) => ({
        url: `users/${userId}/words/${wordId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'UserWords', id: 'UPDATE_WORD' }],
    }),
    deleteUserWord: builder.mutation<void, GetUserWordByIdData>({
      query: ({ userId, wordId }) => ({
        url: `users/${userId}/words/${wordId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'UserWords', id: 'DELETE_WORD' }],
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
