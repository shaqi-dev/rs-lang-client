import { useEffect, useState } from 'react';
import { GetGameWordsResponse, GetGameWordsData } from '../interfaces/useGetGameWords';
import { AggregatedWord } from '../interfaces/userAggregatedWords';
import { useLazyGetUserAggregatedWordsQuery } from '../services/userAggregatedWordsApi';
import { useLazyGetWordsQuery } from '../services/wordsApi';

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
  const [mainWordsWithoutLearned, setMainWordsWithoutLearned] = useState<AggregatedWord[]>([]);

  const isGuest = !userId;
  const isUserFromNavbar = userId && !fromTextbook;
  const isUserFromTextbook = userId && fromTextbook;

  useEffect(() => {
    if (isGuest) {
      fetchGuestWords({ group, page });
    }

    if (isUserFromNavbar) {
      fetchMainWords({ userId, group, page, wordsPerPage });
    }

    if (isUserFromTextbook) {
      const fetchMainWordsWithoutLearned = async (): Promise<void> => {
        let result: AggregatedWord[] = [];

        return (async function fetchPage(currentPage = page): Promise<void> {
          const currentWords = (
            await fetchMainWords({
              userId,
              group,
              page: currentPage,
              wordsPerPage,
            }).unwrap()
          )[0].paginatedResults;

          if (currentWords.length) {
            const currentWordsWithoutLearned = currentWords.filter(
              (x) => x.userWord?.optional?.learned !== true,
            );

            if (currentWordsWithoutLearned.length) {
              result = [...result, ...currentWordsWithoutLearned];
            }

            console.log('loading page: ', currentPage, 'current result: ', result);

            if (result.length >= 20) {
              setMainWordsWithoutLearned(result.slice(0, 20));
            } else {
              fetchPage(currentPage + 1);
            }
          } else {
            fetchPage(currentPage + 1);
          }
        })();
      };

      fetchMainWordsWithoutLearned();
    }
  }, [
    group,
    page,
    userId,
    wordsPerPage,
    textbookView,
    isGuest,
    isUserFromNavbar,
    isUserFromTextbook,
  ]);

  const getAggregatedWordsResult = (response: typeof mainWordsResponse): GetGameWordsResponse => {
    const data = response?.data?.[0];
    const words = data?.paginatedResults;

    return words;
  };

  if (isUserFromNavbar) {
    return getAggregatedWordsResult(mainWordsResponse);
  }

  if (isUserFromTextbook) {
    return mainWordsWithoutLearned;
  }

  return guestWordsResponse.data;
};

export default useGetGameWords;
