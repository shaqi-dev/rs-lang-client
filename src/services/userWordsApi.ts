import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE } from './endpoints';
import type { Word } from '../interfaces/words';
import type {
  GetUserWordByIdData,
  MutateUserWordData,
  MutateUserWordBody,
} from '../interfaces/userWords';

export const userWordsApi = createApi({
  reducerPath: 'userWordsApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE }),
  endpoints: (builder) => ({
    getUserWords: builder.query<Word[], string>({
      query: (id) => `users/${id}/words`,
    }),
    getUserWordById: builder.query<Word, GetUserWordByIdData>({
      query: ({ id, wordId }) => `users/${id}/words/${wordId}`,
    }),
    createUserWord: builder.mutation<MutateUserWordBody, MutateUserWordData>({
      query: ({ id, wordId, body }) => ({
        url: `users/${id}/words/${wordId}`,
        method: 'POST',
        body,
      }),
    }),
    updateUserWord: builder.mutation<MutateUserWordBody, MutateUserWordData>({
      query: ({ id, wordId, body }) => ({
        url: `users/${id}/words/${wordId}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteUserWord: builder.mutation<void, MutateUserWordData>({
      query: ({ id, wordId, body }) => ({
        url: `users/${id}/words/${wordId}`,
        method: 'DELETE',
        body,
      }),
    }),
  }),
});

export const { useGetUserWordsQuery, useGetUserWordByIdQuery } = userWordsApi;
