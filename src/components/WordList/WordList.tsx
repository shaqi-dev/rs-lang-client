import { FC } from 'react';
import WordItem from '../WordItem';
import type { Word } from '../../interfaces/words';
import s from './WordList.module.scss';

interface WordListProps {
  words: Word[];
  activeWord: Word | null;
  onClickItem: (word: Word) => void;
}

const WordList: FC<WordListProps> = ({ words, activeWord, onClickItem }) => {
  const items = words.map((word, i) => {
    const active = (activeWord && activeWord.word === word.word) || (!activeWord && i === 0);

    return (
      <li key={word.word} className={s.listItem}>
        <WordItem word={word} active={active} onClick={onClickItem} />
      </li>
    );
  });

  return <ul className={s.root}>{items}</ul>;
};

export default WordList;
