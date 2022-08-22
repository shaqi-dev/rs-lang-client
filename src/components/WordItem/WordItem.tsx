import { FC } from 'react';
import { AggregatedWord } from '../../interfaces/userAggregatedWords';
import { Word } from '../../interfaces/words';
import s from './WordItem.module.scss';

export interface WordItemProps {
  word: Word | AggregatedWord;
  onClick: (word: Word | AggregatedWord) => void;
  active?: boolean;
  className?: string | string[];
}

const WordItem: FC<WordItemProps> = ({ word, active, className, onClick }) => {
  let classNamesFromProps = '';

  if (className) {
    classNamesFromProps = typeof className === 'string' ? className : className?.join(' ');
  }

  const handleClick = (): void => onClick(word);

  return (
    <button
      type="button"
      className={`${s.root} ${active && s.root_active} ${classNamesFromProps}`}
      onClick={handleClick}
    >
      <span className={s.wordOriginal}>{word.word}</span>
      <span className={s.wordTranslate}>{word.wordTranslate}</span>
    </button>
  );
};

export default WordItem;
