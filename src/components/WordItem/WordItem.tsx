import { FC } from 'react';
import { AggregatedWord } from '../../interfaces/userAggregatedWords';
import { Word } from '../../interfaces/words';
import UserWordDifficulty from '../../shared/enums/UserWordDifficulty';
import s from './WordItem.module.scss';

export interface WordItemProps {
  word: Word | AggregatedWord;
  onClick: (word: Word | AggregatedWord) => void;
  active?: boolean;
  className?: string;
}

const WordItem: FC<WordItemProps> = ({ word, active, className, onClick }) => {
  const isHardWord =
    ('userWord' in word && word.userWord?.difficulty === UserWordDifficulty.HARD) || false;
  const isLearnedWord = ('userWord' in word && word.userWord?.optional?.learned) || false;

  const handleClick = (): void => onClick(word);

  const style =
    s.root +
    ((active && ` ${s.root_active}`) || '') +
    ((className && ` ${className}`) || '') +
    ((isHardWord && ` ${s.root_hard}`) || '') +
    ((isLearnedWord && ` ${s.root_weak}`) || '');

  return (
    <button type="button" className={style} onClick={handleClick}>
      <span className={s.wordOriginal}>{word.word}</span>
      <span className={s.wordTranslate}>{word.wordTranslate}</span>
    </button>
  );
};

export default WordItem;
