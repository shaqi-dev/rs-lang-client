import { FC } from 'react';
import s from './AudiocallMeaning.module.scss';
import { useAppSelector } from '../../hooks/redux';
import { selectShouldContinue } from '../../store/audiocall/audiocallSlice';
import { ReactComponent as CircleAudioButton } from '../../assets/svg/circle-audio-button.svg';
import { ReactComponent as DefaultAudioButton } from '../../assets/svg/default-audio-button.svg';

interface AudiocallMeaningProps {
  imageLink: string;
  imageAlt: string;
  currentWord: string;
  playAudio: () => void;
}

const AudiocallMeaning: FC<AudiocallMeaningProps> = ({
  imageLink,
  imageAlt,
  currentWord,
  playAudio,
}) => {
  const shouldContinue = useAppSelector(selectShouldContinue);

  return (
    <div className={s.audiocallMeaning}>
      {shouldContinue ? (
        <>
          <img src={imageLink} alt={imageAlt} className={s.audiocallMeaning_picture} />
          <div className={s.audiocallMeaning_wordAndAudio}>
            <p className={s.word}>{currentWord}</p>
            <DefaultAudioButton onClick={playAudio} className={s.smallAudioButton} />
          </div>
        </>
      ) : (
        <CircleAudioButton className={s.circleAudioButton} onClick={playAudio} />
      )}
    </div>
  );
};

export default AudiocallMeaning;
