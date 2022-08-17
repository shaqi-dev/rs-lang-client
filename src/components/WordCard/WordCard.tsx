import { FC } from 'react';
import { Word } from '../../interfaces/words';
import s from './WordCard.module.scss';

export interface WordCardProps {
  word: Word;
}

const WordCard: FC<WordCardProps> = ({ word }) => {
  return (
    <div className={s.root}>
      {word.word} - {word.wordTranslate}
    </div>
  );
};

export default WordCard;
