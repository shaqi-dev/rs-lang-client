import { FC } from 'react';

const AudiocallAnswers: FC<{
  answers: string[];
  chooseAnswer: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}> = (props) => {
  const { answers, chooseAnswer } = props;

  return (
    <div className="audiocall-answers">
      {answers.map((word) => {
        return (
          <button type="button" key={word} id={word} onClick={(e): void => chooseAnswer(e)}>
            {word}
          </button>
        );
      })}
    </div>
  );
};

export default AudiocallAnswers;
