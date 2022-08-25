import { FC } from 'react';
import AudiocallMeaningData from '../../interfaces/audiocallMeaningData';

const AudiocallMeaning: FC<AudiocallMeaningData> = (props) => {
  const { imageLink, imageAlt, currentWord } = props;

  return (
    <div>
      <img src={imageLink} alt={imageAlt} />
      <p>{currentWord}</p>
    </div>
  );
};

export default AudiocallMeaning;
