import { FC, useState } from 'react';
import s from './AudiocallGame.module.scss';
import { API_BASE } from '../../services/endpoints';
import useGetGameWords from '../../hooks/useGetGameWords';
import ErrorBanner from '../ErrorBanner';
import AudiocallAnswers from '../AudiocallAnswers';
import AudiocallMeaning from '../AudiocallMeaning';
import AudiocallResult from '../AudiocallResult';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  setAudiocallShouldContinue,
  setAudiocallDisableAnswers,
  selectAudiocallShouldContinue,
} from '../../store/audiocall/audiocallSlice';
import AudiocallAnswerInfo from '../../interfaces/audiocallAnswerInfo';
import AudiocallGameProps from '../../interfaces/AudiocallGameProps';
import { selectCurrentUserId } from '../../store/auth/authSlice';

const AudiocallGame: FC<AudiocallGameProps> = (props) => {
  const { group, page, tryAgain, fromTextbook } = props;

  const [currentWord, setCurrentWord] = useState(0);

  const dispatch = useAppDispatch();

  const shouldContinue = useAppSelector(selectAudiocallShouldContinue);
  const userId = useAppSelector(selectCurrentUserId);

  const { data, error, isLoading } = useGetGameWords(
    group,
    page,
    fromTextbook,
    userId,
    'audiocall',
  );
  const [answers, setAnswers] = useState<AudiocallAnswerInfo[]>([]);

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    if ('status' in error) {
      const errorMessage = 'error' in error ? error.error : JSON.stringify(error.data);

      return <ErrorBanner>An error has occurred: {errorMessage}</ErrorBanner>;
    }

    return <ErrorBanner>{error.message}</ErrorBanner>;
  }

  if (data) {
    const playAudio = (): void => {
      const audioSource = `${API_BASE}/${data[currentWord].audio}`;
      const audio = new Audio(audioSource);
      audio.play();
    };

    const generateAnswers = (): void => {
      playAudio();

      const choices: AudiocallAnswerInfo[] = [];
      const pushedChoices: string[] = [];
      const correctAnswerIndex: number = Math.floor(Math.random() * 5);

      for (let i = 0; i < 4; i += 1) {
        const index: number = Math.floor(Math.random() * data.length);

        if (
          pushedChoices.indexOf(data[index].wordTranslate) !== -1 ||
          data[currentWord].wordTranslate === data[index].wordTranslate
        ) {
          i -= 1;
        } else {
          choices.push({ word: data[index].wordTranslate, wordIndex: index });
          pushedChoices.push(data[index].wordTranslate);
        }
      }

      choices.splice(correctAnswerIndex, 0, {
        word: data[currentWord].wordTranslate,
        wordIndex: currentWord,
      });

      setAnswers([...choices]);
    };

    const continueGame = (): void => {
      dispatch(setAudiocallDisableAnswers(false));
      dispatch(setAudiocallShouldContinue(false));

      setCurrentWord(currentWord + 1);
      setAnswers([]);
    };

    if (answers.length === 0 && currentWord < 10) generateAnswers();

    if (data && currentWord < 10) {
      return (
        <div className={s.audiocallGame}>
          <AudiocallMeaning
            imageLink={`${API_BASE}/${data[currentWord].image}`}
            imageAlt={`${data[currentWord].word}`}
            currentWord={`${data[currentWord].word}`}
            playAudio={playAudio}
          />
          <AudiocallAnswers data={data} answers={answers} currentWord={currentWord} />
          {shouldContinue ? (
            <button type="button" onClick={continueGame} className={s.audiocallGame_continueButton}>
              Continue
            </button>
          ) : null}
        </div>
      );
    }

    if (currentWord === 10) {
      return (
        <>
          <AudiocallResult />
          <button type="button" onClick={tryAgain} className={s.tryAgainButton}>
            Try Again
          </button>
        </>
      );
    }
  }

  return null;
};

export default AudiocallGame;
