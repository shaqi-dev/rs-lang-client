import { FC } from 'react';
import s from './AudiocallResult.module.scss';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { API_BASE } from '../../services/endpoints';
import {
  selectWrongAnswers,
  selectCorrectAnswers,
  selectResultPage,
  setResultPage,
} from '../../store/audiocall/audiocallSlice';
import { Word } from '../../interfaces/words';
import { AudiocallResultPage } from '../../interfaces/audiocallState';
import { ReactComponent as DefaultAudioButton } from '../../assets/svg/default-audio-button.svg';

interface AudiocallResultProps {
  correctWordsCount: number;
}

const AudiocallResult: FC<AudiocallResultProps> = ({ correctWordsCount }) => {
  const dispatch = useAppDispatch();
  const wrongAnswers = useAppSelector(selectWrongAnswers);
  const correctAnswers = useAppSelector(selectCorrectAnswers);
  const resultPage = useAppSelector(selectResultPage);
  const pieChartDivider = correctWordsCount < 10 ? correctWordsCount : 10;

  const correctAnswersPers = (correctAnswers.length / pieChartDivider) * 100;
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

  const handleSetResultPage = (pageName: AudiocallResultPage): void => {
    dispatch(setResultPage(pageName));
  };

  return (
    <div className={s.audiocallResult}>
      <div className={s.resultsNav}>
        <button
          type="button"
          className={s.resultsNav_button}
          onClick={(): void => handleSetResultPage(AudiocallResultPage.PIE_CHART)}
        >
          Pie Chart
        </button>
        <button
          type="button"
          className={s.resultsNav_button}
          onClick={(): void => handleSetResultPage(AudiocallResultPage.WORDS)}
        >
          Words
        </button>
      </div>
      <div className={s.resultsBody}>
        {resultPage === AudiocallResultPage.PIE_CHART ? (
          <div className={s.pieChartContainer}>
            <p>Goog Job!</p>
            <div className={s.pieChart} style={pieChartStyle}>{`${correctAnswersPers}%`}</div>
          </div>
        ) : (
          <div className={s.audiocallResultWords}>
            <p className={s.correctWrongText}>{`Correct answers (${correctAnswers.length}):`}</p>
            <ul className={s.audiocallResultWords_list}>
              {correctAnswers.map((answer: Word) => {
                return (
                  <li key={answer.word} className={s.listElement}>
                    <DefaultAudioButton
                      onClick={(): void => playAudio(answer.audio)}
                      className={s.listElement_audioButton}
                    />
                    <p className={s.listElement_word}>
                      {answer.word} - {answer.wordTranslate}
                    </p>
                  </li>
                );
              })}
            </ul>
            <p className={s.correctWrongText}>{`Wrong answers (${wrongAnswers.length}):`}</p>
            <ul className={s.audiocallResultWords_list}>
              {wrongAnswers.map((answer) => {
                return (
                  <li key={answer.word} className={s.listElement}>
                    <DefaultAudioButton
                      onClick={(): void => playAudio(answer.audio)}
                      className={s.listElement_audioButton}
                    />
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
