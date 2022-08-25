import { FC, useState } from 'react';
import s from './AudiocallGame.module.scss';
import { API_BASE } from '../../services/endpoints';
import useGetAudiocallWords from '../../hooks/useGetAudiocallWords';
import ErrorBanner from '../ErrorBanner';
import AudiocallAnswers from '../AudiocallAnswers';
import AudiocallMeaning from '../AudiocallMeaning';
import AudiocallResult from '../AudiocallResult';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  setAudiocallCurrentWord,
  setAudiocallShouldContinue,
  setAudiocallDisableAnswers,
  selectAudiocallCurrentWord,
  selectAudiocallShouldContinue,
  setAudiocallCorrectChoise,
  setAudiocallWrongChoise,
} from '../../store/audiocall/audiocallSlice';
import AudiocallAnswerInfo from '../../interfaces/audiocallAnswerInfo';

const AudiocallGame: FC<{ selectedGroup: number; pageNumber: number }> = (props) => {
  const { selectedGroup, pageNumber } = props;
  const { data, error, isLoading } = useGetAudiocallWords(selectedGroup, pageNumber);
  const [answers, setAnswers] = useState<AudiocallAnswerInfo[]>([]);

  const dispatch = useAppDispatch();
  const currentWord = useAppSelector(selectAudiocallCurrentWord);
  const shouldContinue = useAppSelector(selectAudiocallShouldContinue);

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
      dispatch(setAudiocallCurrentWord(currentWord + 1));
      dispatch(setAudiocallShouldContinue(false));
      dispatch(setAudiocallCorrectChoise(''));
      dispatch(setAudiocallWrongChoise(''));

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
          <AudiocallAnswers answers={answers} data={data} />
          {shouldContinue ? (
            <button type="button" onClick={continueGame} className={s.audiocallGame_continueButton}>
              Continue
            </button>
          ) : null}
        </div>
      );
    }

    if (currentWord === 10) {
      return <AudiocallResult />;
    }
  }

  return null;
};

export default AudiocallGame;
