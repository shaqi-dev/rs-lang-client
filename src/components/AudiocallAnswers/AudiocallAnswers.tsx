import { FC } from 'react';

const AudiocallAnswers: FC<{
  answers: string[];
  chooseWord: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}> = (props) => {
  const { answers, chooseWord } = props;

  return (
    <div>
      {answers.map((word) => {
        return (
          <button type="button" key={word} id={word} onClick={(e): void => chooseWord(e)}>
            {word}
          </button>
        );
      })}
    </div>
  );
};

export default AudiocallAnswers;
