import { FC } from 'react';
// import wordsGroupNames from '../../shared/wordsGroupNames';
import Button from '../Button';
import SprintGroupList from '../SprintGroupList';
import s from './SprintGameBegin.module.scss';

export interface SprintGameBeginProps {
  disabledBtn: boolean;
  startPlay: () => void;
  selectLevel: (level: string) => void;
  fromTextbook: boolean;
  load: boolean;
}

const SprintGameBegin: FC<SprintGameBeginProps> = ({
  disabledBtn,
  startPlay,
  selectLevel,
  fromTextbook,
  load,
}) => {
  return (
    <>
      <section className={s.rules}>
        <h2 className={s.gameTitle}>Спринт</h2>
        <p className={s.gameRules}>
          <span> Спринт - игра на скорость</span> Попытайтесь указать правильный перевод как можно
          чаще.
        </p>
      </section>
      <section className={s.selectLevel}>
        {!fromTextbook && <h3 className={s.selectLevel_title}>Cложность:</h3>}
        {!fromTextbook && <SprintGroupList onClickItem={selectLevel} />}
        {load && (
          <Button
            className={s.selectLevel_btn}
            disabled={disabledBtn}
            type="button"
            onClick={startPlay}
          >
            Начать!
          </Button>
        )}
      </section>
    </>
  );
};

export default SprintGameBegin;
