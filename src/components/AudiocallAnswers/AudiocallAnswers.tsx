import { FC } from 'react';

const AudiocallAnswers: FC<{ words: string[]; chooseWord: () => void }> = (props) => {
  const { words, chooseWord } = props;

  return (
    <div>
      {words.map((word) => {
        return (
          <button type="button" key={word} onClick={chooseWord}>
            {word}
          </button>
        );
      })}
    </div>
  );
};

export default AudiocallAnswers;
