import { useEffect } from 'react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useAppSelector } from './redux';
import { AggregatedWord } from '../interfaces/userAggregatedWords';
import { Word } from '../interfaces/words';
import { useLazyGetUserAggregatedWordsQuery } from '../services/userAggregatedWordsApi';
import { useLazyGetWordsQuery } from '../services/wordsApi';
import { selectCurrentUserId } from '../store/auth/authSlice';
import {
  selectCurrentView,
  selectCurrentGroup,
  selectCurrentPage,
} from '../store/textbook/textbookSlice';

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

  const [fetchGuestWords, guestWordsResponse] = useLazyGetWordsQuery();
  const [fetchMainWords, mainWordsResponse] = useLazyGetUserAggregatedWordsQuery();
  const [fetchUserWords, userWordsResponse] = useLazyGetUserAggregatedWordsQuery();

  useEffect(() => {
    if (userId && view === 'main') {
      fetchMainWords({
        userId,
        group,
        page,
        wordsPerPage,
      });
    }

    if (userId && view === 'user') {
      fetchUserWords({
        userId,
        group,
        page,
        wordsPerPage,
        filter: JSON.stringify(userWordsFilter),
      });
    }

    if (!userId) {
      fetchGuestWords({ group, page });
    }
  }, [fetchGuestWords, fetchMainWords, fetchUserWords, group, page, userId, view]);

  if (userId && view === 'main') {
    const wordsCount = mainWordsResponse.data?.[0].totalCount[0]?.count || 0;
    return {
      words: mainWordsResponse.data?.[0].paginatedResults,
      error: mainWordsResponse.error,
      isLoading: mainWordsResponse.isLoading,
      maxPages: Math.ceil(wordsCount / wordsPerPage),
    };
  }

  if (userId && view === 'user') {
    const wordsCount = userWordsResponse.data?.[0].totalCount[0]?.count || 0;
    return {
      words: userWordsResponse.data?.[0].paginatedResults,
      error: userWordsResponse.error,
      isLoading: userWordsResponse.isLoading,
      maxPages: Math.ceil(wordsCount / wordsPerPage),
    };
  }

  return {
    words: guestWordsResponse.data,
    error: guestWordsResponse.error,
    isLoading: guestWordsResponse.isLoading,
    maxPages: 30,
  };
};
