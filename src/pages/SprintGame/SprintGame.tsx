/* eslint-disable no-underscore-dangle */
import { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SprintGameBegin from '../../components/SprintGameBegin';
import SprintGameContent from '../../components/SprintGameContent';
import SprintGameResult from '../../components/SprintGameResult';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import useGetGameWords from '../../hooks/useGetGameWords';
import { AggregatedWord } from '../../interfaces/userAggregatedWords';
import { Word } from '../../interfaces/words';
import ContentWrapper from '../../layouts/ContentWrapper';
import wordsGroupNames from '../../shared/wordsGroupNames';
import shuffleArray from '../../shared/shuffleArray';
import { selectCurrentUserId } from '../../store/auth/authSlice';
import {
  // clearStats,
  selectSprintCorrectAnswers,
  selectSprintGroup,
  selectSprintPage,
  selectSprintWrongAnswers,
  selectStats,
  setSprintCorrectAnswers,
  setSprintGroup,
  setSprintPage,
  setSprintWrongAnswers,
  setStats,
} from '../../store/sprint/sprintSlice';
import { selectCurrentGroup, selectCurrentPage } from '../../store/textbook/textbookSlice';
import UserWordDifficulty from '../../shared/enums/UserWordDifficulty';
import { MutateUserWordBody } from '../../interfaces/userWords';
// import getCurrentDate from '../../shared/getCurrentDate';
import { GameStatsShort } from '../../interfaces/statistics';
import { useCreateUserWordMutation, useUpdateUserWordMutation } from '../../services/userWordsApi';

// import s from './SprintGame.module.scss';

const SprintGame: FC = () => {
  const dispatch = useAppDispatch();

  const [gameState, setGameState] = useState<string>('gameBegin');
  const [disabledBtn, setDisabledBtn] = useState<boolean>(true);
  let isStart = false;

  const [seconds, setSeconds] = useState<number>(30);
  const [iterator, setIterator] = useState<number>(0);
  const [answerCount, setAnswerCount] = useState<number>(0);

  const [collection, setCollection] = useState<Word[] | AggregatedWord[]>([]);
  const [word, setWord] = useState<Word | AggregatedWord | null>(null);
  const [wordTranslate, setWordTranslate] = useState<string>('');

  const [updateUserWord] = useUpdateUserWordMutation();
  const [createUserWord] = useCreateUserWordMutation();
  const prevStats = useAppSelector(selectStats);

  const sprintGroup = useAppSelector(selectSprintGroup);
  const sprintPage = useAppSelector(selectSprintPage);
  const correctAnswer = useAppSelector(selectSprintCorrectAnswers);
  const wrongAnswer = useAppSelector(selectSprintWrongAnswers);

  const userId = useAppSelector(selectCurrentUserId);
  const textbookGroup = useAppSelector(selectCurrentGroup);
  const textbookPage = useAppSelector(selectCurrentPage);

  // const [currentChoise, setCurrentChoise] = useState<Word | AggregatedWord | null>(null);
  const [currentWinStreak, setCurrentWinStreak] = useState<number>(0);

  // const stats = useAppSelector(selectStats);
  // const currentDate = getCurrentDate();

  let fromTextbook = false;
  const prevLocation = useLocation();
  const prevLocationState: { fromTextbook: boolean } | undefined = prevLocation.state as {
    fromTextbook: boolean;
  };

  if (prevLocationState && prevLocationState.fromTextbook) fromTextbook = true;

  const group = fromTextbook ? textbookGroup : sprintGroup;
  const page = fromTextbook ? textbookPage : sprintPage;

  const data = useGetGameWords({
    group,
    page,
    userId,
    fromTextbook,
  });

  const subCollection = useGetGameWords({
    group,
    page: page === 30 ? page - 1 : page + 1,
  });

  // FUNCTION FOR UODATE COLLECTION OF WORDS
  async function updateCollection(): Promise<void> {
    if (data) {
      const shuffleData = shuffleArray([...data]);
      setCollection([...collection, ...shuffleData]);

      setWord(shuffleData[iterator]);
      if (shuffleData.length > 0)
        setWordTranslate(shuffleData[Math.floor(Math.random() * data.length)].wordTranslate);
    }
  }

  // // SPRINT GAME STATS
  const evaluateAnswer = async (
    selectWord: Word | AggregatedWord,
    isCorrect: boolean,
  ): Promise<void> => {
    if (isCorrect) {
      setCurrentWinStreak(currentWinStreak + 1);
    } else {
      setCurrentWinStreak(0);
    }

    if (userId) {
      const wordId = selectWord._id;

      if ('userWord' in selectWord && selectWord.userWord) {
        const { difficulty: prevDifficulty, optional } = selectWord.userWord;
        const audiocall = optional?.games?.audiocall || undefined;
        const sprint = optional?.games?.sprint || undefined;

        const prevCorrectAnswers: number = sprint?.correctAnswers || 0;
        const prevIncorrectAnswers: number = sprint?.incorrectAnswers || 0;
        const prevWinStreak: number = sprint?.winStreak || 0;

        const correctAnswers = isCorrect ? prevCorrectAnswers + 1 : prevCorrectAnswers;
        const incorrectAnswers = !isCorrect ? prevIncorrectAnswers + 1 : prevIncorrectAnswers;
        const winStreak = isCorrect ? prevWinStreak + 1 : 0;
        let learned = optional?.learned || false;

        if (learned && !isCorrect) {
          learned = false;
        } else if (!learned && isCorrect) {
          learned =
            (prevDifficulty === UserWordDifficulty.HARD && winStreak >= 5) ||
            (prevDifficulty === UserWordDifficulty.DEFAULT && winStreak >= 3) ||
            false;
        }

        const body: MutateUserWordBody = {
          difficulty: learned ? UserWordDifficulty.DEFAULT : prevDifficulty,
          optional: {
            learned,
            games: {
              audiocall,
              sprint: {
                correctAnswers,
                incorrectAnswers,
                winStreak,
              },
            },
          },
        };

        // if (isCorrect) console.log(currentWinStreak + 1, prevStats.longestWinStreak);

        await updateUserWord({ userId, wordId, body });

        const stats: GameStatsShort = {
          ...prevStats,
          learnedWords: learned ? prevStats.learnedWords + 1 : prevStats.learnedWords,
          longestWinStreak:
            isCorrect && currentWinStreak + 1 > prevStats.longestWinStreak
              ? prevStats.longestWinStreak + 1
              : prevStats.longestWinStreak,
          correctAnswers: isCorrect ? prevStats.correctAnswers + 1 : prevStats.correctAnswers,
          incorrectAnswers: !isCorrect
            ? prevStats.incorrectAnswers + 1
            : prevStats.incorrectAnswers,
        };

        dispatch(setStats(stats));
      } else {
        const body: MutateUserWordBody = {
          difficulty: UserWordDifficulty.DEFAULT,
          optional: {
            learned: false,
            games: {
              sprint: {
                correctAnswers: isCorrect ? 1 : 0,
                incorrectAnswers: !isCorrect ? 1 : 0,
                winStreak: isCorrect ? 1 : 0,
              },
            },
          },
        };

        await createUserWord({ userId, wordId, body });

        // if (isCorrect) console.log(currentWinStreak + 1, prevStats.longestWinStreak);

        const stats: GameStatsShort = {
          ...prevStats,
          newWords: prevStats.newWords + 1,
          longestWinStreak:
            isCorrect && currentWinStreak + 1 > prevStats.longestWinStreak
              ? prevStats.longestWinStreak + 1
              : prevStats.longestWinStreak,
          correctAnswers: isCorrect ? prevStats.correctAnswers + 1 : prevStats.correctAnswers,
          incorrectAnswers: !isCorrect
            ? prevStats.incorrectAnswers + 1
            : prevStats.incorrectAnswers,
        };

        dispatch(setStats(stats));
      }
    }
  };

  // NEXT WORD
  function nextWord(): void {
    setIterator(iterator + 1);
    setWord(collection[iterator]);

    if (iterator >= 19 && fromTextbook) setIterator(0);

    if (iterator === 19 && subCollection && !fromTextbook) {
      setCollection([...collection, ...subCollection]);
    }

    if (Math.round(Math.random())) {
      setWordTranslate(collection[Math.floor(Math.random() * collection.length)].wordTranslate);
    } else {
      setWordTranslate(collection[iterator].wordTranslate);
    }
  }

  // CHECK ANSWER
  const checkWord = (answer: boolean): void => {
    if (!word) return;

    if (
      (word?.wordTranslate === wordTranslate && answer) ||
      (word?.wordTranslate !== wordTranslate && !answer)
    ) {
      if (word && !correctAnswer.includes(word))
        dispatch(setSprintCorrectAnswers([...correctAnswer, word]));
      setAnswerCount(answerCount + 1);
      evaluateAnswer(word, true);
    }

    if (
      (word?.wordTranslate === wordTranslate && !answer) ||
      (word?.wordTranslate !== wordTranslate && answer)
    ) {
      if (word && !wrongAnswer.includes(word))
        dispatch(setSprintWrongAnswers([...wrongAnswer, word]));
      setAnswerCount(0);
      evaluateAnswer(word, false);
    }

    nextWord();
  };

  // TIMER FUNCTION
  function startTimer(): void {
    if (isStart) return;
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
        setGameState('gameResults');
      }
    }, 100);
  }

  // SELECT LEVEL
  const handleClickWordsGroupItem = (groupName: string): void => {
    const selectedGroup: number = wordsGroupNames.indexOf(groupName);

    if (sprintGroup !== selectedGroup) {
      dispatch(setSprintGroup(selectedGroup));
      dispatch(setSprintPage(Math.floor(Math.random() * 30)));
    }
  };

  // START GAME
  const startPlay = async (): Promise<void> => {
    // setDisabledBtn(false);
    await updateCollection();
    setIterator(iterator + 1);
    startTimer();
    setGameState('gameContent');
    dispatch(setSprintCorrectAnswers([]));
    dispatch(setSprintWrongAnswers([]));
    isStart = !isStart;
  };

  // RESTART GAME
  const restartGame = (): void => {
    setGameState('gameBegin');
    setSeconds(30);
    setIterator(0);
    setAnswerCount(0);
    setCollection([]);
    dispatch(setSprintPage(Math.floor(Math.random() * 30)));
    isStart = !isStart;
  };

  return (
    <ContentWrapper>
      {gameState === 'gameBegin' && (
        <SprintGameBegin
          disabledBtn={disabledBtn}
          startPlay={startPlay}
          selectLevel={handleClickWordsGroupItem}
          fromTextbook={fromTextbook}
          load={!!data}
        />
      )}
      {gameState === 'gameContent' && (
        <SprintGameContent
          seconds={seconds}
          answerCount={answerCount}
          word={word?.word}
          translate={wordTranslate}
          // disabledBtn={disabledBtn}
          checkWord={checkWord}
          // isLoading={!!data}
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
