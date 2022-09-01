import { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import s from './Audiocall.module.scss';
import ContentWrapper from '../../layouts/ContentWrapper';
import AudiocallGame from '../../components/AudiocallGame';
import AudiocallGroupList from '../../components/AudiocallGroupList';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  setAudiocallShouldContinue,
  setAudiocallAnswers,
  setAudiocallDisableAnswers,
  setAudiocallCorrectAnswers,
  setAudiocallWrongAnswers,
  setAudiocallResultPage,
} from '../../store/audiocall/audiocallSlice';
import { selectCurrentGroup, selectCurrentPage } from '../../store/textbook/textbookSlice';
import wordsGroupNames from '../../shared/wordsGroupNames';

const Audiocall: FC = () => {
  const dispatch = useAppDispatch();

  const textbookGroup = useAppSelector(selectCurrentGroup);
  const textbookPage = useAppSelector(selectCurrentPage);

  const [gameStarted, setGameStart] = useState(false);
  const [audiocallGroup, setAudiocallGroup] = useState(0);
  const [audiocallPage, setAudiocallPage] = useState(0);

  let fromTextbook = false;
  const prevLocation = useLocation();
  const prevLocationState: { fromTextbook: boolean } | undefined = prevLocation.state as {
    fromTextbook: boolean;
  };

  if (prevLocationState && prevLocationState.fromTextbook) fromTextbook = true;

  const handleClickWordsGroupItem = (groupName: string): void => {
    const selectedGroup: number = wordsGroupNames.indexOf(groupName);

    if (audiocallGroup !== selectedGroup) {
      setAudiocallGroup(selectedGroup);
      setAudiocallPage(Math.floor(Math.random() * 30));
    }
  };

  const tryAgain = (): void => {
    setGameStart(false);
  };

  const startGame = (): void => {
    dispatch(setAudiocallShouldContinue(false));
    dispatch(setAudiocallAnswers([]));
    dispatch(setAudiocallCorrectAnswers([]));
    dispatch(setAudiocallWrongAnswers([]));
    dispatch(setAudiocallDisableAnswers(false));
    dispatch(setAudiocallResultPage('pieChart'));

    setGameStart(!gameStarted);
  };

  return (
    <ContentWrapper className={s.audiocallWrapper}>
      {!gameStarted ? (
        <div className={s.audiocallWrapper_groupsAndButton}>
          <h1>Audiocall Game</h1>
          {!fromTextbook && (
            <AudiocallGroupList
              onClickItem={handleClickWordsGroupItem}
              activeGroup={audiocallGroup}
            />
          )}
          <button className={s.startAudiocallButton} type="button" onClick={startGame}>
            Start Game
          </button>
        </div>
      ) : (
        <AudiocallGame
          group={fromTextbook ? textbookGroup : audiocallGroup}
          page={fromTextbook ? textbookPage : audiocallPage}
          tryAgain={tryAgain}
          fromTextbook={fromTextbook}
        />
      )}
    </ContentWrapper>
  );
};

export default Audiocall;
