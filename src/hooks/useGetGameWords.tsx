import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useEffect } from 'react';
import { Word } from '../interfaces/words';
import { useLazyGetWordsQuery } from '../services/wordsApi';

const useGetGameWords = (
  group: number,
  page: number,
): {
  data: Word[] | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
  isLoading: boolean;
} => {
  const [fetchGuestWords, guestWordsResponse] = useLazyGetWordsQuery();

  useEffect(() => {
    fetchGuestWords({ group, page });
  }, [fetchGuestWords, group, page]);

  return {
    data: guestWordsResponse.data,
    error: guestWordsResponse.error,
    isLoading: guestWordsResponse.isLoading,
  };
};

export default useGetGameWords;
