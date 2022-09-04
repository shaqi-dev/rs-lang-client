import { FC, useState } from 'react';
import SprintGameBegin from '../../components/SprintGameBegin';
import SprintGameContent from '../../components/SprintGameContent';
import SprintGameResult from '../../components/SprintGameResult';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import useGetGameWords from '../../hooks/useGetGameWords';
import { Word } from '../../interfaces/words';
import ContentWrapper from '../../layouts/ContentWrapper';
import wordsGroupNames from '../../shared/wordsGroupNames';
import {
  selectSprintCorrectAnswers,
  selectSprintGroup,
  selectSprintPage,
  selectSprintWrongAnswers,
  setSprintCorrectAnswers,
  setSprintGroup,
  setSprintPage,
  setSprintWrongAnswers,
} from '../../store/sprint/sprintSlice';
// import s from './SprintGame.module.scss';

const SprintGame: FC = () => {
  const dispatch = useAppDispatch();
  const [gameState, setGameState] = useState('gameBegin');
  const [seconds, setSeconds] = useState(30);
  const [iterator, setIterator] = useState(0);
  const [collection, setCollection] = useState<Word[]>([]);
  const [word, setWord] = useState<Word | null>(null);
  const [wordTranslate, setWordTranslate] = useState('');
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [answerCount, setAnswerCount] = useState(0);
  const sprintGroup = useAppSelector(selectSprintGroup);
  const sprintPage = useAppSelector(selectSprintPage);
  const correctAnswer = useAppSelector(selectSprintCorrectAnswers);
  const wrongAnswer = useAppSelector(selectSprintWrongAnswers);
  const data = useGetGameWords({ group: sprintGroup, page: sprintPage });
  const subPage = Math.floor(Math.random() * 30);
  const subCollection = useGetGameWords({ group: sprintGroup, page: subPage });

  async function updateCollection(): Promise<void> {
    if (data) {
      setCollection([...collection, ...data]);

      setWord(data[iterator]);
      setWordTranslate(data[Math.floor(Math.random() * data.length)].wordTranslate);
    }
  }

  function nextWord(): void {
    setIterator(iterator + 1);
    setWord(collection[iterator]);

    if (collection.length - 1 === iterator && subCollection) {
      setCollection([...collection, ...subCollection]);
    }
    if (collection.length === iterator) console.log(collection);

    if (Math.round(Math.random())) {
      setWordTranslate(collection[Math.floor(Math.random() * collection.length)].wordTranslate);
    } else {
      setWordTranslate(collection[iterator].wordTranslate);
    }
  }

  const checkWord = (answer: boolean): void => {
    if (
      (word?.wordTranslate === wordTranslate && answer) ||
      (word?.wordTranslate !== wordTranslate && !answer)
    ) {
      if (word) dispatch(setSprintCorrectAnswers([...correctAnswer, word]));
      setAnswerCount(answerCount + 1);
    }

    if (
      (word?.wordTranslate === wordTranslate && !answer) ||
      (word?.wordTranslate !== wordTranslate && answer)
    ) {
      if (word) dispatch(setSprintWrongAnswers([...wrongAnswer, word]));
      setAnswerCount(0);
    }

    nextWord();
  };

  function startTimer(): void {
    const countDown = new Date(new Date().getTime() + seconds * 1000).getTime();

    const timerId = setInterval(() => {
      const now = new Date().getTime();
      const dist = countDown - now;
      const sec = Math.floor((dist % (1000 * 60)) / 1000);
      setSeconds(sec);

      if (dist <= 0) {
        clearInterval(timerId);
        setSeconds(0);
        setDisabledBtn(true);
        setIterator(0);
        setGameState('gameResults');
      }
    }, 100);
  }

  const handleClickWordsGroupItem = (groupName: string): void => {
    const selectedGroup: number = wordsGroupNames.indexOf(groupName);

    if (sprintGroup !== selectedGroup) {
      dispatch(setSprintGroup(selectedGroup));
      dispatch(setSprintPage(Math.floor(Math.random() * 30)));
    }
  };

  const startPlay = async (): Promise<void> => {
    setDisabledBtn(false);
    await updateCollection();
    setIterator(iterator + 1);
    startTimer();
    setGameState('gameContent');
    dispatch(setSprintCorrectAnswers([]));
    dispatch(setSprintWrongAnswers([]));
  };

  const restartGame = (): void => {
    setGameState('gameBegin');
    setSeconds(30);
    setAnswerCount(0);
    setCollection([]);
    dispatch(setSprintPage(Math.floor(Math.random() * 30)));
  };

  return (
    <ContentWrapper>
      {gameState === 'gameBegin' && (
        <SprintGameBegin
          disabledBtn={disabledBtn}
          startPlay={startPlay}
          selectLevel={handleClickWordsGroupItem}
        />
      )}
      {gameState === 'gameContent' && (
        <SprintGameContent
          seconds={seconds}
          answerCount={answerCount}
          word={word?.word}
          translate={wordTranslate}
          disabledBtn={disabledBtn}
          checkWord={checkWord}
          isLoading={!!data}
        />
      )}
      {gameState === 'gameResults' && (
        <SprintGameResult
          correctCollection={correctAnswer}
          wrongCollection={wrongAnswer}
          restart={restartGame}
        />
      )}
    </ContentWrapper>
  );
};

export default SprintGame;
