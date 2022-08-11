import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { selectCount, increment, decrement } from '../../store/counter/counter.slice';
import s from './Counter.module.scss';

const Counter: FC = () => {
  const dispatch = useAppDispatch();
  const counter = useAppSelector(selectCount);

  const handleDecrease = (): void => {
    dispatch(decrement());
  };

  const handleIncrease = (): void => {
    dispatch(increment());
  };

  return (
    <div className={s.root}>
      <button type="button" className={s.button} onClick={handleDecrease}>
        -
      </button>
      {counter}
      <button type="button" className={s.button} onClick={handleIncrease}>
        +
      </button>
    </div>
  );
};

export default Counter;
