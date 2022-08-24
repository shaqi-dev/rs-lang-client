import { FC } from 'react';

const AudiocallAnswers: FC<{
  answers: string[];
  chooseAnswer: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}> = (props) => {
  const { answers, chooseAnswer } = props;

  return (
    <div className="audiocall-answers">
      {answers.map((word) => {
        const wordId = word.replaceAll(' ', '-');
        return (
          <button type="button" key={word} id={wordId} onClick={(e): void => chooseAnswer(e)}>
            {word}
          </button>
        );
      })}
    </div>
  );
};

export default AudiocallAnswers;
