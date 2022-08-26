import { FC, useState } from 'react';
import { API_BASE } from '../../services/endpoints';
import { useGetWordsQuery } from '../../services/wordsApi';
import ErrorBanner from '../ErrorBanner';
import AudiocallAnswers from '../AudiocallAnswers';
import Button from '../Button';
import AudiocallMeaning from '../AudiocallMeaning';
import AudiocallResult from '../AudiocallResult';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  setAudiocallWrongAnswers,
  setAudiocallCorrectAnswers,
  selectAudiocallWrongAnswers,
  selectAudiocallCorrectAnswers,
} from '../../store/audiocall/audiocallSlice';

const AudiocallGame: FC<{ selectedGroup: number; pageNumber: number }> = (props) => {
  const { selectedGroup, pageNumber } = props;
  const { data, error, isLoading } = useGetWordsQuery({ group: selectedGroup, page: pageNumber });
  const [currentWord, setCurrentWord] = useState(0);
  const [answers, setAnswers] = useState<{ word: string; wordIndex: number }[]>([]);
  const [shouldContinue, setShouldContinue] = useState(false);
  const dispatch = useAppDispatch();
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

      const choices: { word: string; wordIndex: number }[] = [];
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

      setShouldContinue(true);
    };

    const continueGame = (): void => {
      const allAnswers = document.querySelector('.audiocall-answers')?.querySelectorAll('button');

      allAnswers?.forEach((button) => {
        button.disabled = false;
        button.style.backgroundColor = '';
      });

      setCurrentWord(currentWord + 1);
      setShouldContinue(false);
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
          <Button type="button" onClick={playAudio}>
            Play Audio
          </Button>
          <AudiocallAnswers answers={answers} chooseAnswer={chooseAnswer} />
          {shouldContinue ? (
            <Button type="button" onClick={continueGame}>
              Continue
            </Button>
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
