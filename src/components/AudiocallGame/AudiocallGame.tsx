import { FC, useState } from 'react';
import { useGetWordsQuery } from '../../services/wordsApi';
import ErrorBanner from '../ErrorBanner';
import AudiocallAnswers from '../AudiocallAnswers';

const AudiocallGame: FC = () => {
  const { data, error, isLoading } = useGetWordsQuery({ group: 0, page: 0 });
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [shouldContinue, setShouldContinue] = useState(false);

  if (data) {
    const generateAnswers = (): void => {
      if (data) {
        const choices: string[] = [];
        const correctAnswerIndex: number = Math.floor(Math.random() * 5);

        for (let i = 0; i < 4; i += 1) {
          const index: number = Math.floor(Math.random() * data.length);

          if (
            choices.indexOf(data[index].word) !== -1 ||
            data[correctAnswer].word === data[index].word
          ) {
            i -= 1;
          } else choices.push(data[index].word);
        }

        choices.splice(correctAnswerIndex, 0, data[correctAnswer].word);

        setAnswers([...choices]);
      }
    };

    const chooseWord = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      const chosenAnswer: HTMLButtonElement = e.target as HTMLButtonElement;

      if (chosenAnswer.textContent === data[correctAnswer].word) {
        chosenAnswer.style.backgroundColor = 'green';
      } else {
        chosenAnswer.style.backgroundColor = 'red';
      }

      setShouldContinue(true);
    };

    const setNextCorrectAnswer = (): void => {
      setCorrectAnswer(correctAnswer + 1);
      setShouldContinue(false);
      setAnswers([]);
    };

    if (isLoading) return <p>Loading...</p>;

    if (error) {
      if ('status' in error) {
        const errorMessage = 'error' in error ? error.error : JSON.stringify(error.data);

        return <ErrorBanner>An error has occurred: {errorMessage}</ErrorBanner>;
      }

      return <ErrorBanner>{error.message}</ErrorBanner>;
    }

    if (answers.length === 0) generateAnswers();

    if (data && correctAnswer < 10) {
      return (
        <div>
          <p>{data[correctAnswer].word}</p>
          <div>
            <AudiocallAnswers answers={answers} chooseWord={chooseWord} />
          </div>
          {shouldContinue ? (
            <button type="button" onClick={setNextCorrectAnswer}>
              Continue
            </button>
          ) : null}
        </div>
      );
    }

    if (correctAnswer === 10) {
      return <p>Thats it!</p>;
    }
  }

  return null;
};

export default AudiocallGame;
