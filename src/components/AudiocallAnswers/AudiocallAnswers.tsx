/* eslint-disable no-underscore-dangle */
import { FC } from 'react';
import s from './AudiocallAnswers.module.scss';
import { Word } from '../../interfaces/words';
import AudiocallAnswerInfo from '../../interfaces/audiocallAnswerInfo';
import {
  setAudiocallShouldContinue,
  setAudiocallDisableAnswers,
  setAudiocallWrongAnswers,
  setAudiocallCorrectAnswers,
  setAudiocallCorrectChoise,
  setAudiocallWrongChoise,
  selectAudiocallDisableAnswers,
  selectAudiocallCorrectAnswers,
  selectAudiocallWrongAnswers,
  selectAudiocallCorrectChoise,
  selectAudiocallWrongChoise,
  selectAudiocallCurrentWord,
} from '../../store/audiocall/audiocallSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { selectCurrentAccessToken, selectCurrentUserId } from '../../store/auth/authSlice';
import getUserWordById from '../../services/getUserWordById';
import updateUserWord from '../../services/updateUserWord';
import createUserWord from '../../services/createUserWord';

const AudiocallAnswers: FC<{ answers: AudiocallAnswerInfo[]; data: Word[] }> = (props) => {
  const { answers, data } = props;

  const dispatch = useAppDispatch();
  const currentWord = useAppSelector(selectAudiocallCurrentWord);
  const disable = useAppSelector(selectAudiocallDisableAnswers);
  const correctAnswers = useAppSelector(selectAudiocallCorrectAnswers);
  const wrongAnswers = useAppSelector(selectAudiocallWrongAnswers);
  const correctChoise = useAppSelector(selectAudiocallCorrectChoise);
  const wrongChoise = useAppSelector(selectAudiocallWrongChoise);
  const userId = useAppSelector(selectCurrentUserId);
  const token = useAppSelector(selectCurrentAccessToken);

  const evaluateAnswer = (wordId: string, isCorrect: boolean): void => {
    if (userId && token) {
      getUserWordById({ userId, wordId, token }).then(
        (res: {
          difficulty: string | undefined;
          optional: { audiocall: number; sprint: number } | undefined;
          error: Error | undefined;
        }) => {
          console.log(res);
          if (res.difficulty && res.optional) {
            let audiocallWordCount: number = res.optional.audiocall ?? 0;
            if (isCorrect && res.optional.audiocall < 3) audiocallWordCount += 1;
            else if (!isCorrect) audiocallWordCount = 0;

            const userData = {
              difficulty: res.difficulty,
              optional: {
                audiocall: audiocallWordCount,
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
    const chosenAnswer: HTMLButtonElement = e.target as HTMLButtonElement;
    const wordDataId = data[currentWord].wordTranslate.replaceAll(' ', '-');
    const rightAnswer: HTMLButtonElement = document.querySelector(
      `#${wordDataId}`,
    ) as HTMLButtonElement;

    const wordId: string = data[Number(chosenAnswer.name)]._id;

    if (chosenAnswer.textContent === data[currentWord].wordTranslate) {
      dispatch(setAudiocallCorrectChoise(chosenAnswer.id));
      dispatch(setAudiocallCorrectAnswers([...correctAnswers, data[Number(chosenAnswer.name)]]));

      evaluateAnswer(wordId, true);
    } else if (chosenAnswer.textContent === 'Don"t know') {
      dispatch(setAudiocallCorrectChoise(rightAnswer.id));
      dispatch(setAudiocallWrongAnswers([...wrongAnswers, data[Number(rightAnswer.name)]]));

      evaluateAnswer(data[currentWord]._id, false);
    } else {
      dispatch(setAudiocallCorrectChoise(rightAnswer.id));
      dispatch(setAudiocallWrongChoise(chosenAnswer.id));
      dispatch(setAudiocallWrongAnswers([...wrongAnswers, data[Number(rightAnswer.name)]]));

      evaluateAnswer(data[currentWord]._id, false);
    }

    dispatch(setAudiocallDisableAnswers(true));
    dispatch(setAudiocallShouldContinue(true));
  };

  return (
    <div className={s.audiocallAnswersContainer}>
      <div className={s.audiocallAnswers}>
        {answers.map((answer) => {
          const wordDataId = answer.word.replaceAll(' ', '-');
          let wordClass = `${s.audiocallAnswers_answer}`;

          if (wordDataId === correctChoise) wordClass = `${s.correctAnswer}`;
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
