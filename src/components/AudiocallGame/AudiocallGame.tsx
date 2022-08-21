import { FC, useState } from 'react';
import { useGetWordsQuery } from '../../services/wordsApi';
import ErrorBanner from '../ErrorBanner';
import AudiocallAnswers from '../AudiocallAnswers';

const AudiocallGame: FC = () => {
  const { data, error, isLoading } = useGetWordsQuery({ group: 0, page: 0 });
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [shouldContinue, setShouldContinue] = useState(false);

  const generateAnswers = (): void => {
    if (data) {
      const choices: string[] = [];

      for (let i = 0; i < 5; i += 1) {
        const index: number = Math.floor(Math.random() * data.length);

        if (choices.indexOf(data[index].word) !== -1) {
          i -= 1;
        } else choices.push(data[index].word);
      }

      setAnswers([...choices]);
    }
  };

  const chooseWord = (): void => {
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

  if (data && correctAnswer === 10) {
    return <p>Thats it!</p>;
  }

  return null;
};

export default AudiocallGame;
