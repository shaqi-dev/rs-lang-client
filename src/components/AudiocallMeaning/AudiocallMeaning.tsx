import { FC } from 'react';
import s from './AudiocallMeaning.module.scss';
import { useAppSelector } from '../../hooks/redux';
import { selectAudiocallShouldContinue } from '../../store/audiocall/audiocallSlice';

interface AudiocallMeaningProps {
  imageLink: string;
  imageAlt: string;
  currentWord: string;
  playAudio: () => void;
}

const AudiocallMeaning: FC<AudiocallMeaningProps> = (props) => {
  const { imageLink, imageAlt, currentWord, playAudio } = props;
  const shouldContinue = useAppSelector(selectAudiocallShouldContinue);

  return (
    <div className={s.audiocallMeaning}>
      {shouldContinue ? (
        <>
          <img src={imageLink} alt={imageAlt} className={s.audiocallMeaning_picture} />
          <div className={s.audiocallMeaning_wordAndAudio}>
            <p className={s.word}>{currentWord}</p>
            <button type="button" onClick={playAudio} className={s.smallAudioButton}>
              Play Audio
            </button>
          </div>
        </>
      ) : (
        <button type="button" onClick={playAudio} className={s.bigAudioButton}>
          Play Audio
        </button>
      )}
    </div>
  );
};

export default AudiocallMeaning;
