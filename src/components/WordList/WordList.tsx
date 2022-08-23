import { FC } from 'react';
import WordItem from '../WordItem';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setWord, selectCurrentWord } from '../../store/textbook/textbookSlice';
import type { Word } from '../../interfaces/words';
import s from './WordList.module.scss';
import { AggregatedWord } from '../../interfaces/userAggregatedWords';

interface WordListProps {
  words: Word[] | AggregatedWord[];
}

const WordList: FC<WordListProps> = ({ words }) => {
  const dispatch = useAppDispatch();
  const activeWord: Word | AggregatedWord | null = useAppSelector(selectCurrentWord);

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
};

export default WordList;
