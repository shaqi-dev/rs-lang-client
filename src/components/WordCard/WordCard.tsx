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
  useDeleteUserWordMutation,
  useLazyGetUserWordByIdQuery,
} from '../../services/userWordsApi';
import type { Word } from '../../interfaces/words';
import type { AggregatedWord } from '../../interfaces/userAggregatedWords';
import WordDifficulty from '../../shared/enums/WordDifficulty';
import s from './WordCard.module.scss';
import TextbookView from '../../shared/enums/TextbookView';
import { useLazyGetUserAggregatedWordByIdQuery } from '../../services/userAggregatedWordsApi';

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
  const [deleteUserWord] = useDeleteUserWordMutation();
  const [getUserWord] = useLazyGetUserWordByIdQuery();
  const [getUserAggregatedWord] = useLazyGetUserAggregatedWordByIdQuery();

  const wordDifficulty = ('userWord' in word && word.userWord?.difficulty) || undefined;
  const isHardWord = wordDifficulty === WordDifficulty.HARD;
  const isLearnedWord = wordDifficulty === WordDifficulty.WEAK;
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

  const handleChangeWordDifficulty = async (difficulty: WordDifficulty): Promise<void> => {
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

      const { isSuccess } = await getUserWord({ userId, wordId });

      if (isSuccess) {
        await updateUserWord(requestData).unwrap();
      } else {
        await createUserWord(requestData).unwrap();
      }

      updateCurrentWord({ wordId });
    }
  };

  const handleAddHardWord = (): Promise<void> => handleChangeWordDifficulty(WordDifficulty.HARD);
  const handleAddWeakWord = (): Promise<void> => handleChangeWordDifficulty(WordDifficulty.WEAK);

  const handleRemoveWord = async (): Promise<void> => {
    if (userId && '_id' in word && word._id) {
      const wordId = word._id;

      deleteUserWord({ userId, wordId });

      updateCurrentWord({ wordId });
    }
  };

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
              onClick={isMainView && !isHardWord ? handleAddHardWord : handleRemoveWord}
            >
              {isMainView && (isHardWord ? 'Удалить из сложных' : 'Добавить в сложные')}
              {isUserView && 'Удалить из сложных'}
            </Button>
            <Button type="button" onClick={isLearnedWord ? handleRemoveWord : handleAddWeakWord}>
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
