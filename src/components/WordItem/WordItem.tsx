import { FC } from 'react';
import { AggregatedWord } from '../../interfaces/userAggregatedWords';
import { Word } from '../../interfaces/words';
import UserWordDifficulty from '../../shared/enums/WordDifficulty';
import s from './WordItem.module.scss';

export interface WordItemProps {
  word: Word | AggregatedWord;
  onClick: (word: Word | AggregatedWord) => void;
  active?: boolean;
  className?: string;
}

const WordItem: FC<WordItemProps> = ({ word, active, className, onClick }) => {
  const isHardWord = 'userWord' in word && word.userWord?.difficulty === UserWordDifficulty.HARD;
  const isLearnedWord = 'userWord' in word && word.userWord?.difficulty === UserWordDifficulty.WEAK;

  if ('userWord' in word) {
    if (word.userWord.difficulty === UserWordDifficulty.hard) {
      difficultyClass = s.root_hard;
    }

    if (word.userWord.difficulty === UserWordDifficulty.weak) {
      difficultyClass = s.root_weak;
    }
  }

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
