import { FC, useState } from 'react';
import { useGetWordsQuery } from '../../services/wordsApi';
import ErrorBanner from '../ErrorBanner';
import AudiocallAnswers from '../AudiocallAnswers';

const AudiocallWords: FC = () => {
  const { data, error, isLoading } = useGetWordsQuery({ group: 0, page: 0 });
  const [currentWord, setCurrentWord] = useState(0);
  const [shouldContinue, setShouldContinue] = useState(false);

  const continueTest = (): void => {
    setShouldContinue(true);
  };

  const showNextWord = (): void => {
    setCurrentWord(currentWord + 1);
    setShouldContinue(false);
  };

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    if ('status' in error) {
      const errorMessage = 'error' in error ? error.error : JSON.stringify(error.data);

      return <ErrorBanner>An error has occurred: {errorMessage}</ErrorBanner>;
    }

    return <ErrorBanner>{error.message}</ErrorBanner>;
  }

  if (data && currentWord < 10) {
    return (
      <div>
        <p>{data[currentWord].word}</p>
        <div>
          <AudiocallAnswers words={data} handler={continueTest} />
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
