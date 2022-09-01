/* eslint-disable no-underscore-dangle */
import { FC, useEffect, useState } from 'react';
import s from './AudiocallAnswers.module.scss';
import { Word } from '../../interfaces/words';
import {
  AudiocallAnswerInfo,
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
import {
  useLazyGetUserWordByIdQuery,
  useUpdateUserWordMutation,
  useCreateUserWordMutation,
} from '../../services/userWordsApi';
import { MutateUserWordBody } from '../../interfaces/userWords';
import UserWordDifficulty from '../../shared/enums/UserWordDifficulty';
// import getUserWordById from '../../services/getUserWordById';
// import updateUserWord from '../../services/updateUserWord';
// import createUserWord from '../../services/createUserWord';

export interface AudiocallAnswersProps {
  data: Word[];
  answers: AudiocallAnswerInfo[];
  currentWord: number;
}

const AudiocallAnswers: FC<AudiocallAnswersProps> = ({ data, answers, currentWord }) => {
  const dispatch = useAppDispatch();

  const disable = useAppSelector(selectDisableAnswers);
  const currentCorrectAnswers = useAppSelector(selectCorrectAnswers);
  const currentWrongAnswers = useAppSelector(selectWrongAnswers);
  const userId = useAppSelector(selectCurrentUserId);
  // const token = useAppSelector(selectCurrentAccessToken);

  const [correctChoise, setCorrectChoise] = useState<Word | undefined>();
  const [wrongChoise, setWrongChoise] = useState('');

  const [getUserWordById] = useLazyGetUserWordByIdQuery();
  const [updateUserWord] = useUpdateUserWordMutation();
  const [createUserWord] = useCreateUserWordMutation();

  useEffect(() => {
    if (correctChoise === undefined || data[currentWord].word !== correctChoise.word) {
      setCorrectChoise(undefined);
      setWrongChoise('');
    }
  }, [correctChoise, data, currentWord]);

  const evaluateAnswer = async (wordId: string, isCorrect: boolean): Promise<void> => {
    if (userId) {
      const { data: userWord, isSuccess } = await getUserWordById({ userId, wordId });

      if (isSuccess) {
        console.log(userWord);
        const { difficulty: prevDifficulty, optional } = userWord;
        const audiocall = optional?.games?.audiocall || undefined;
        const sprint = optional?.games?.audiocall || undefined;

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
              ...sprint,
              audiocall: {
                correctAnswers,
                incorrectAnswers,
                winStreak,
              },
            },
          },
        };

        updateUserWord({ userId, wordId, body });
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

        createUserWord({ userId, wordId, body });
      }
    }
  };

  const chooseAnswer = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    const chosenAnswer = e.target as HTMLButtonElement;

    const wordId: string = data[Number(chosenAnswer.name)]._id;

    setCorrectChoise(data[currentWord]);

    if (chosenAnswer.textContent === data[currentWord].wordTranslate) {
      dispatch(setCorrectAnswers([...currentCorrectAnswers, data[currentWord]]));

      evaluateAnswer(wordId, true);
    } else if (chosenAnswer.textContent === 'Don"t know') {
      dispatch(setWrongAnswers([...currentWrongAnswers, data[currentWord]]));

      evaluateAnswer(data[currentWord]._id, false);
    } else {
      setWrongChoise(chosenAnswer.id);

      dispatch(setWrongAnswers([...currentWrongAnswers, data[currentWord]]));

      evaluateAnswer(data[currentWord]._id, false);
    }

    dispatch(setDisableAnswers(true));
    dispatch(setShouldContinue(true));
  };

  return (
    <div className={s.audiocallAnswersContainer}>
      <div className={s.audiocallAnswers}>
        {answers.map((answer) => {
          const wordDataId = answer.word.replaceAll(' ', '-');
          let wordClass = `${s.audiocallAnswers_answer}`;

          if (wordDataId === correctChoise?.wordTranslate.replaceAll(' ', '-'))
            wordClass = `${s.correctAnswer}`;
          if (wordDataId === wrongChoise) wordClass = `${s.wrongAnswer}`;

          return (
            <button
              type="button"
              key={answer.word}
              id={wordDataId}
              onClick={(e): void => chooseAnswer(e)}
              name={answer.wordIndex.toString()}
              className={`${wordClass}`}
              disabled={disable}
            >
              {answer.word}
            </button>
          );
        })}
      </div>
      {!disable && (
        <button type="button" onClick={(e): void => chooseAnswer(e)} className={s.dontKnowButton}>
          Don't know
        </button>
      )}
    </div>
  );
};

export default AudiocallAnswers;
