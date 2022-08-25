import { FC } from 'react';
import s from './AudiocallAnswers.module.scss';
import AudiocallAnswerInfo from '../../interfaces/audiocallAnswerInfo';
import { useAppSelector } from '../../hooks/redux';
import { selectAudiocallDisableAnswers } from '../../store/audiocall/audiocallSlice';

const AudiocallAnswers: FC<{
  answers: AudiocallAnswerInfo[];
  chooseAnswer: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}> = (props) => {
  const { answers, chooseAnswer } = props;
  const disable = useAppSelector(selectAudiocallDisableAnswers);

  return (
    <div className={s.audiocallAnswers}>
      {answers.map((answer) => {
        const wordId = answer.word.replaceAll(' ', '-');
        return (
          <button
            type="button"
            key={answer.word}
            id={wordId}
            onClick={(e): void => chooseAnswer(e)}
            name={answer.wordIndex.toString()}
            className={s.audiocallAnswers_answer}
            disabled={disable}
          >
            {answer.word}
          </button>
        );
      })}
    </div>
  );
};

export default AudiocallAnswers;
