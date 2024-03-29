import { FC, useEffect, useState } from 'react';
import s from './AudiocallGame.module.scss';
import { API_BASE } from '../../services/endpoints';
import AudiocallAnswers from '../AudiocallAnswers';
import AudiocallMeaning from '../AudiocallMeaning';
import AudiocallResult from '../AudiocallResult';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  setShouldContinue,
  setDisableAnswers,
  selectShouldContinue,
  selectStats,
  setStats,
  clearStats,
} from '../../store/audiocall/audiocallSlice';
import {
  useLazyGetStatisticsQuery,
  useUpdateStatisticsMutation,
} from '../../services/statisticsApi';
import { selectCurrentUserId } from '../../store/auth/authSlice';
import { AggregatedWord } from '../../interfaces/userAggregatedWords';
import { Word } from '../../interfaces/words';
import shuffleArray from '../../shared/shuffleArray';
import getCurrentDate from '../../shared/getCurrentDate';
import { GameStatsShort } from '../../interfaces/statistics';

export interface AudiocallGameProps {
  data: Word[] | AggregatedWord[];
  fakeData: Word[] | AggregatedWord[];
  tryAgain: () => void;
}

const playAudio = (word: Word | AggregatedWord): void => {
  const audioSource = `${API_BASE}/${word.audio}`;
  const audio = new Audio(audioSource);
  audio.play();
};

const AudiocallGame: FC<AudiocallGameProps> = ({ data, fakeData, tryAgain }) => {
  const dispatch = useAppDispatch();

  const userId = useAppSelector(selectCurrentUserId);
  const shouldContinue = useAppSelector(selectShouldContinue);
  const stats = useAppSelector(selectStats);
  const currentDate = getCurrentDate();
  const fullData = [...data, ...fakeData];

  const [wordsCounter, setWordsCounter] = useState(0);
  const [currentCorrectAnswer, setCurrentCorrectAnswer] = useState<Word | AggregatedWord>();
  const [currentAnswers, setCurrentAnswers] = useState<Word[] | AggregatedWord[]>([]);
  const [usedWordsIds, setUsedWordsIds] = useState<string[]>([]);

  const [getStatistics] = useLazyGetStatisticsQuery();
  const [updateStatistics] = useUpdateStatisticsMutation();

  const generateNextAnswers = (): void => {
    let correctWord = data[Math.floor(Math.random() * data.length)];
    let correctWordId = userId ? correctWord._id : correctWord.id;

    while (usedWordsIds.includes(correctWordId)) {
      correctWord = data[Math.floor(Math.random() * data.length)];
      correctWordId = userId ? correctWord._id : correctWord.id;
    }

    const fakeWords: Word[] | AggregatedWord[] = [];

    for (let i = 0; i < 4; ) {
      const fakeWord = fullData[Math.floor(Math.random() * fullData.length)];
      const fakeWordId = userId ? fakeWord._id : fakeWord.id;

      if (
        correctWord.word !== fakeWord.word &&
        !fakeWords.includes(fakeWord) &&
        !usedWordsIds.includes(fakeWordId)
      ) {
        fakeWords.push(fakeWord);
        i += 1;
      }
    }

    const mixedWithCorrect = shuffleArray<Word | AggregatedWord>([...fakeWords, correctWord]);

    setCurrentCorrectAnswer(correctWord);
    setUsedWordsIds([...usedWordsIds, correctWordId]);
    setCurrentAnswers([...mixedWithCorrect]);
    playAudio(correctWord);
  };

  useEffect(() => {
    if (stats.date !== currentDate) {
      dispatch(clearStats());
    }

    if (userId) {
      const loadCurrentDateStats = async (): Promise<void> => {
        const { data: currentStatsData } = await getStatistics(userId);

        const currentDateStats =
          currentStatsData?.optional?.games?.audiocall?.filter((x) => x.date === currentDate)[0] ||
          undefined;

        if (currentDateStats) {
          dispatch(setStats(currentDateStats));
        }
      };

      loadCurrentDateStats();
    }
  }, []);

  useEffect(() => {
    if (wordsCounter < 10 && wordsCounter < data.length) {
      generateNextAnswers();
    }

    if (userId && (wordsCounter === 10 || wordsCounter === data.length)) {
      const updateStats = async (): Promise<void> => {
        const { data: prevStatsData } = await getStatistics(userId);

        const prevStats = prevStatsData?.optional?.games?.audiocall || undefined;
        const sprintStats = prevStatsData?.optional?.games?.sprint || undefined;
        const currentDateStats = prevStats?.filter((x) => x.date === currentDate)[0] || undefined;

        let audiocall: GameStatsShort[];

        if (prevStats) {
          if (currentDateStats) {
            audiocall = [...prevStats.filter((x) => x.date !== currentDate), stats];
          } else {
            audiocall = [...prevStats, stats];
          }
        } else {
          audiocall = [stats];
        }

        const body = {
          optional: {
            games: {
              audiocall,
              sprint: sprintStats,
            },
          },
        };

        await updateStatistics({ userId, body });
      };

      updateStats();
    }
  }, [wordsCounter, data.length]);

  const handleContinueGame = (): void => {
    dispatch(setDisableAnswers(false));
    dispatch(setShouldContinue(false));
    setWordsCounter(wordsCounter + 1);
  };

  const handleTryAgain = (): void => {
    tryAgain();
    setUsedWordsIds([]);
    setWordsCounter(0);
  };

  // Action BTN
  useEffect(() => {
    const onKeypress = (e: KeyboardEvent): void => {
      if (shouldContinue && (e.key === ' ' || e.keyCode === 32)) {
        handleContinueGame();
      }
    };

    document.addEventListener('keydown', onKeypress);

    return () => {
      document.removeEventListener('keydown', onKeypress);
    };
  }, [currentCorrectAnswer, shouldContinue]);

  return (
    <section className={s.audiocallGame}>
      {currentCorrectAnswer && wordsCounter < 10 && wordsCounter < data.length && (
        <div className={s.gameContainer}>
          <AudiocallMeaning
            imageLink={`${API_BASE}/${currentCorrectAnswer.image}`}
            imageAlt={`${currentCorrectAnswer.word}`}
            currentWord={`${currentCorrectAnswer.word}`}
            playAudio={(): void => playAudio(currentCorrectAnswer)}
          />
          <AudiocallAnswers
            currentAnswers={currentAnswers}
            currentCorrectAnswer={currentCorrectAnswer}
          />
          {shouldContinue && (
            <button
              type="button"
              onClick={handleContinueGame}
              className={s.gameContainer_continueButton}
            >
              Продолжить
            </button>
          )}
        </div>
      )}
      {(wordsCounter === 10 || wordsCounter === data.length) && (
        <AudiocallResult correctWordsCount={data.length} tryAgain={handleTryAgain} />
      )}
    </section>
  );
};

export default AudiocallGame;
