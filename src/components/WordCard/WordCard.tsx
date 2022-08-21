/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FC, useState } from 'react';
import { Word } from '../../interfaces/words';
import { API_BASE } from '../../services/endpoints';
import { ReactComponent as PlayIcon } from '../../assets/svg/play-sound-icon.svg';
import s from './WordCard.module.scss';

export interface WordCardProps {
  word: Word;
}

const WordCard: FC<WordCardProps> = ({ word }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const {
    word: wordOriginal,
    wordTranslate,
    transcription,
    textMeaning,
    textMeaningTranslate,
    textExample,
    textExampleTranslate,
    audio: audioSrc,
    audioExample: audioExampleSrc,
    audioMeaning: audioMeaningSrc,
    image,
  } = word;

  const imageSource = `${API_BASE}/${image}`;

  const audio = new Audio(`${API_BASE}/${audioSrc}`);
  const audioMeaning = new Audio(`${API_BASE}/${audioMeaningSrc}`);
  const audioExample = new Audio(`${API_BASE}/${audioExampleSrc}`);

  audio.addEventListener('ended', () => audioMeaning.play());
  audioMeaning.addEventListener('ended', () => audioExample.play());
  audioExample.addEventListener('ended', () => setIsPlaying(false));

  const playAudio = (): void => {
    if (!isPlaying) {
      setIsPlaying(true);
      audio.play();
    }
  };

  return (
    <div className={s.root}>
      <div className={s.image}>
        <img src={imageSource} alt="word example" />
      </div>
      <div className={s.content}>
        <div className={s.word}>
          <span className={s.word_original}>{wordOriginal} </span>
          <span className={s.word_transcription}>{transcription}</span>
          <PlayIcon className={s.word_playButton} onClick={playAudio} />
          <p className={s.word_translate}>{wordTranslate}</p>
        </div>
        <div className={s.textBlock}>
          <p className={s.textBlock_title}>Значение слова:</p>
          {/* dangerouslySetInnerHTML is used to parse JSX from a string, to avoid adding a large third party package */}
          <p
            className={s.textBlock_original}
            dangerouslySetInnerHTML={{ __html: `- ${textMeaning}` }}
          />
          <p className={s.textBlock_translate}>- {textMeaningTranslate}</p>
        </div>
        <div className={s.textBlock}>
          <p className={s.textBlock_title}>Пример использования:</p>
          <p
            className={s.textBlock_original}
            dangerouslySetInnerHTML={{ __html: `- ${textExample}` }}
          />
          <p className={s.textBlock_translate}>- {textExampleTranslate}</p>
        </div>
      </div>
    </div>
  );
};

export default WordCard;
