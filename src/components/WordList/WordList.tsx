import { FC, useEffect } from 'react';
import WordItem from '../WordItem';
import { useAppDispatch } from '../../hooks/redux';
import { setWord, setMaxPages } from '../../store/textbook/textbookSlice';
import { AggregatedWord } from '../../interfaces/userAggregatedWords';
import ErrorBanner from '../ErrorBanner';
import type { Word } from '../../interfaces/words';
import type { GetTextbookWordsResponse } from '../../interfaces/useGetTextbookWords';
import s from './WordList.module.scss';

interface WordListProps {
  wordsResponse: GetTextbookWordsResponse;
  activeWord: Word | AggregatedWord | null;
}

const WordList: FC<WordListProps> = ({ wordsResponse, activeWord }) => {
  const dispatch = useAppDispatch();
  const { words, error, isLearned, maxPages } = wordsResponse;

  useEffect(() => {
    dispatch(setMaxPages(maxPages));
  }, [dispatch, maxPages]);

  if (error) {
    if ('status' in error) {
      const errorMessage = 'error' in error ? error.error : JSON.stringify(error.data);
      return <ErrorBanner>An error has occurred: {errorMessage}</ErrorBanner>;
    }
    return <ErrorBanner>{error.message}</ErrorBanner>;
  }

  if (words && !words.length) return <p>В этом разделе еще нет слов</p>;

  if (words && !!words.length) {
    const handleClickItem = (word: Word | AggregatedWord): void => {
      dispatch(setWord(word));
    };

    return (
      <ul className={`${s.root}${isLearned ? ` ${s.root_learned}` : ''}`}>
        {words.map((word) => {
          const active = !!activeWord && activeWord.word === word.word;

          return (
            <li key={word.word} className={s.listItem}>
              <WordItem word={word} active={active} onClick={handleClickItem} />
            </li>
          );
        })}
      </ul>
    );
  }

  return null;
};

export default WordList;
