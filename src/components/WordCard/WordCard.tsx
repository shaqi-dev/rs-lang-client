import { FC } from 'react';
import { API_BASE } from '../../services/endpoints';
import { ReactComponent as PlayIcon } from '../../assets/svg/play-sound-icon.svg';
import Button from '../Button';
import useAudio from '../../hooks/useAudio';
import { useAppSelector } from '../../hooks/redux';
import { selectCurrentUserId } from '../../store/auth/authSlice';
import { selectCurrentView } from '../../store/textbook/textbookSlice';
import { useCreateUserWordMutation, useDeleteUserWordMutation } from '../../services/userWordsApi';
import type { Word } from '../../interfaces/words';
import type { AggregatedWord } from '../../interfaces/userAggregatedWords';
import s from './WordCard.module.scss';

export interface WordCardProps {
  word: Word | AggregatedWord;
}

const WordCard: FC<WordCardProps> = ({ word }) => {
  const {
    word: wordOriginal,
    wordTranslate,
    transcription,
    textMeaning,
    textMeaningTranslate,
    textExample,
    textExampleTranslate,
    image,
  } = word;

  const view = useAppSelector(selectCurrentView);
  const userId = useAppSelector(selectCurrentUserId);
  const [createWord] = useCreateUserWordMutation();
  const [deleteWord] = useDeleteUserWordMutation();

  const handleAddHardWord = (): void => {
    if (userId && '_id' in word && word._id) {
      createWord({
        userId,
        wordId: word._id,
        body: {
          difficulty: 'hard',
          optional: {},
        },
      });
    }
  };

  const handleRemoveHardWord = (): void => {
    if (userId && '_id' in word && word._id) {
      deleteWord({
        userId,
        wordId: word._id,
      });
    }
  };

  const imageSource = `${API_BASE}/${image}`;

  const [play] = useAudio(word);

  return (
    <div className={s.root}>
      <div className={s.image}>
        <img src={imageSource} alt="word example" />
      </div>
      <div className={s.content}>
        <div className={s.word}>
          <span className={s.word_original}>{wordOriginal} </span>
          <span className={s.word_transcription}>{transcription}</span>
          <PlayIcon className={s.word_playButton} onClick={play} />
          <p className={s.word_translate}>{wordTranslate}</p>
        </div>
        {userId && (
          <div className={s.userActions}>
            <Button
              type="button"
              onClick={view === 'main' ? handleAddHardWord : handleRemoveHardWord}
            >
              {view === 'main' ? 'Добавить в сложные слова' : 'Удалить из сложных слов'}
            </Button>
          </div>
        )}
        <div className={s.textBlock}>
          <p className={s.textBlock_title}>Значение слова:</p>
          {/* dangerouslySetInnerHTML is used to parse JSX from a string, to avoid adding a large third party package */}
          <p
            className={s.textBlock_original}
            dangerouslySetInnerHTML={{ __html: `- ${textMeaning}` }}
          />
          <p className={s.textBlock_translate}>- {textMeaningTranslate}</p>
        </div>
        <div className={s.textBlock}>
          <p className={s.textBlock_title}>Пример использования:</p>
          <p
            className={s.textBlock_original}
            dangerouslySetInnerHTML={{ __html: `- ${textExample}` }}
          />
          <p className={s.textBlock_translate}>- {textExampleTranslate}</p>
        </div>
      </div>
    </div>
  );
};

export default WordCard;
