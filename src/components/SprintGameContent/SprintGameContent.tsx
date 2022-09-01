import { FC, useEffect } from 'react';
import ContentWrapper from '../../layouts/ContentWrapper';
import Button from '../Button';
import s from './SprintGame.module.scss';

interface SprintGameProps {
  seconds: number;
  answerCount: number;
  word?: string;
  translate?: string;
  disabledBtn: boolean;
  checkWord: (answer: boolean) => void;
  isLoading: boolean;
}

const SprintGameContent: FC<SprintGameProps> = ({
  seconds,
  answerCount,
  word,
  translate,
  disabledBtn,
  checkWord,
  isLoading,
}) => {
  useEffect(() => {
    const onKeypress = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') checkWord(true);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') checkWord(false);
    };

    document.addEventListener('keydown', onKeypress);

    return () => {
      document.removeEventListener('keydown', onKeypress);
    };
  }, [word]);

  if (isLoading) return <p>Loading....</p>;

  return (
    <ContentWrapper>
      <section>
        <div className={s.content}>
          <span className={s.content_timer}>{seconds}</span>
          <span className={s.content_counter}>Подряд: {answerCount}</span>
        </div>
        <div className={s.wordContainer}>
          <h2>{word || 'Слова закончились!'}</h2>
          <span>=</span>
          <h2>{translate || 'Перевод'}?</h2>
        </div>
      </section>
      <section className={s.button}>
        <Button
          className={s.button_true}
          disabled={disabledBtn}
          type="button"
          onClick={(): void => checkWord(true)}
        >
          Верно
        </Button>
        <Button
          className={s.button_false}
          disabled={disabledBtn}
          type="button"
          onClick={(): void => checkWord(false)}
        >
          Неверно
        </Button>
      </section>
    </ContentWrapper>
  );
};

export default SprintGameContent;
