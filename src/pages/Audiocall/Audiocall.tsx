import { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import s from './Audiocall.module.scss';
import ContentWrapper from '../../layouts/ContentWrapper';
import AudiocallGame from '../../components/AudiocallGame';
import AudiocallGroupList from '../../components/AudiocallGroupList';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  setAudiocallGroup,
  setAudiocallPage,
  setAudiocallCurrentWord,
  setAudiocallShouldContinue,
  setAudiocallAnswers,
  setAudiocallDisableAnswers,
  setAudiocallCorrectAnswers,
  setAudiocallWrongAnswers,
  selectAudiocallGroup,
  selectAudiocallPage,
  setAudiocallResultPage,
} from '../../store/audiocall/audiocallSlice';
import { selectCurrentGroup, selectCurrentPage } from '../../store/textbook/textbookSlice';
import wordsGroupNames from '../../shared/wordsGroupNames';

const Audiocall: FC = () => {
  const dispatch = useAppDispatch();
  const audiocallGroup = useAppSelector(selectAudiocallGroup);
  const audiocallPage = useAppSelector(selectAudiocallPage);
  const textbookGroup = useAppSelector(selectCurrentGroup);
  const textbookPage = useAppSelector(selectCurrentPage);

  const [gameStarted, setGameStart] = useState(false);

  let fromTextbook = false;
  const prevLocation = useLocation();
  const prevLocationState: { fromTextbook: boolean } | undefined = prevLocation.state as {
    fromTextbook: boolean;
  };

  if (prevLocationState && prevLocationState.fromTextbook) fromTextbook = true;

  const handleClickWordsGroupItem = (groupName: string): void => {
    const selectedGroup: number = wordsGroupNames.indexOf(groupName);

    if (audiocallGroup !== selectedGroup) {
      dispatch(setAudiocallGroup(selectedGroup));
      dispatch(setAudiocallPage(Math.floor(Math.random() * 30)));
    }
  };

  const tryAgain = (): void => {
    setGameStart(false);
  };

  const startGame = (): void => {
    dispatch(setAudiocallCurrentWord(0));
    dispatch(setAudiocallShouldContinue(false));
    dispatch(setAudiocallAnswers([]));
    dispatch(setAudiocallCorrectAnswers([]));
    dispatch(setAudiocallWrongAnswers([]));
    dispatch(setAudiocallDisableAnswers(false));
    dispatch(setAudiocallResultPage('pieChart'));
    if (fromTextbook) {
      dispatch(setAudiocallGroup(textbookGroup));
      dispatch(setAudiocallPage(textbookPage));
    }

    setGameStart(!gameStarted);
  };

  return (
    <ContentWrapper className={s.audiocallWrapper}>
      {!gameStarted ? (
        <div className={s.audiocallWrapper_groupsAndButton}>
          <h1>Audiocall Game</h1>
          {!fromTextbook && <AudiocallGroupList onClickItem={handleClickWordsGroupItem} />}
          <button className={s.startAudiocallButton} type="button" onClick={startGame}>
            Start Game
          </button>
        </div>
      ) : (
        <AudiocallGame
          selectedGroup={audiocallGroup}
          pageNumber={audiocallPage}
          tryAgain={tryAgain}
        />
      )}
    </ContentWrapper>
  );
};

export default Audiocall;
