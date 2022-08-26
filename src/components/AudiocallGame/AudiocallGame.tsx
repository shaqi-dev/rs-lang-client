import { FC, useState } from 'react';
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
  setAudiocallWrongAnswers,
  setAudiocallCorrectAnswers,
  selectAudiocallCurrentWord,
  selectAudiocallShouldContinue,
  selectAudiocallWrongAnswers,
  selectAudiocallCorrectAnswers,
} from '../../store/audiocall/audiocallSlice';
import AudiocallAnswerInfo from '../../interfaces/audiocallAnswerInfo';

const AudiocallGame: FC<{ selectedGroup: number; pageNumber: number }> = (props) => {
  const { selectedGroup, pageNumber } = props;
  const { data, error, isLoading } = useGetAudiocallWords(selectedGroup, pageNumber);
  const [answers, setAnswers] = useState<AudiocallAnswerInfo[]>([]);

  const dispatch = useAppDispatch();
  const currentWord = useAppSelector(selectAudiocallCurrentWord);
  const shouldContinue = useAppSelector(selectAudiocallShouldContinue);
  const correctAnswers = useAppSelector(selectAudiocallCorrectAnswers);
  const wrongAnswers = useAppSelector(selectAudiocallWrongAnswers);

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

    const chooseAnswer = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      const chosenAnswer: HTMLButtonElement = e.target as HTMLButtonElement;
      const allAnswers = document.querySelector('.audiocall-answers')?.querySelectorAll('button');

      allAnswers?.forEach((button) => {
        button.disabled = true;
      });

      if (chosenAnswer.textContent === data[currentWord].wordTranslate) {
        chosenAnswer.style.backgroundColor = 'green';

        dispatch(setAudiocallCorrectAnswers([...correctAnswers, data[Number(chosenAnswer.name)]]));
      } else {
        const wordId = data[currentWord].wordTranslate.replaceAll(' ', '-');
        const rightAnswer: HTMLButtonElement = document.querySelector(
          `#${wordId}`,
        ) as HTMLButtonElement;

        chosenAnswer.style.backgroundColor = 'red';
        rightAnswer.style.backgroundColor = 'green';

        dispatch(setAudiocallWrongAnswers([...wrongAnswers, data[Number(rightAnswer.name)]]));
      }

      dispatch(setAudiocallShouldContinue(true));
    };

    const continueGame = (): void => {
      const allAnswers = document.querySelector('.audiocall-answers')?.querySelectorAll('button');

      allAnswers?.forEach((button) => {
        button.disabled = false;
        button.style.backgroundColor = '';
      });

      dispatch(setAudiocallCurrentWord(currentWord + 1));
      dispatch(setAudiocallShouldContinue(false));
      setAnswers([]);
    };

    if (answers.length === 0 && currentWord < 10) generateAnswers();

    if (data && currentWord < 10) {
      return (
        <div>
          {shouldContinue ? (
            <AudiocallMeaning
              imageLink={`${API_BASE}/${data[currentWord].image}`}
              imageAlt={`${data[currentWord].word}`}
              currentWord={`${data[currentWord].word}`}
            />
          ) : null}
          <button type="button" onClick={playAudio}>
            Play Audio
          </button>
          <AudiocallAnswers answers={answers} chooseAnswer={chooseAnswer} />
          {shouldContinue ? (
            <button type="button" onClick={continueGame}>
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
