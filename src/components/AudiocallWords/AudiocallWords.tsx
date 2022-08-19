import { FC, useState } from 'react';
import { useGetWordsQuery } from '../../services/wordsApi';
import ErrorBanner from '../ErrorBanner';

const AudiocallWords: FC = () => {
  const { data, error, isLoading } = useGetWordsQuery({ group: 0, page: 0 });
  const [currentWord, setCurrentWord] = useState(0);
  const words = data?.slice(0, 10);

  function showNextWord(): void {
    setCurrentWord(currentWord + 1);
  }

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    if ('status' in error) {
      const errorMessage = 'error' in error ? error.error : JSON.stringify(error.data);

      return <ErrorBanner>An error has occurred: {errorMessage}</ErrorBanner>;
    }

    return <ErrorBanner>{error.message}</ErrorBanner>;
  }

  if (words && currentWord < words.length) {
    return (
      <div>
        <button type="button" onClick={showNextWord}>
          {currentWord}
        </button>
        <p>{words[currentWord].word}</p>
      </div>
    );
  }
  if (words && currentWord === words.length) {
    return <p>Thats it!</p>;
  }

  return null;
};

export default AudiocallWords;
