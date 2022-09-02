/* eslint-disable no-underscore-dangle */
import { FC, useState, useEffect } from 'react';
import s from './AudiocallAnswers.module.scss';
import { Word } from '../../interfaces/words';
import {
  setShouldContinue,
  setDisableAnswers,
  setWrongAnswers,
  setCorrectAnswers,
  selectDisableAnswers,
  selectCorrectAnswers,
  selectWrongAnswers,
} from '../../store/audiocall/audiocallSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { selectCurrentUserId } from '../../store/auth/authSlice';
import { useUpdateUserWordMutation, useCreateUserWordMutation } from '../../services/userWordsApi';
import { MutateUserWordBody } from '../../interfaces/userWords';
import UserWordDifficulty from '../../shared/enums/UserWordDifficulty';
import { AggregatedWord } from '../../interfaces/userAggregatedWords';
import {
  useLazyGetStatisticsQuery,
  useUpdateStatisticsMutation,
} from '../../services/statisticsApi';
import { UserStatisticsData } from '../../interfaces/statistics';

export interface AudiocallAnswersProps {
  currentAnswers: Word[] | AggregatedWord[];
  currentCorrectAnswer: Word | AggregatedWord;
}

const AudiocallAnswers: FC<AudiocallAnswersProps> = ({ currentAnswers, currentCorrectAnswer }) => {
  const dispatch = useAppDispatch();

  const userId = useAppSelector(selectCurrentUserId);
  const disable = useAppSelector(selectDisableAnswers);
  const currentCorrectAnswers = useAppSelector(selectCorrectAnswers);
  const currentWrongAnswers = useAppSelector(selectWrongAnswers);

  const [currentChoise, setCurrentChoise] = useState<Word | AggregatedWord | null>(null);
  const [currentWinStreak, setCurrentWinStreak] = useState<number>(0);
  const [maxWinStreak, setMaxWinStreak] = useState<number>(0);

  const [updateUserWord] = useUpdateUserWordMutation();
  const [createUserWord] = useCreateUserWordMutation();
  const [getStatistics] = useLazyGetStatisticsQuery();
  const [updateStatistics] = useUpdateStatisticsMutation();

  useEffect(() => {
    setCurrentChoise(null);
  }, [currentCorrectAnswer]);

  useEffect(() => {
    if (currentWinStreak > maxWinStreak) {
      setMaxWinStreak(currentWinStreak);
    }

    console.log('current:', currentWinStreak);
    console.log('max:', maxWinStreak);
  }, [currentWinStreak, maxWinStreak]);

  const evaluateAnswer = async (word: Word | AggregatedWord, isCorrect: boolean): Promise<void> => {
    if (isCorrect) {
      setCurrentWinStreak(currentWinStreak + 1);
    } else {
      setCurrentWinStreak(0);
    }

    if (userId) {
      const wordId = word._id;

      if ('userWord' in word && word.userWord) {
        const { difficulty: prevDifficulty, optional } = word.userWord;
        const audiocall = optional?.games?.audiocall || undefined;
        const sprint = optional?.games?.sprint || undefined;

        const prevCorrectAnswers: number = audiocall?.correctAnswers || 0;
        const prevIncorrectAnswers: number = audiocall?.incorrectAnswers || 0;
        const prevWinStreak: number = audiocall?.winStreak || 0;

        const correctAnswers = isCorrect ? prevCorrectAnswers + 1 : prevCorrectAnswers;
        const incorrectAnswers = !isCorrect ? prevIncorrectAnswers + 1 : prevIncorrectAnswers;
        const winStreak = isCorrect ? prevWinStreak + 1 : 0;
        const learned =
          (prevDifficulty === UserWordDifficulty.HARD && winStreak >= 5) ||
          (prevDifficulty === UserWordDifficulty.DEFAULT && winStreak >= 3) ||
          false;

        const body: MutateUserWordBody = {
          difficulty: learned ? UserWordDifficulty.DEFAULT : prevDifficulty,
          optional: {
            learned,
            games: {
              sprint,
              audiocall: {
                correctAnswers,
                incorrectAnswers,
                winStreak,
              },
            },
          },
        };

        await updateUserWord({ userId, wordId, body });

        // Short-term stats
        const prevStats = await getStatistics(userId).unwrap();

        if (prevStats) {
          const learnedWords = learned
            ? prevStats.optional?.learnedWords
            : (prevStats.optional?.learnedWords || 0) + 1;

          const audiocallStats = prevStats.optional?.games?.audiocall || undefined;
          const sprintStats = prevStats.optional?.games?.sprint || undefined;

          const prevCorrectAnswersStats: number = audiocallStats?.correctAnswers || 0;
          const prevIncorrectAnswersStats: number = audiocallStats?.incorrectAnswers || 0;
          const prevWinStreakStats: number = audiocallStats?.longestWinStreak || 0;

          const newWordsCount: number = audiocallStats?.newWordsCount || 0;
          const longestWinStreak =
            maxWinStreak > prevWinStreakStats ? maxWinStreak : prevWinStreakStats;

          const statsBody: UserStatisticsData = {
            optional: {
              learnedWords,
              games: {
                sprint: sprintStats,
                audiocall: {
                  longestWinStreak,
                  newWordsCount,
                  correctAnswers: isCorrect ? prevCorrectAnswersStats + 1 : prevCorrectAnswersStats,
                  incorrectAnswers: !isCorrect
                    ? prevIncorrectAnswersStats + 1
                    : prevIncorrectAnswersStats,
                },
              },
            },
          };

          await updateStatistics({ userId, body: statsBody });
        } else {
          const statsBody: UserStatisticsData = {
            optional: {
              games: {
                audiocall: {
                  correctAnswers: isCorrect ? 1 : 0,
                  incorrectAnswers: !isCorrect ? 1 : 0,
                  longestWinStreak: maxWinStreak,
                  newWordsCount: 0,
                },
              },
            },
          };

          await updateStatistics({ userId, body: statsBody });
        }
      } else {
        const body: MutateUserWordBody = {
          difficulty: UserWordDifficulty.DEFAULT,
          optional: {
            learned: false,
            games: {
              audiocall: {
                correctAnswers: isCorrect ? 1 : 0,
                incorrectAnswers: !isCorrect ? 1 : 0,
                winStreak: isCorrect ? 1 : 0,
              },
            },
          },
        };

        await createUserWord({ userId, wordId, body });

        // Short-term stats
        const prevStats = await getStatistics(userId).unwrap();

        if (prevStats) {
          const { optional } = prevStats;

          const audiocallStats = optional?.games?.audiocall || undefined;
          const sprintStats = optional?.games?.sprint || undefined;

          const prevCorrectAnswersStats: number = audiocallStats?.correctAnswers || 0;
          const prevIncorrectAnswersStats: number = audiocallStats?.incorrectAnswers || 0;
          const prevWinStreakStats: number = audiocallStats?.longestWinStreak || 0;
          const prevNewWordsCount: number = audiocallStats?.newWordsCount || 0;

          const learnedWords = optional?.learnedWords || 0;
          const longestWinStreak =
            maxWinStreak > prevWinStreakStats ? maxWinStreak : prevWinStreakStats;

          const statsBody: UserStatisticsData = {
            optional: {
              learnedWords,
              games: {
                sprint: sprintStats,
                audiocall: {
                  longestWinStreak,
                  newWordsCount: prevNewWordsCount + 1,
                  correctAnswers: isCorrect ? prevCorrectAnswersStats + 1 : prevCorrectAnswersStats,
                  incorrectAnswers: !isCorrect
                    ? prevIncorrectAnswersStats + 1
                    : prevIncorrectAnswersStats,
                },
              },
            },
          };

          await updateStatistics({ userId, body: statsBody });
        } else {
          const statsBody: UserStatisticsData = {
            optional: {
              games: {
                audiocall: {
                  correctAnswers: isCorrect ? 1 : 0,
                  incorrectAnswers: !isCorrect ? 1 : 0,
                  longestWinStreak: maxWinStreak,
                  newWordsCount: 1,
                },
              },
            },
          };

          await updateStatistics({ userId, body: statsBody });
        }
      }

      const nextStats = await getStatistics(userId).unwrap();
      console.log(nextStats);
    }
  };

  const handleChooseAnswer = (word: Word | AggregatedWord | null): void => {
    if (word) {
      const wordId: string = userId ? word._id : word.id;

      if (currentCorrectAnswer.id === wordId || currentCorrectAnswer._id === wordId) {
        dispatch(setCorrectAnswers([...currentCorrectAnswers, currentCorrectAnswer]));
        evaluateAnswer(currentCorrectAnswer, true);
      } else {
        dispatch(setWrongAnswers([...currentWrongAnswers, currentCorrectAnswer]));
        evaluateAnswer(currentCorrectAnswer, false);
      }

      setCurrentChoise(word);
    } else {
      dispatch(setWrongAnswers([...currentWrongAnswers, currentCorrectAnswer]));
      evaluateAnswer(currentCorrectAnswer, false);
      setCurrentChoise(null);
    }

    dispatch(setDisableAnswers(true));
    dispatch(setShouldContinue(true));
  };

  return (
    <div className={s.audiocallAnswersContainer}>
      <div className={s.audiocallAnswers}>
        {currentAnswers.map((word) => {
          const wordId: string = userId ? word._id : word.id;
          const chosenWordId = currentChoise && (userId ? currentChoise._id : currentChoise.id);
          const correctAnswerId = userId ? currentCorrectAnswer._id : currentCorrectAnswer.id;
          let wordClass = `${s.audiocallAnswers_answer}`;

          if (disable && wordId === correctAnswerId) {
            wordClass = `${s.correctAnswer}`;
          }
          if (disable && wordId !== correctAnswerId && wordId === chosenWordId) {
            wordClass = `${s.wrongAnswer}`;
          }

          return (
            <button
              type="button"
              key={word.wordTranslate}
              onClick={(): void => handleChooseAnswer(word)}
              className={`${wordClass}`}
              disabled={disable}
            >
              {word.wordTranslate}
            </button>
          );
        })}
      </div>
      {!disable && (
        <button
          type="button"
          onClick={(): void => handleChooseAnswer(null)}
          className={s.dontKnowButton}
        >
          Don't know
        </button>
      )}
    </div>
  );
};

export default AudiocallAnswers;
