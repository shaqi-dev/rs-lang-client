import { FC, useEffect } from 'react';
import WordItem from '../WordItem';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setWord, selectCurrentWord, setMaxPages } from '../../store/textbook/textbookSlice';
import { AggregatedWord } from '../../interfaces/userAggregatedWords';
import { useGetTextbookWords } from '../../hooks/useGetTextbookWords';
import ErrorBanner from '../ErrorBanner';
import type { Word } from '../../interfaces/words';
import s from './WordList.module.scss';

const WordList: FC = () => {
  const dispatch = useAppDispatch();
  const activeWord: Word | AggregatedWord | null = useAppSelector(selectCurrentWord);

  const { words, error, isLoading, maxPages } = useGetTextbookWords();

  useEffect(() => {
    dispatch(setWord((words && words[0]) || null));
  }, [dispatch, words]);

  useEffect(() => {
    dispatch(setMaxPages(maxPages));
  }, [dispatch, maxPages]);

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    if ('status' in error) {
      const errorMessage = 'error' in error ? error.error : JSON.stringify(error.data);
      return <ErrorBanner>An error has occurred: {errorMessage}</ErrorBanner>;
    }
    return <ErrorBanner>{error.message}</ErrorBanner>;
  }

  if (words && !words.length) return <p>В этом разделе еще нет слов</p>;

  if (words && !!words.length) {
    const handleClickWordItem = (word: Word | AggregatedWord): void => {
      dispatch(setWord(word));
    };

    return (
      <ul className={s.root}>
        {words.map((word) => {
          const active = !!activeWord && activeWord.word === word.word;

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
