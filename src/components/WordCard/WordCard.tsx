import { FC } from 'react';
import { API_BASE } from '../../services/endpoints';
import { ReactComponent as PlayIcon } from '../../assets/svg/play-sound-icon.svg';
import Button from '../Button';
import useAudio from '../../hooks/useAudio';
import { useAppSelector } from '../../hooks/redux';
import { selectCurrentUserId } from '../../store/auth/authSlice';
import { selectCurrentView } from '../../store/textbook/textbookSlice';
import {
  useCreateUserWordMutation,
  useUpdateUserWordMutation,
  useDeleteUserWordMutation,
  useLazyGetUserWordByIdQuery,
} from '../../services/userWordsApi';
import type { Word } from '../../interfaces/words';
import type { AggregatedWord } from '../../interfaces/userAggregatedWords';
import UserWordDifficulty from '../../shared/userWordDifficulty';
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
  const [getUserWord] = useLazyGetUserWordByIdQuery();
  const [createUserWord] = useCreateUserWordMutation();
  const [updateUserWord] = useUpdateUserWordMutation();
  const [deleteUserWord] = useDeleteUserWordMutation();

  const handleChangeWordDifficulty = async (difficulty: UserWordDifficulty): Promise<void> => {
    if (userId && '_id' in word && word._id) {
      const wordId = word._id;
      const requestData = {
        userId,
        wordId,
        body: {
          difficulty,
          optional: {},
        },
      };

      try {
        await getUserWord({ userId, wordId });
        await updateUserWord(requestData).unwrap();
      } catch {
        await createUserWord(requestData).unwrap();
      }
    }
  };

  const handleAddHardWord = (): Promise<void> =>
    handleChangeWordDifficulty(UserWordDifficulty.hard);
  const handleAddWeakWord = (): Promise<void> =>
    handleChangeWordDifficulty(UserWordDifficulty.weak);

  const handleRemoveWord = (): void => {
    if (userId && '_id' in word && word._id) {
      deleteUserWord({
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
              onClick={view === 'main' ? handleAddHardWord : handleRemoveWord}
              disabled={'userWord' in word && word.userWord.difficulty === UserWordDifficulty.hard}
            >
              {view === 'main' ? 'Добавить в сложные' : 'Удалить из сложных'}
            </Button>
            <Button
              type="button"
              onClick={
                'userWord' in word && word.userWord.difficulty === UserWordDifficulty.weak
                  ? handleRemoveWord
                  : handleAddWeakWord
              }
            >
              {'userWord' in word && word.userWord.difficulty === UserWordDifficulty.weak
                ? 'Удалить из изученных'
                : 'Добавить в изученные'}
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
