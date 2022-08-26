import { FC } from 'react';

const AudiocallMeaning: FC<{ imageLink: string; imageAlt: string; currentWord: string }> = (
  props,
) => {
  const { imageLink, imageAlt, currentWord } = props;

  return (
    <div>
      <img src={imageLink} alt={imageAlt} />
      <p>{currentWord}</p>
    </div>
  );
};

export default AudiocallMeaning;
