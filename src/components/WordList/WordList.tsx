import { FC } from 'react';
import WordItem from '../WordItem';
import type { Word } from '../../interfaces/words';
import s from './WordList.module.scss';
import { useAppSelector } from '../../hooks/redux';
import { useGetWordsQuery } from '../../services/wordsApi';
import { selectCurrentGroup, selectCurrentPage } from '../../store/textbook/textbookSlice';
import ErrorBanner from '../ErrorBanner';

interface WordListProps {
  activeWord: Word | null;
  onClickItem: (word: Word) => void;
}

const WordList: FC<WordListProps> = ({ activeWord, onClickItem }) => {
  const group: number = useAppSelector(selectCurrentGroup);
  const page: number = useAppSelector(selectCurrentPage);
  const { data, error, isLoading } = useGetWordsQuery({ group, page });

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    if ('status' in error) {
      const errorMessage = 'error' in error ? error.error : JSON.stringify(error.data);

      return <ErrorBanner>An error has occurred: {errorMessage}</ErrorBanner>;
    }

    return <ErrorBanner>{error.message}</ErrorBanner>;
  }

  if (data) {
    return (
      <ul className={s.root}>
        {data.map((word, i) => {
          const active = (activeWord && activeWord.word === word.word) || (!activeWord && i === 0);

          return (
            <li key={word.word} className={s.listItem}>
              <WordItem word={word} active={active} onClick={onClickItem} />
            </li>
          );
        })}
      </ul>
    );
  }

  return null;
};

export default WordList;
