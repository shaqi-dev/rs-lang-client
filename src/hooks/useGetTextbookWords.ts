import { useEffect } from 'react';
import { AggregatedWord } from '../interfaces/userAggregatedWords';
import { useLazyGetUserAggregatedWordsQuery } from '../services/userAggregatedWordsApi';
import { useLazyGetWordsQuery } from '../services/wordsApi';
import TextbookView from '../shared/enums/TextbookView';
import UserWordsFilters from '../shared/UserWordsFilters';
import type {
  GetTextbookWordsData,
  GetTextbookWordsResponse,
} from '../interfaces/useGetTextbookWords';

const useGetTextbookWords = ({
  view,
  group,
  page,
  userId,
  wordsPerPage = 20,
}: GetTextbookWordsData): GetTextbookWordsResponse => {
  const [fetchGuestWords, guestWordsResponse] = useLazyGetWordsQuery();
  const [fetchMainWords, mainWordsResponse] = useLazyGetUserAggregatedWordsQuery();
  const [fetchUserWords, userWordsResponse] = useLazyGetUserAggregatedWordsQuery();

  const isGuestView = !userId;
  const isMainView = userId && view === TextbookView.MAIN;
  const isUserView = userId && view === TextbookView.USER;

  useEffect(() => {
    if (isMainView) {
      fetchMainWords({
        userId,
        group,
        page,
        wordsPerPage,
      });
    }

    if (isUserView) {
      fetchUserWords({
        userId,
        group,
        page,
        wordsPerPage,
        filter: UserWordsFilters.HARD,
      });
    }

    if (isGuestView) {
      fetchGuestWords({ group, page });
    }
  }, [
    fetchGuestWords,
    fetchMainWords,
    fetchUserWords,
    isGuestView,
    isMainView,
    isUserView,
    group,
    page,
    userId,
    wordsPerPage,
  ]);

  const isLearnedWord = (word: AggregatedWord): boolean => {
    return word.userWord?.optional?.learned ?? false;
  };

  const getAggregatedWordsResult = (
    response: typeof mainWordsResponse,
  ): GetTextbookWordsResponse => {
    const data = response?.data?.[0];
    const words = data?.paginatedResults;
    const wordsCount = data?.totalCount[0]?.count || 0;
    const isLearned = (words && words.length && words.every(isLearnedWord)) || false;
    const maxPages = Math.ceil(wordsCount / wordsPerPage);

    return {
      words,
      error: mainWordsResponse.error,
      isLoading: mainWordsResponse.isLoading,
      maxPages,
      isLearned,
    };
  };

  if (isMainView) {
    return getAggregatedWordsResult(mainWordsResponse);
  }

  if (isUserView) {
    return getAggregatedWordsResult(userWordsResponse);
  }

  return {
    words: guestWordsResponse.data,
    error: guestWordsResponse.error,
    isLoading: guestWordsResponse.isLoading,
    maxPages: 30,
    isLearned: false,
  };
};

export default useGetTextbookWords;
