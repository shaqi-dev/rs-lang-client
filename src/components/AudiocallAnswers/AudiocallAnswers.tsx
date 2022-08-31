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

const AudiocallAnswers: FC<{ answers: AudiocallAnswerInfo[]; data: Word[] }> = (props) => {
  const { answers, data } = props;

  const dispatch = useAppDispatch();
  const currentWord = useAppSelector(selectAudiocallCurrentWord);
  const disable = useAppSelector(selectAudiocallDisableAnswers);
  const correctAnswers = useAppSelector(selectAudiocallCorrectAnswers);
  const wrongAnswers = useAppSelector(selectAudiocallWrongAnswers);
  const correctChoise = useAppSelector(selectAudiocallCorrectChoise);
  const wrongChoise = useAppSelector(selectAudiocallWrongChoise);

  const chooseAnswer = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    const chosenAnswer: HTMLButtonElement = e.target as HTMLButtonElement;

    if (chosenAnswer.textContent === data[currentWord].wordTranslate) {
      dispatch(setAudiocallCorrectChoise(chosenAnswer.id));
      dispatch(setAudiocallCorrectAnswers([...correctAnswers, data[Number(chosenAnswer.name)]]));
    } else if (chosenAnswer.textContent === 'Don"t know') {
      const wordId = data[currentWord].wordTranslate.replaceAll(' ', '-');
      const rightAnswer: HTMLButtonElement = document.querySelector(
        `#${wordId}`,
      ) as HTMLButtonElement;

      dispatch(setAudiocallCorrectChoise(rightAnswer.id));
      dispatch(setAudiocallWrongAnswers([...wrongAnswers, data[Number(rightAnswer.name)]]));
    } else {
      const wordId = data[currentWord].wordTranslate.replaceAll(' ', '-');
      const rightAnswer: HTMLButtonElement = document.querySelector(
        `#${wordId}`,
      ) as HTMLButtonElement;

      dispatch(setAudiocallCorrectChoise(rightAnswer.id));
      dispatch(setAudiocallWrongChoise(chosenAnswer.id));
      dispatch(setAudiocallWrongAnswers([...wrongAnswers, data[Number(rightAnswer.name)]]));
    }

    dispatch(setAudiocallDisableAnswers(true));
    dispatch(setAudiocallShouldContinue(true));
  };
  return (
    <div className={s.audiocallAnswersContainer}>
      <div className={s.audiocallAnswers}>
        {answers.map((answer) => {
          const wordId = answer.word.replaceAll(' ', '-');
          let wordClass = `${s.audiocallAnswers_answer}`;

          if (wordId === correctChoise) wordClass = `${s.correctAnswer}`;
          if (wordId === wrongChoise) wordClass = `${s.wrongAnswer}`;

          return (
            <button
              type="button"
              key={answer.word}
              id={wordId}
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
