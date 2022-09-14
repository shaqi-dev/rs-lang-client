import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { SprintResultPage } from '../../interfaces/SprintState';
import { Word } from '../../interfaces/words';
import { API_BASE } from '../../services/endpoints';
import { selectResultPage, setResultPage } from '../../store/sprint/sprintSlice';
import Button from '../Button';
import s from './SprintGameResult.module.scss';
import { ReactComponent as DefaultAudioButton } from '../../assets/svg/default-audio-button.svg';

interface SprintGameResultContent {
  correctCollection: Word[];
  wrongCollection: Word[];
  restart: () => void;
}

const SprintGameResult: FC<SprintGameResultContent> = ({
  correctCollection,
  wrongCollection,
  restart,
}) => {
  const dispatch = useAppDispatch();
  const resultPage = useAppSelector(selectResultPage);

  const pieChartDivider = correctCollection.length + wrongCollection.length;

  const correctAnswersPers = (correctCollection.length / pieChartDivider) * 100;
  const pieChartStyle = {
    '--percentage': correctAnswersPers,
    '--border-thickness': '24px',
    '--main-color': 'rgb(90, 220, 0)',
  } as React.CSSProperties;

  const handleSetResultPage = (pageName: SprintResultPage): void => {
    dispatch(setResultPage(pageName));
  };

  const playAudio = (audioLink: string): void => {
    const audioSource = `${API_BASE}/${audioLink}`;
    const audio = new Audio(audioSource);
    audio.play();
  };

  return (
    <div className={s.sprintResult}>
      <div className={s.resultsNav}>
        <button
          type="button"
          className={s.resultsNav_button}
          onClick={(): void => handleSetResultPage(SprintResultPage.PIE_CHART)}
        >
          Pie Chart
        </button>
        <button
          type="button"
          className={s.resultsNav_button}
          onClick={(): void => handleSetResultPage(SprintResultPage.WORDS)}
        >
          Words
        </button>
      </div>
      <div className={s.resultsBody}>
        {resultPage === SprintResultPage.PIE_CHART ? (
          <div className={s.pieChartContainer}>
            <p>Goog Job!</p>
            <div className={s.pieChart} style={pieChartStyle}>{`${correctAnswersPers}%`}</div>
          </div>
        ) : (
          <div className={s.sprintResultWords}>
            <p className={s.correctWrongText}>{`Correct answers (${correctCollection.length}):`}</p>
            <ul className={s.sprintResultWords_list}>
              {correctCollection.map((answer: Word) => {
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
            <p className={s.correctWrongText}>{`Wrong answers (${wrongCollection.length}):`}</p>
            <ul className={s.sprintResultWords_list}>
              {wrongCollection.map((answer) => {
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
      <Button type="button" onClick={(): void => restart()} className={s.tryAgainButton}>
        Начать сначала
      </Button>
      {/* <h3 className={s.list_title}>Не знаю {wrongCollection.length}</h3>
      <ul className={(s.list_correct, s.list)}>
        {wrongCollection.map((wordItem) => (
          <li key={Math.random() ** 2}>
            {wordItem.word} - {wordItem.wordTranslate}
          </li>
        ))}
      </ul>
      <hr />
      <h3 className={s.list_title}>Знаю {correctCollection.length}</h3>
      <ul className={(s.list_correct, s.list)}>
        {correctCollection.map((wordItem) => (
          <li key={Math.random() ** 3}>
            {wordItem.word} - {wordItem.wordTranslate}
          </li>
        ))}
      </ul>
      <Button type="button" onClick={(): void => restart()}>
        Начать сначала
      </Button> */}
    </div>
  );
};

export default SprintGameResult;
