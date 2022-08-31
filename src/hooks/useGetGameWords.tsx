import { useEffect } from 'react';
import { GetGameWordsData, GetGameWordsResponse } from '../interfaces/useGetGameWords';
import { useLazyGetUserAggregatedWordsQuery } from '../services/userAggregatedWordsApi';
import { useLazyGetWordsQuery } from '../services/wordsApi';
import UserWordsFilters from '../shared/UserWordsFilters';

const useGetGameWords = ({
  fromTextbook,
  group,
  page,
  userId,
  wordsPerPage = 10,
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
      if (group === 6)
        fetchHardWords({ userId, group, page, wordsPerPage, filter: UserWordsFilters.HARD });
      fetchMainWords({ userId, group, page, wordsPerPage });
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
    return getAggregatedWordsResult(hardWordsResponse);
  }

  return {
    data: guestWordsResponse.data,
    error: guestWordsResponse.error,
    isLoading: guestWordsResponse.isLoading,
  };
};

export default useGetGameWords;
