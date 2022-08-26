import { FC } from 'react';

const AudiocallAnswers: FC<{
  answers: { word: string; wordIndex: number }[];
  chooseAnswer: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}> = (props) => {
  const { answers, chooseAnswer } = props;

  return (
    <div className="audiocall-answers">
      {answers.map((answer) => {
        const wordId = answer.word.replaceAll(' ', '-');
        return (
          <button
            type="button"
            key={answer.word}
            id={wordId}
            onClick={(e): void => chooseAnswer(e)}
            name={answer.wordIndex.toString()}
          >
            {answer.word}
          </button>
        );
      })}
    </div>
  );
};

export default AudiocallAnswers;
