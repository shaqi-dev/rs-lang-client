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
import { selectCurrentAccessToken, selectCurrentUserId } from '../../store/auth/authSlice';
import getUserWordById from '../../services/getUserWordById';
import updateUserWord from '../../services/updateUserWord';
import createUserWord from '../../services/createUserWord';

export interface AudiocallAnswersProps {
  data: Word[];
  answers: AudiocallAnswerInfo[];
  currentWord: number;
}

const AudiocallAnswers: FC<AudiocallAnswersProps> = ({ data, answers, currentWord }) => {
  const dispatch = useAppDispatch();

  const disable = useAppSelector(selectDisableAnswers);
  const correctAnswers = useAppSelector(selectCorrectAnswers);
  const wrongAnswers = useAppSelector(selectWrongAnswers);
  const userId = useAppSelector(selectCurrentUserId);
  const token = useAppSelector(selectCurrentAccessToken);

  const [correctChoise, setCorrectChoise] = useState<Word | undefined>();
  const [wrongChoise, setWrongChoise] = useState('');

  useEffect(() => {
    if (correctChoise === undefined || data[currentWord].word !== correctChoise.word) {
      setCorrectChoise(undefined);
      setWrongChoise('');
    }
  }, [correctChoise, data, currentWord]);

  const evaluateAnswer = (wordId: string, isCorrect: boolean): void => {
    if (userId && token) {
      getUserWordById({ userId, wordId, token }).then(
        (res: {
          difficulty: string | undefined;
          optional: { audiocall: number; sprint: number } | undefined;
          error: Error | undefined;
        }) => {
          if (res.difficulty && res.optional) {
            let wordCount: number = res.optional.audiocall ?? 0;
            if (isCorrect && res.optional.audiocall < 3) wordCount += 1;
            else if (!isCorrect) wordCount = 0;

            const userData = {
              difficulty: res.difficulty,
              optional: {
                audiocall: wordCount,
                sprint: res.optional.sprint ?? 0,
              },
            };

            updateUserWord({ userId, wordId, userData, token });
          } else {
            const userData = {
              difficulty: 'weak',
              optional: {
                audiocall: isCorrect ? 1 : 0,
                sprint: 0,
              },
            };

            createUserWord({ userId, wordId, userData, token });
          }
        },
      );
    }
  };

  const chooseAnswer = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    const chosenAnswer = e.target as HTMLButtonElement;

    const wordId: string = data[Number(chosenAnswer.name)]._id;

    setCorrectChoise(data[currentWord]);

    if (chosenAnswer.textContent === data[currentWord].wordTranslate) {
      dispatch(setCorrectAnswers([...correctAnswers, data[currentWord]]));

      evaluateAnswer(wordId, true);
    } else if (chosenAnswer.textContent === 'Don"t know') {
      dispatch(setWrongAnswers([...wrongAnswers, data[currentWord]]));

      evaluateAnswer(data[currentWord]._id, false);
    } else {
      setWrongChoise(chosenAnswer.id);

      dispatch(setWrongAnswers([...wrongAnswers, data[currentWord]]));

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
