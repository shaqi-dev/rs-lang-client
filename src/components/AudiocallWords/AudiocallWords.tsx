import { FC, useState } from 'react';
import { useGetWordsQuery } from '../../services/wordsApi';
import ErrorBanner from '../ErrorBanner';
import AudiocallAnswers from '../AudiocallAnswers';

const AudiocallWords: FC = () => {
  const { data, error, isLoading } = useGetWordsQuery({ group: 0, page: 0 });
  const [currentWord, setCurrentWord] = useState(0);
  const [shouldContinue, setShouldContinue] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const choices: string[] = [];

  const generateWords = (): void => {
    if (data) {
      for (let i = 0; i < 5; i += 1) {
        const index: number = Math.floor(Math.random() * data.length);
        if (choices.indexOf(data[index].word) !== -1) {
          i -= 1;
        } else choices.push(data[index].word);
      }

      setAnswers([...choices]);
    }
  };

  const continueTest = (): void => {
    setShouldContinue(true);
  };

  const showNextWord = (): void => {
    setCurrentWord(currentWord + 1);
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

  if (answers.length === 0) generateWords();

  if (data && currentWord < 10) {
    return (
      <div>
        <p>{data[currentWord].word}</p>
        <div>
          <AudiocallAnswers words={answers} chooseWord={continueTest} />
        </div>
        {shouldContinue ? (
          <button type="button" onClick={showNextWord}>
            Continue
          </button>
        ) : null}
      </div>
    );
  }

  if (data && currentWord === 10) {
    return <p>Thats it!</p>;
  }

  return null;
};

export default AudiocallWords;
