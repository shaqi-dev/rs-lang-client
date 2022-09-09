import { FC } from 'react';
import { Word } from '../../interfaces/words';
import Button from '../Button';
import s from './SprintGameResult.module.scss';

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
  return (
    <div className={s.results}>
      <h3 className={s.list_title}>Не знаю {wrongCollection.length}</h3>
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
      </Button>
    </div>
  );
};

export default SprintGameResult;
