import { FC } from 'react';
import { Word } from '../../interfaces/words';
import s from './WordCard.module.scss';

export interface WordCardProps {
  word: Word;
}

const WordCard: FC<WordCardProps> = ({ word }) => {
  const {
    word: wordOriginal,
    wordTranslate,
    transcription,
    textMeaning,
    textMeaningTranslate,
  } = word;

  return (
    <div className={s.root}>
      <div className={s.word}>
        <span className={s.word_original}>{wordOriginal} </span>
        <span className={s.word_transcription}>{transcription}</span>
        <p className={s.word_translate}>{wordTranslate}</p>
      </div>
      <div className={s.textMeaning}>
        <p className={s.textBlockTitle}>Значение слова:</p>
        {/* dangerouslySetInnerHTML is used to parse JSX from string, to avoid adding large third party bundle */}
        <p
          className={s.textMeaning_original}
          dangerouslySetInnerHTML={{ __html: `- ${textMeaning}` }}
        />
        <p className={s.textMeaning_translate}>- {textMeaningTranslate}</p>
      </div>
    </div>
  );
};

export default WordCard;
