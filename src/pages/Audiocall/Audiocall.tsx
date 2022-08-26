import { FC, useState } from 'react';
import s from './Audiocall.module.scss';
import ContentWrapper from '../../layouts/ContentWrapper';
import AudiocallGame from '../../components/AudiocallGame';
// import { useGetWordsQuery } from '../../services/wordsApi';

const Audiocall: FC = () => {
  const [gameStarted, setGameStart] = useState(false);
  // const { data, error, isLoading } = useGetWordsQuery({ group: 0, page: 0 });

  return (
    <ContentWrapper className={s.audiocallWrapper}>
      {/* <button type="button" onClick={(): void => setGameStart(!gameStarted)}>
        {!gameStarted ? 'Start Game' : 'End Game'}
      </button> */}
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
