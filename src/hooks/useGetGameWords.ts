import { useEffect } from 'react';
import { GetGameWordsResponse, GetGameWordsData } from '../interfaces/useGetGameWords';
import { useLazyGetUserAggregatedWordsQuery } from '../services/userAggregatedWordsApi';
import { useLazyGetWordsQuery } from '../services/wordsApi';
import TextbookView from '../shared/enums/TextbookView';
import UserWordsFilters from '../shared/UserWordsFilters';

const useGetGameWords = ({
  group,
  page,
  userId,
  fromTextbook,
  textbookView,
  wordsPerPage = 20,
}: GetGameWordsData): GetGameWordsResponse => {
  const [fetchGuestWords, guestWordsResponse] = useLazyGetWordsQuery();
  const [fetchMainWords, mainWordsResponse] = useLazyGetUserAggregatedWordsQuery();
  const [fetchHardWords, hardWordsResponse] = useLazyGetUserAggregatedWordsQuery();

  const isGuestView = !userId;
  const isFromNavbar = userId && !fromTextbook;
  const isFromTextbook = userId && fromTextbook;

  useEffect(() => {
    if (isGuestView) {
      fetchGuestWords({ group, page });
    }

    if (isFromNavbar) {
      fetchMainWords({ userId, group, page, wordsPerPage });
    }

    if (isFromTextbook) {
      if (textbookView === TextbookView.USER) {
        fetchHardWords({ userId, group, page, wordsPerPage, filter: UserWordsFilters.HARD });
      } else {
        fetchMainWords({
          userId,
          group,
          page,
          wordsPerPage,
        });
      }
    }
  }, [
    fetchGuestWords,
    fetchMainWords,
    fetchHardWords,
    group,
    page,
    isFromNavbar,
    isFromTextbook,
    isGuestView,
    userId,
    wordsPerPage,
    textbookView,
  ]);

  const getAggregatedWordsResult = (response: typeof mainWordsResponse): GetGameWordsResponse => {
    const data = response?.data?.[0];
    const words = data?.paginatedResults;

    return {
      data: words,
      error: mainWordsResponse.error,
      isLoading: mainWordsResponse.isLoading,
    };
  };

  if (isFromNavbar) {
    return getAggregatedWordsResult(mainWordsResponse);
  }

  if (isFromTextbook) {
    if (group === 6) {
      return getAggregatedWordsResult(hardWordsResponse);
    }

    return getAggregatedWordsResult(mainWordsResponse);
  }

  return {
    data: guestWordsResponse.data,
    error: guestWordsResponse.error,
    isLoading: guestWordsResponse.isLoading,
  };
};

export default useGetGameWords;
