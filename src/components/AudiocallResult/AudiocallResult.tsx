import { FC } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { Word } from '../../interfaces/words';
import {
  selectAudiocallWrongAnswers,
  selectAudiocallCorrectAnswers,
} from '../../store/audiocall/audiocallSlice';

const AudiocallResult: FC = () => {
  const audiocallWrongAnswers = useAppSelector(selectAudiocallWrongAnswers);
  const audiocallCorrectAnswers = useAppSelector(selectAudiocallCorrectAnswers);
  return (
    <div>
      <p>{`Correct answers (${audiocallCorrectAnswers.length}):`}</p>
      <ul>
        {audiocallCorrectAnswers.map((answer: Word) => {
          return (
            <li key={answer.word}>
              <p>
                {answer.word} - {answer.wordTranslate}
              </p>
            </li>
          );
        })}
      </ul>
      <p>{`Wrong answers (${audiocallWrongAnswers.length}):`}</p>
      <ul>
        {audiocallWrongAnswers.map((answer) => {
          return (
            <li key={answer.word}>
              <p>
                {answer.word} - {answer.wordTranslate}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AudiocallResult;
