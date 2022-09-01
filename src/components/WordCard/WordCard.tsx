import { FC } from 'react';
import { API_BASE } from '../../services/endpoints';
import { ReactComponent as PlayIcon } from '../../assets/svg/play-sound-icon.svg';
import Button from '../Button';
import useAudio from '../../hooks/useAudio';
import { useAppDispatch } from '../../hooks/redux';
import { setWord } from '../../store/textbook/textbookSlice';
import {
  useCreateUserWordMutation,
  useUpdateUserWordMutation,
  useLazyGetUserWordByIdQuery,
} from '../../services/userWordsApi';
import type { Word } from '../../interfaces/words';
import type { AggregatedWord } from '../../interfaces/userAggregatedWords';
import s from './WordCard.module.scss';
import TextbookView from '../../shared/enums/TextbookView';
import { useLazyGetUserAggregatedWordByIdQuery } from '../../services/userAggregatedWordsApi';
import UserWordDifficulty from '../../shared/enums/UserWordDifficulty';

export interface WordCardProps {
  word: Word | AggregatedWord;
  view: TextbookView;
  userId: string | null;
}

const WordCard: FC<WordCardProps> = ({ word, view, userId }) => {
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

  const imageSource = `${API_BASE}/${image}`;

  const [play] = useAudio(word);

  const dispatch = useAppDispatch();
  const [createUserWord] = useCreateUserWordMutation();
  const [updateUserWord] = useUpdateUserWordMutation();
  const [getUserWordById] = useLazyGetUserWordByIdQuery();
  const [getUserAggregatedWord] = useLazyGetUserAggregatedWordByIdQuery();

  const isHardWord =
    ('userWord' in word && word.userWord?.difficulty === UserWordDifficulty.HARD) || false;
  const isLearnedWord = ('userWord' in word && word.userWord?.optional?.learned) || false;
  const isMainView = view === TextbookView.MAIN;
  const isUserView = view === TextbookView.USER;

  const updateCurrentWord = async ({ wordId }: { wordId: string }): Promise<void> => {
    if (userId && isMainView) {
      const { data: userWordAfter } = await getUserAggregatedWord({ userId, wordId });

      if (userWordAfter?.[0]) {
        dispatch(setWord(userWordAfter[0]));
      }
    }
  };

  type HandleUpdateWordProps =
    | { type: 'difficulty'; payload: UserWordDifficulty }
    | { type: 'learned'; payload: boolean };

  const handleUpdateWord = async ({ type, payload }: HandleUpdateWordProps): Promise<void> => {
    if (userId && '_id' in word && word._id) {
      const wordId = word._id;

      const { data, isSuccess } = await getUserWordById({ userId, wordId });

      if (isSuccess) {
        if (type === 'difficulty') {
          const { optional } = data;

          const body = {
            difficulty: payload,
            optional: {
              ...optional,
              learned: payload === UserWordDifficulty.HARD ? false : optional?.learned,
            },
          };

          await updateUserWord({ userId, wordId, body });
        }

        if (type === 'learned') {
          const { difficulty, optional } = data;

          const body = {
            difficulty: payload ? UserWordDifficulty.DEFAULT : difficulty,
            optional: {
              ...optional,
              learned: payload,
            },
          };

          await updateUserWord({ userId, wordId, body });
        }
      } else {
        if (type === 'difficulty') {
          const body = {
            difficulty: payload,
            optional: {
              learned: false,
            },
          };

          await createUserWord({ userId, wordId, body }).unwrap();
        }

        if (type === 'learned') {
          const body = {
            difficulty: UserWordDifficulty.DEFAULT,
            optional: {
              learned: payload,
            },
          };

          await createUserWord({ userId, wordId, body });
        }
      }

      updateCurrentWord({ wordId });
    }
  };

  const handleAddHardWord = (): Promise<void> =>
    handleUpdateWord({ type: 'difficulty', payload: UserWordDifficulty.HARD });
  const handleRemoveHardWord = (): Promise<void> =>
    handleUpdateWord({ type: 'difficulty', payload: UserWordDifficulty.DEFAULT });

  const handleAddLearnedWord = (): Promise<void> =>
    handleUpdateWord({ type: 'learned', payload: true });
  const handleRemoveLearnedWord = (): Promise<void> =>
    handleUpdateWord({ type: 'learned', payload: false });

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
              onClick={isMainView && !isHardWord ? handleAddHardWord : handleRemoveHardWord}
            >
              {isMainView && (isHardWord ? 'Удалить из сложных' : 'Добавить в сложные')}
              {isUserView && 'Удалить из сложных'}
            </Button>
            <Button
              type="button"
              onClick={!isLearnedWord ? handleAddLearnedWord : handleRemoveLearnedWord}
            >
              {isLearnedWord ? 'Удалить из изученных' : 'Добавить в изученные'}
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
