import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE } from './endpoints';
import type { GetWordsData, Word } from '../interfaces/words';

export const wordsApi = createApi({
  reducerPath: 'wordsApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE }),
  endpoints: (builder) => ({
    getWords: builder.query<Word[], GetWordsData>({
      query: ({ group, page }) => `words?group=${group}&page=${page}`,
    }),
    getWordById: builder.query<Word, string>({
      query: (id) => `words/${id}`,
    }),
  }),
});

export const { useGetWordsQuery, useGetWordByIdQuery } = wordsApi;
