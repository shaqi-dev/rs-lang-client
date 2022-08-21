import { FC, useState } from 'react';
import s from './Audiocall.module.scss';
import ContentWrapper from '../../layouts/ContentWrapper';
import AudiocallGame from '../../components/AudiocallGame';

const Audiocall: FC = () => {
  const [gameStarted, setGameStart] = useState(false);

  return (
    <ContentWrapper className={s.audiocallWrapper}>
      {!gameStarted ? (
        <button type="button" onClick={(): void => setGameStart(!gameStarted)}>
          Start Game
        </button>
      ) : (
        <AudiocallGame />
      )}
    </ContentWrapper>
  );
};

export default Audiocall;
