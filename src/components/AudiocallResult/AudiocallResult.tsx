import { FC } from 'react';
import s from './AudiocallResult.module.scss';
import { useAppSelector } from '../../hooks/redux';
import { Word } from '../../interfaces/words';
import { API_BASE } from '../../services/endpoints';
import {
  selectAudiocallWrongAnswers,
  selectAudiocallCorrectAnswers,
} from '../../store/audiocall/audiocallSlice';

const AudiocallResult: FC = () => {
  const audiocallWrongAnswers = useAppSelector(selectAudiocallWrongAnswers);
  const audiocallCorrectAnswers = useAppSelector(selectAudiocallCorrectAnswers);

  const playAudio = (audioLink: string): void => {
    const audioSource = `${API_BASE}/${audioLink}`;
    const audio = new Audio(audioSource);
    audio.play();
  };

  return (
    <div className={s.audiocallResult}>
      <p className={s.correctWrongText}>{`Correct answers (${audiocallCorrectAnswers.length}):`}</p>
      <ul className={s.audiocallResult_list}>
        {audiocallCorrectAnswers.map((answer: Word) => {
          return (
            <li key={answer.word} className={s.listElement}>
              <button
                type="button"
                onClick={(): void => playAudio(answer.audio)}
                className={s.listElement_audioButton}
              >
                Play Audio
              </button>
              <p className={s.listElement_word}>
                {answer.word} - {answer.wordTranslate}
              </p>
            </li>
          );
        })}
      </ul>
      <p className={s.correctWrongText}>{`Wrong answers (${audiocallWrongAnswers.length}):`}</p>
      <ul className={s.audiocallResult_list}>
        {audiocallWrongAnswers.map((answer) => {
          return (
            <li key={answer.word} className={s.listElement}>
              <button
                type="button"
                onClick={(): void => playAudio(answer.audio)}
                className={s.listElement_audioButton}
              >
                Play Audio
              </button>
              <p className={s.listElement_word}>
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
