import { FC, useEffect, useRef } from 'react';
import { API_BASE } from '../../services/endpoints';
import { ReactComponent as PlayIcon } from '../../assets/svg/play-sound-icon.svg';
import Button from '../Button';
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
import getGameWinrate from '../../shared/getGameWinrate';

export interface WordCardProps {
  word: Word | AggregatedWord;
  view: TextbookView;
  userId: string | null;
}

const WordCard: FC<WordCardProps> = ({ word, view, userId }) => {
  const dispatch = useAppDispatch();

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

  const audiocall = ('userWord' in word && word.userWord?.optional?.games?.audiocall) || undefined;
  const sprint = ('userWord' in word && word.userWord?.optional?.games?.sprint) || undefined;

  const [createUserWord] = useCreateUserWordMutation();
  const [updateUserWord] = useUpdateUserWordMutation();
  const [getUserWordById] = useLazyGetUserWordByIdQuery();
  const [getUserAggregatedWord] = useLazyGetUserAggregatedWordByIdQuery();

  const isHardWord =
    ('userWord' in word && word.userWord?.difficulty === UserWordDifficulty.HARD) || false;
  const isLearnedWord = ('userWord' in word && word.userWord?.optional?.learned) || false;
  const isMainView = view === TextbookView.MAIN;
  const isUserView = view === TextbookView.USER;

  const player = useRef<{
    audio: HTMLAudioElement | null;
    audioExample: HTMLAudioElement | null;
    audioMeaning: HTMLAudioElement | null;
    play: (() => void) | null;
    stop: (() => void) | null;
  }>({ audio: null, audioExample: null, audioMeaning: null, play: null, stop: null });

  useEffect(() => {
    const { current } = player;

    current.stop = (): void => {
      if (current.audio && current.audioMeaning && current.audioExample) {
        current.audio.pause();
        current.audioMeaning.pause();
        current.audioExample.pause();
        current.audio.currentTime = 0;
        current.audioMeaning.currentTime = 0;
        current.audioExample.currentTime = 0;
      }
    };

    current.play = (): void => {
      if (current.audio && current.audioMeaning && current.audioExample) {
        if (current.stop) current.stop();
        current.audio.play();
      }
    };

    const initPlayer = (): void => {
      const {
        audio: audioSrc,
        audioExample: audioExampleSrc,
        audioMeaning: audioMeaningSrc,
      } = word;
      current.audio = new Audio(`${API_BASE}/${audioSrc}`);
      current.audioExample = new Audio(`${API_BASE}/${audioExampleSrc}`);
      current.audioMeaning = new Audio(`${API_BASE}/${audioMeaningSrc}`);

      current.audio.addEventListener('ended', () =>
        (current.audioMeaning as HTMLAudioElement).play(),
      );
      current.audioMeaning.addEventListener('ended', () =>
        (current.audioExample as HTMLAudioElement).play(),
      );
    };

    current.stop();
    initPlayer();
  }, [word]);

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
          <PlayIcon
            className={s.word_playButton}
            onClick={(): void => {
              if (player.current.play) {
                player.current.play();
              }
            }}
          />
          <p className={s.word_translate}>{wordTranslate}</p>
        </div>
        {userId && (
          <div className={s.userActions}>
            <button
              type="button"
              onClick={isMainView && !isHardWord ? handleAddHardWord : handleRemoveHardWord}
              className={s.addToHard}
            >
              {isMainView && (isHardWord ? 'Удалить из сложных' : 'Добавить в сложные')}
              {isUserView && 'Удалить из сложных'}
            </button>
            <button
              type="button"
              onClick={!isLearnedWord ? handleAddLearnedWord : handleRemoveLearnedWord}
              className={s.addToKnown}
            >
              {isLearnedWord ? 'Удалить из изученных' : 'Добавить в изученные'}
            </button>
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
        {userId && (
          <div className={s.statsBlock}>
            <div className={s.gameStats}>
              <p>Спринт</p>
              <div className={s.statsCounters}>
                <span className={s.counter__correct}>{sprint?.correctAnswers || 0}</span>/
                <span className={s.counter__incorrect}>{sprint?.incorrectAnswers || 0}</span>
                <span className={s.counter__winrate}>({getGameWinrate(sprint)}%)</span>
              </div>
            </div>
            <div className={s.gameStats}>
              <p>Аудиовызов</p>
              <div className={s.statsCounters}>
                <span className={s.counter__correct}>{audiocall?.correctAnswers || 0}</span>/
                <span className={s.counter__incorrect}>{audiocall?.incorrectAnswers || 0}</span>
                <span className={s.counter__winrate}>({getGameWinrate(audiocall)}%)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordCard;
