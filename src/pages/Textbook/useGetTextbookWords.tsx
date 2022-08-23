import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useAppSelector } from '../../hooks/redux';
import { AggregatedWord } from '../../interfaces/userAggregatedWords';
import { Word } from '../../interfaces/words';
import { useGetUserAggregatedWordsQuery } from '../../services/userAggregatedWordsApi';
import { useGetWordsQuery } from '../../services/wordsApi';
import { selectCurrentUserId } from '../../store/auth/authSlice';
import {
  selectCurrentView,
  selectCurrentGroup,
  selectCurrentPage,
} from '../../store/textbook/textbookSlice';

export interface GetTextbookWordsResponse {
  words: Word[] | AggregatedWord[] | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  isLoading: boolean;
  maxPages: number;
}

const userWordsFilter = { $and: [{ 'userWord.difficulty': 'weak' }] };

export const useGetTextbookWords = (): GetTextbookWordsResponse => {
  const view = useAppSelector<'main' | 'user'>(selectCurrentView);
  const group = useAppSelector<number>(selectCurrentGroup);
  const page = useAppSelector<number>(selectCurrentPage);
  const userId = useAppSelector<string | null>(selectCurrentUserId);
  const wordsPerPage = 20;

  const wordsResponse = useGetWordsQuery({ group, page });
  const userWordsResponse = useGetUserAggregatedWordsQuery({
    userId,
    group,
    page,
    wordsPerPage,
    filter: JSON.stringify(userWordsFilter),
  });

  if (view === 'main') {
    return {
      words: wordsResponse.data,
      error: wordsResponse.error,
      isLoading: wordsResponse.isLoading,
      maxPages: 30,
    };
  }
  const wordsCount = userWordsResponse.data?.[0].totalCount[0]?.count || 0;
  return {
    words: userWordsResponse.data?.[0].paginatedResults,
    error: userWordsResponse.error,
    isLoading: userWordsResponse.isLoading,
    maxPages: Math.ceil(wordsCount / wordsPerPage),
  };
};
