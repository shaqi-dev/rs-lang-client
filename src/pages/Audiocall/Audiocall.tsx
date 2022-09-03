import { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import s from './Audiocall.module.scss';
import ContentWrapper from '../../layouts/ContentWrapper';
import AudiocallGame from '../../components/AudiocallGame';
import AudiocallGroupList from '../../components/AudiocallGroupList';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  setShouldContinue,
  setAnswers,
  setDisableAnswers,
  setCorrectAnswers,
  setWrongAnswers,
  setResultPage,
} from '../../store/audiocall/audiocallSlice';
import { selectCurrentGroup, selectCurrentPage } from '../../store/textbook/textbookSlice';
import wordsGroupNames from '../../shared/wordsGroupNames';
import { AudiocallResultPage } from '../../interfaces/AudiocallState';
import useGetGameWords from '../../hooks/useGetGameWords';
import { selectCurrentUserId } from '../../store/auth/authSlice';

const Audiocall: FC = () => {
  const dispatch = useAppDispatch();

  const userId = useAppSelector(selectCurrentUserId);
  const textbookGroup = useAppSelector(selectCurrentGroup);
  const textbookPage = useAppSelector(selectCurrentPage);

  const [gameStarted, setGameStart] = useState(false);
  const [audiocallGroup, setAudiocallGroup] = useState(0);
  const [audiocallPage, setAudiocallPage] = useState(Math.floor(Math.random() * 30));

  let fromTextbook = false;
  const prevLocation = useLocation();
  const prevLocationState: { fromTextbook: boolean } | undefined = prevLocation.state as {
    fromTextbook: boolean;
  };

  if (prevLocationState && prevLocationState.fromTextbook) fromTextbook = true;

  const group = fromTextbook ? textbookGroup : audiocallGroup;
  const page = fromTextbook ? textbookPage : audiocallPage;
  const data = useGetGameWords({ group, page, userId, fromTextbook });

  const handleClickWordsGroupItem = (groupName: string): void => {
    const selectedGroup: number = wordsGroupNames.indexOf(groupName);

    setAudiocallGroup(selectedGroup);
    setAudiocallPage(Math.floor(Math.random() * 30));
  };

  const tryAgain = (): void => {
    setGameStart(false);
  };

  const startGame = (): void => {
    dispatch(setShouldContinue(false));
    dispatch(setAnswers([]));
    dispatch(setCorrectAnswers([]));
    dispatch(setWrongAnswers([]));
    dispatch(setDisableAnswers(false));
    dispatch(setResultPage(AudiocallResultPage.PIE_CHART));

    setGameStart(!gameStarted);

    console.log(data);
  };

  return (
    <ContentWrapper className={s.audiocallWrapper}>
      {!gameStarted && (
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
      )}
      {gameStarted && data && <AudiocallGame data={data} tryAgain={tryAgain} />}
    </ContentWrapper>
  );
};

export default Audiocall;
