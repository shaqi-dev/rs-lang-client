import { FC, useState } from 'react';

const AudiocallGame: FC = () => {
  const [currentWord, setCurrentWord] = useState(0);

  function showNextWord(): void {
    setCurrentWord(currentWord + 1);
  }

  return (
    <div>
      <button type="button" onClick={showNextWord}>
        {currentWord}
      </button>
    </div>
  );
};

export default AudiocallGame;
