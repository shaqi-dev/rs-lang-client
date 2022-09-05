/* eslint-disable no-underscore-dangle */
import { FC, useState, useEffect } from 'react';
import s from './AudiocallAnswers.module.scss';
import { Word } from '../../interfaces/words';
import {
  setShouldContinue,
  setDisableAnswers,
  setWrongAnswers,
  setCorrectAnswers,
  setStats,
  selectDisableAnswers,
  selectCorrectAnswers,
  selectWrongAnswers,
  selectStats,
} from '../../store/audiocall/audiocallSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { selectCurrentUserId } from '../../store/auth/authSlice';
import { useUpdateUserWordMutation, useCreateUserWordMutation } from '../../services/userWordsApi';
import { MutateUserWordBody } from '../../interfaces/userWords';
import UserWordDifficulty from '../../shared/enums/UserWordDifficulty';
import { AggregatedWord } from '../../interfaces/userAggregatedWords';
import { GameStatsShort } from '../../interfaces/statistics';

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
  const prevStats = useAppSelector(selectStats);

  const [currentChoise, setCurrentChoise] = useState<Word | AggregatedWord | null>(null);
  const [currentWinStreak, setCurrentWinStreak] = useState<number>(0);

  const [updateUserWord] = useUpdateUserWordMutation();
  const [createUserWord] = useCreateUserWordMutation();

  useEffect(() => {
    setCurrentChoise(null);
  }, [currentCorrectAnswer]);

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
        let learned = optional?.learned || false;

        if (learned && !isCorrect) {
          learned = false;
        } else if (!learned && isCorrect) {
          learned =
            (prevDifficulty === UserWordDifficulty.HARD && winStreak >= 5) ||
            (prevDifficulty === UserWordDifficulty.DEFAULT && winStreak >= 3) ||
            false;
        }

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

        if (isCorrect) console.log(currentWinStreak + 1, prevStats.longestWinStreak);

        await updateUserWord({ userId, wordId, body });

        const stats: GameStatsShort = {
          ...prevStats,
          learnedWords: learned ? prevStats.learnedWords + 1 : prevStats.learnedWords,
          longestWinStreak:
            isCorrect && currentWinStreak + 1 > prevStats.longestWinStreak
              ? prevStats.longestWinStreak + 1
              : prevStats.longestWinStreak,
          correctAnswers: isCorrect ? prevStats.correctAnswers + 1 : prevStats.correctAnswers,
          incorrectAnswers: !isCorrect
            ? prevStats.incorrectAnswers + 1
            : prevStats.incorrectAnswers,
        };

        console.log(stats);

        dispatch(setStats(stats));
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

        if (isCorrect) console.log(currentWinStreak + 1, prevStats.longestWinStreak);

        const stats: GameStatsShort = {
          ...prevStats,
          newWords: prevStats.newWords + 1,
          longestWinStreak:
            isCorrect && currentWinStreak + 1 > prevStats.longestWinStreak
              ? prevStats.longestWinStreak + 1
              : prevStats.longestWinStreak,
          correctAnswers: isCorrect ? prevStats.correctAnswers + 1 : prevStats.correctAnswers,
          incorrectAnswers: !isCorrect
            ? prevStats.incorrectAnswers + 1
            : prevStats.incorrectAnswers,
        };

        dispatch(setStats(stats));
      }
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

  // Action BTN
  useEffect(() => {
    const onKeypress = (e: KeyboardEvent): void => {
      if (
        !disable &&
        (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4' || e.key === '5')
      ) {
        handleChooseAnswer(currentAnswers[+e.key - 1]);
      }
    };

    document.addEventListener('keydown', onKeypress);

    return () => {
      document.removeEventListener('keydown', onKeypress);
    };
  }, [currentChoise, currentAnswers, disable]);

  useEffect(() => {
    const onKeypress = (e: KeyboardEvent): void => {
      if (!disable && (e.key === ' ' || e.keyCode === 32)) {
        handleChooseAnswer(null);
      }
    };

    document.addEventListener('keydown', onKeypress);

    return () => {
      document.removeEventListener('keydown', onKeypress);
    };
  }, [currentChoise, currentAnswers]);

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
