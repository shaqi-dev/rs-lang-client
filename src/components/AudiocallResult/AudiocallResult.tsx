import { FC } from 'react';
import s from './AudiocallResult.module.scss';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { API_BASE } from '../../services/endpoints';
import {
  selectAudiocallWrongAnswers,
  selectAudiocallCorrectAnswers,
  selectAudiocallResultPage,
  setAudiocallResultPage,
} from '../../store/audiocall/audiocallSlice';
import { Word } from '../../interfaces/words';

const AudiocallResult: FC = () => {
  const dispatch = useAppDispatch();
  const audiocallWrongAnswers = useAppSelector(selectAudiocallWrongAnswers);
  const audiocallCorrectAnswers = useAppSelector(selectAudiocallCorrectAnswers);
  const resultPage = useAppSelector(selectAudiocallResultPage);

  const correctAnswersPers = audiocallCorrectAnswers.length * 10;
  const pieChartStyle = {
    '--percentage': correctAnswersPers,
    '--border-thickness': '10px',
    '--main-color': 'lawngreen',
  } as React.CSSProperties;

  const playAudio = (audioLink: string): void => {
    const audioSource = `${API_BASE}/${audioLink}`;
    const audio = new Audio(audioSource);
    audio.play();
  };

  const setResultPage = (pageName: string): void => {
    dispatch(setAudiocallResultPage(pageName));
  };

  return (
    <div className={s.audiocallResult}>
      <div className={s.resultsNav}>
        <button
          type="button"
          className={s.resultsNav_button}
          onClick={(): void => setResultPage('pieChart')}
        >
          Pie Chart
        </button>
        <button
          type="button"
          className={s.resultsNav_button}
          onClick={(): void => setResultPage('words')}
        >
          Words
        </button>
      </div>
      <div className={s.resultsBody}>
        {resultPage === 'pieChart' ? (
          <div className={s.pieChartContainer}>
            <p>Goog Job!</p>
            <div className={s.pieChart} style={pieChartStyle}>{`${correctAnswersPers}%`}</div>
          </div>
        ) : (
          <div className={s.audiocallResultWords}>
            <p
              className={s.correctWrongText}
            >{`Correct answers (${audiocallCorrectAnswers.length}):`}</p>
            <ul className={s.audiocallResultWords_list}>
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
            <p
              className={s.correctWrongText}
            >{`Wrong answers (${audiocallWrongAnswers.length}):`}</p>
            <ul className={s.audiocallResultWords_list}>
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
        )}
      </div>
    </div>
  );
};

export default AudiocallResult;
