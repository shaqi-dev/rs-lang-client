import { FC, useEffect } from 'react';
import WordItem from '../WordItem';
import type { Word } from '../../interfaces/words';
import s from './WordList.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useGetWordsQuery } from '../../services/wordsApi';
import {
  setWord,
  selectCurrentGroup,
  selectCurrentPage,
  selectCurrentWord,
} from '../../store/textbook/textbookSlice';
import ErrorBanner from '../ErrorBanner';

const WordList: FC = () => {
  const dispatch = useAppDispatch();
  const group: number = useAppSelector(selectCurrentGroup);
  const page: number = useAppSelector(selectCurrentPage);
  const activeWord: Word | null = useAppSelector(selectCurrentWord);

  const { data, error, isLoading } = useGetWordsQuery({ group, page });

  useEffect(() => {
    if (data) {
      dispatch(setWord(data[0]));
    }
  }, [data, dispatch]);

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    if ('status' in error) {
      const errorMessage = 'error' in error ? error.error : JSON.stringify(error.data);

      return <ErrorBanner>An error has occurred: {errorMessage}</ErrorBanner>;
    }

    return <ErrorBanner>{error.message}</ErrorBanner>;
  }

  if (data) {
    const handleClickWordItem = (word: Word): void => {
      dispatch(setWord(word));
    };

    return (
      <ul className={s.root}>
        {data.map((word, i) => {
          const active = (activeWord && activeWord.word === word.word) || (!activeWord && i === 0);

          return (
            <li key={word.word} className={s.listItem}>
              <WordItem word={word} active={active} onClick={handleClickWordItem} />
            </li>
          );
        })}
      </ul>
    );
  }

  return null;
};

export default WordList;
