import { FC, useState } from 'react';
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
} from '../../store/audiocall/audiocallSlice';
import wordsGroupNames from '../../shared/wordsGroupNames';

const Audiocall: FC = () => {
  const dispatch = useAppDispatch();
  const audiocallGroup = useAppSelector(selectAudiocallGroup);
  const audiocallPage = useAppSelector(selectAudiocallPage);

  const [gameStarted, setGameStart] = useState(false);

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

    setGameStart(!gameStarted);
  };

  return (
    <ContentWrapper className={s.audiocallWrapper}>
      {!gameStarted ? (
        <div className={s.audiocallWrapper_groupsAndButton}>
          <h1>Audiocall Game</h1>
          <AudiocallGroupList onClickItem={handleClickWordsGroupItem} />
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
