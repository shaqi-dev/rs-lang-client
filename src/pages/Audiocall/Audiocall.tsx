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

  const startGame = (): void => {
    dispatch(setAudiocallCurrentWord(0));
    dispatch(setAudiocallShouldContinue(false));
    dispatch(setAudiocallAnswers([]));
    dispatch(setAudiocallCorrectAnswers([]));
    dispatch(setAudiocallWrongAnswers([]));

    setGameStart(!gameStarted);
  };

  return (
    <ContentWrapper className={s.audiocallWrapper}>
      {!gameStarted ? (
        <>
          <AudiocallGroupList onClickItem={handleClickWordsGroupItem} />
          <button type="button" onClick={startGame}>
            Start Game
          </button>
        </>
      ) : (
        <AudiocallGame selectedGroup={audiocallGroup} pageNumber={audiocallPage} />
      )}
    </ContentWrapper>
  );
};

export default Audiocall;
