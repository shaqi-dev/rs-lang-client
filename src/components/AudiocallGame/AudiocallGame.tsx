import { FC, useEffect, useState, useCallback } from 'react';
import s from './AudiocallGame.module.scss';
import { API_BASE } from '../../services/endpoints';
import useGetGameWords from '../../hooks/useGetGameWords';
import ErrorBanner from '../ErrorBanner';
import AudiocallAnswers from '../AudiocallAnswers';
import AudiocallMeaning from '../AudiocallMeaning';
import AudiocallResult from '../AudiocallResult';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  setShouldContinue,
  setDisableAnswers,
  selectShouldContinue,
} from '../../store/audiocall/audiocallSlice';
import { selectCurrentUserId } from '../../store/auth/authSlice';
import { AggregatedWord } from '../../interfaces/userAggregatedWords';
import { Word } from '../../interfaces/words';
import shuffleArray from '../../shared/shuffleArray';

export interface AudiocallGameProps {
  group: number;
  page: number;
  tryAgain: () => void;
  fromTextbook: boolean;
}

const AudiocallGame: FC<AudiocallGameProps> = ({ group, page, tryAgain, fromTextbook }) => {
  const dispatch = useAppDispatch();

  const shouldContinue = useAppSelector(selectShouldContinue);
  const userId = useAppSelector(selectCurrentUserId);

  const [wordsCounter, setWordsCounter] = useState(0);
  const [currentCorrectAnswer, setCurrentCorrectAnswer] = useState<Word | AggregatedWord>();
  const [currentAnswers, setCurrentAnswers] = useState<Word[] | AggregatedWord[]>([]);
  const [usedWordsIds, setUsedWordsIds] = useState<string[]>([]);

  const { data, error, isLoading } = useGetGameWords({ group, page, userId, fromTextbook });

  const playAudio = useCallback((): void => {
    if (currentCorrectAnswer) {
      const audioSource = `${API_BASE}/${currentCorrectAnswer.audio}`;
      const audio = new Audio(audioSource);
      audio.play();
    }
  }, [currentCorrectAnswer]);

  const generateNextCorrectAnswer = useCallback((): void => {
    if (data) {
      let nextWord = data[Math.floor(Math.random() * data.length)];
      let wordId = userId ? nextWord._id : nextWord.id;

      while (usedWordsIds.includes(wordId)) {
        nextWord = data[Math.floor(Math.random() * data.length)];
        wordId = userId ? nextWord._id : nextWord.id;
      }

      setCurrentCorrectAnswer(nextWord);
      setWordsCounter(wordsCounter + 1);
    }
  }, [data, usedWordsIds, userId, wordsCounter]);

  const generateNextFakeAnswers = useCallback((): void => {
    if (data && currentCorrectAnswer) {
      const answers: Word[] | AggregatedWord[] = [];

      for (let i = 0; i < 4; ) {
        const randomIndex: number = Math.floor(Math.random() * data.length);
        const currentWord = data[randomIndex];
        const wordId = userId ? currentWord._id : currentWord.id;

        if (
          currentCorrectAnswer.word !== currentWord.word &&
          !answers.includes(currentWord) &&
          !usedWordsIds.includes(wordId)
        ) {
          answers.push(data[randomIndex]);
          i += 1;
        }
      }

      const mixedWithCorrect = shuffleArray<Word | AggregatedWord>([
        ...answers,
        currentCorrectAnswer,
      ]);

      const currentCoorectWordId = userId ? currentCorrectAnswer._id : currentCorrectAnswer.id;

      setUsedWordsIds([...usedWordsIds, currentCoorectWordId]);
      setCurrentAnswers([...mixedWithCorrect]);
    }
  }, [currentCorrectAnswer, data, usedWordsIds, userId]);

  useEffect(() => {
    if (wordsCounter < 11) {
      generateNextFakeAnswers();
      playAudio();
    }
  }, [currentCorrectAnswer, wordsCounter, playAudio]);

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    if ('status' in error) {
      const errorMessage = 'error' in error ? error.error : JSON.stringify(error.data);
      return <ErrorBanner>An error has occurred: {errorMessage}</ErrorBanner>;
    }
    return <ErrorBanner>{error.message}</ErrorBanner>;
  }

  const handleContinueGame = (): void => {
    dispatch(setDisableAnswers(false));
    dispatch(setShouldContinue(false));
    generateNextCorrectAnswer();
  };

  const handleTryAgain = (): void => {
    tryAgain();
    setUsedWordsIds([]);
    setWordsCounter(0);
  };

  if (data) {
    if (wordsCounter === 0) {
      generateNextCorrectAnswer();
    }

    if (currentCorrectAnswer && wordsCounter < 11) {
      return (
        <div className={s.audiocallGame}>
          <AudiocallMeaning
            imageLink={`${API_BASE}/${currentCorrectAnswer.image}`}
            imageAlt={`${currentCorrectAnswer.word}`}
            currentWord={`${currentCorrectAnswer.word}`}
            playAudio={playAudio}
          />
          <AudiocallAnswers
            currentAnswers={currentAnswers}
            currentCorrectAnswer={currentCorrectAnswer}
          />
          {shouldContinue ? (
            <button
              type="button"
              onClick={handleContinueGame}
              className={s.audiocallGame_continueButton}
            >
              Continue
            </button>
          ) : null}
        </div>
      );
    }

    if (wordsCounter === 11) {
      return (
        <>
          <AudiocallResult />
          <button type="button" onClick={handleTryAgain} className={s.tryAgainButton}>
            Try Again
          </button>
        </>
      );
    }
  }

  return null;
};

export default AudiocallGame;
