import { FC, useEffect } from 'react';
import Button from '../Button';
import s from './SprintGame.module.scss';
import { ReactComponent as ClockIcon } from '../../assets/svg/clock-icon.svg';

interface SprintGameProps {
  seconds: number;
  answerCount: number;
  word?: string;
  translate?: string;
  // disabledBtn: boolean;
  checkWord: (answer: boolean) => void;
  // isLoading: boolean;
}

const SprintGameContent: FC<SprintGameProps> = ({
  seconds,
  answerCount,
  word,
  translate,
  // disabledBtn,
  checkWord,
  // isLoading,
}) => {
  // Action BTN
  useEffect(() => {
    const onKeypress = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') checkWord(true);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') checkWord(false);
    };

    document.addEventListener('keydown', onKeypress);

    return () => {
      document.removeEventListener('keydown', onKeypress);
    };
  }, [checkWord, word]);

  // if (isLoading) return <p>Loading....</p>;

  if (word) {
    return (
      <div className={s.gameContentContainer}>
        <section className={s.timerAndCount}>
          <div className={s.content}>
            <div className={s.content_timer}>
              <ClockIcon className={s.clockIcon} />
              <div className={s.clockCount}>{seconds}</div>
            </div>
            <span className={s.content_counter}>
              <p className={s.counterText}>Подряд:</p>
              <div className={s.counterCount}>{answerCount}</div>
            </span>
          </div>
          <div className={s.wordContainer}>
            <div className={s.wordLeft}>
              <p>{word || 'Слова закончились!'}</p>
            </div>
            {word && <span>=</span>}
            <div className={s.wordRight}>{word && <p>{translate || 'Перевод'}</p>}</div>
          </div>
        </section>
        {word && (
          <section className={s.buttonContainer}>
            <Button
              className={s.buttonContainer_true}
              // disabled={disabledBtn}
              type="button"
              onClick={(): void => checkWord(true)}
            >
              Верно
            </Button>
            <Button
              className={s.buttonContainer_false}
              // disabled={disabledBtn}
              type="button"
              onClick={(): void => checkWord(false)}
            >
              Неверно
            </Button>
          </section>
        )}
      </div>
    );
  }

  return null;
};

export default SprintGameContent;
