import { FC } from 'react';
import { Word } from '../../interfaces/words';
import s from './WordButton.module.scss';

export interface WordButtonProps {
  word: Word;
  onClick: (word: Word) => void;
  active?: boolean;
  className?: string | string[];
}

const WordButton: FC<WordButtonProps> = ({ word, active, className, onClick }) => {
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

export default WordButton;
