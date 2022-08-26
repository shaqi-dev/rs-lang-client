import { FC, useState } from 'react';
import { useGetWordsQuery } from '../../services/wordsApi';
import ErrorBanner from '../ErrorBanner';
import AudiocallAnswers from '../AudiocallAnswers';
import { API_BASE } from '../../services/endpoints';

const AudiocallGame: FC = () => {
  const { data, error, isLoading } = useGetWordsQuery({ group: 0, page: 0 });
  const [currentWord, setCurrentWord] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [shouldContinue, setShouldContinue] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<HTMLButtonElement>();
  const [wrongAnswer, setWrongAnswer] = useState<HTMLButtonElement>();

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

      const choices: string[] = [];
      const correctAnswerIndex: number = Math.floor(Math.random() * 5);

      for (let i = 0; i < 4; i += 1) {
        const index: number = Math.floor(Math.random() * data.length);

        if (
          choices.indexOf(data[index].wordTranslate) !== -1 ||
          data[currentWord].wordTranslate === data[index].wordTranslate
        ) {
          i -= 1;
        } else choices.push(data[index].wordTranslate);
      }

      choices.splice(correctAnswerIndex, 0, data[currentWord].wordTranslate);

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
      } else {
        setWrongAnswer(chosenAnswer);
        setCorrectAnswer(
          document.querySelector(`#${data[currentWord].wordTranslate}`) as HTMLButtonElement,
        );

        chosenAnswer.style.backgroundColor = 'red';
        if (correctAnswer) correctAnswer.style.backgroundColor = 'green';
      }

      setShouldContinue(true);
    };

    const continueGame = (): void => {
      const allAnswers = document.querySelector('.audiocall-answers')?.querySelectorAll('button');

      allAnswers?.forEach((button) => {
        button.disabled = false;
      });

      if (wrongAnswer) wrongAnswer.style.backgroundColor = '';
      if (correctAnswer) correctAnswer.style.backgroundColor = '';

      setCurrentWord(currentWord + 1);
      setShouldContinue(false);
      setAnswers([]);
    };

    if (answers.length === 0 && currentWord < 10) generateAnswers();

    if (data && currentWord < 10) {
      return (
        <div>
          <button type="button" onClick={playAudio}>
            Play Audio
          </button>
          <div className="audiocall-answers">
            <AudiocallAnswers answers={answers} chooseAnswer={chooseAnswer} />
          </div>
          {shouldContinue ? (
            <button type="button" onClick={continueGame}>
              Continue
            </button>
          ) : null}
        </div>
      );
    }

    if (currentWord === 10) {
      return <p>Thats it!</p>;
    }
  }

  return null;
};

export default AudiocallGame;
