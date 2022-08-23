import { FC, useState } from 'react';
import s from './Audiocall.module.scss';
import ContentWrapper from '../../layouts/ContentWrapper';
import AudiocallGame from '../../components/AudiocallGame';
import WordsGroupList from '../../components/WordsGroupList';

const Audiocall: FC = () => {
  const [gameStarted, setGameStart] = useState(false);
  const [selectedGroup, setGroup] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(0);

  const handleClickWordsGroupItem = (groupName: string): void => {
    setGroup(Number(groupName[1]));
    setPageNumber(Math.floor(Math.random() * 30));
  };

  return (
    <ContentWrapper className={s.audiocallWrapper}>
      {!gameStarted ? (
        <>
          <WordsGroupList onClickItem={handleClickWordsGroupItem} />
          <button type="button" onClick={(): void => setGameStart(!gameStarted)}>
            Start Game
          </button>
        </>
      ) : (
        <AudiocallGame selectedGroup={selectedGroup} pageNumber={pageNumber} />
      )}
    </ContentWrapper>
  );
};

export default Audiocall;
