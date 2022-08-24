import { FC, useEffect } from 'react';
import WordItem from '../WordItem';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  setWord,
  selectCurrentWord,
  setMaxPages,
  setPageLearned,
  selectCurrentPageLearned,
} from '../../store/textbook/textbookSlice';
import { AggregatedWord } from '../../interfaces/userAggregatedWords';
import { useGetTextbookWords } from '../../hooks/useGetTextbookWords';
import ErrorBanner from '../ErrorBanner';
import type { Word } from '../../interfaces/words';
import s from './WordList.module.scss';

const WordList: FC = () => {
  const dispatch = useAppDispatch();
  const activeWord: Word | AggregatedWord | null = useAppSelector(selectCurrentWord);
  const pageLearned: boolean = useAppSelector(selectCurrentPageLearned);

  const { words, error, isLoading, maxPages } = useGetTextbookWords();

  useEffect(() => {
    dispatch(setWord((words && words[0]) || null));

    if (words) {
      const isLearnedPage = words.every(
        (word: Word | AggregatedWord) => 'userWord' in word && word.userWord.difficulty === 'weak',
      );

      console.log(isLearnedPage);

      dispatch(setPageLearned(isLearnedPage));
    }
  }, [dispatch, words]);

  console.log(pageLearned);

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
      <ul className={`${s.root}${pageLearned ? ` ${s.root_learned}` : ''}`}>
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
