import { FC } from 'react';
import { useAppSelector } from '../../hooks/redux';
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
        {audiocallCorrectAnswers.map((word) => {
          return <li key={word}>{word}</li>;
        })}
      </ul>
      <p>{`Wrong answers (${audiocallWrongAnswers.length}):`}</p>
      <ul>
        {audiocallWrongAnswers.map((word) => {
          return <li key={word}>{word}</li>;
        })}
      </ul>
    </div>
  );
};

export default AudiocallResult;
