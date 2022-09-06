import { FC, useState, useEffect } from 'react';
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
import { AudiocallResultPage } from '../../interfaces/audiocallState';
import useGetGameWords from '../../hooks/useGetGameWords';
import { selectCurrentUserId } from '../../store/auth/authSlice';

const Audiocall: FC = () => {
  const dispatch = useAppDispatch();

  const userId = useAppSelector(selectCurrentUserId);
  const textbookGroup = useAppSelector(selectCurrentGroup);
  const textbookPage = useAppSelector(selectCurrentPage);

  const [gameStarted, setGameStart] = useState(false);
  const [audiocallGroup, setAudiocallGroup] = useState(0);
  const [audiocallPage, setAudiocallPage] = useState(0);
  const [fakePage, setFakePage] = useState(0);

  let fromTextbook = false;
  const prevLocation = useLocation();
  const prevLocationState: { fromTextbook: boolean } | undefined = prevLocation.state as {
    fromTextbook: boolean;
  };

  if (prevLocationState && prevLocationState.fromTextbook) fromTextbook = true;

  const group = fromTextbook ? textbookGroup : audiocallGroup;
  const page = fromTextbook ? textbookPage : audiocallPage;
  const data = useGetGameWords({ group, page, userId, fromTextbook });
  const fakeData = useGetGameWords({ group, page: fakePage, userId });

  useEffect(() => {
    setAudiocallPage(Math.floor(Math.random() * 30));
    setFakePage(Math.floor(Math.random() * 30));
  }, [group, userId, fromTextbook]);

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
  };

  return (
    <ContentWrapper className={s.audiocallWrapper}>
      {!gameStarted && (
        <div className={s.audiocallWrapper_groupsAndButton}>
          <div className={s.gameDescription}>
            <h1 className={s.name}>Аудиовызов</h1>
            <p className={s.description}>
              Тренирует слуховое восприятие и улучшает понимание речи.
            </p>
          </div>
          {!fromTextbook && (
            <div className={s.groupContent}>
              <p className={s.groupText}>Выбери уровень сложности:</p>
              <AudiocallGroupList
                onClickItem={handleClickWordsGroupItem}
                activeGroup={audiocallGroup}
              />
            </div>
          )}
          <button
            className={s.startAudiocallButton}
            type="button"
            onClick={startGame}
            disabled={!data || !data.length}
          >
            Начать
          </button>
        </div>
      )}
      {gameStarted && data && fakeData && (
        <AudiocallGame data={data} fakeData={fakeData} tryAgain={tryAgain} />
      )}
    </ContentWrapper>
  );
};

export default Audiocall;
