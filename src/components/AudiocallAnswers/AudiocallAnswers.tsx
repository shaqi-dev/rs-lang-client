import { FC } from 'react';
import { Word } from '../../interfaces/words';

const AudiocallAnswers: FC<{ words: Word[]; handler: () => void }> = (props) => {
  const { words, handler } = props;
  const choices: number[] = [];

  for (let i = 0; i < 5; i += 1) {
    const index: number = Math.floor(Math.random() * words.length);
    if (choices.indexOf(index) !== -1) {
      i -= 1;
    } else choices.push(index);
  }

  return (
    <div>
      {choices.map((wordIndex) => {
        return (
          <button type="button" key={wordIndex} onClick={handler}>
            {words[wordIndex].wordTranslate}
          </button>
        );
      })}
    </div>
  );
};

export default AudiocallAnswers;
