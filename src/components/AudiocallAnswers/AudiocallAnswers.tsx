import { FC } from 'react';

const AudiocallAnswers: FC<{ answers: string[]; chooseWord: () => void }> = (props) => {
  const { answers, chooseWord } = props;

  return (
    <div>
      {answers.map((word) => {
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
