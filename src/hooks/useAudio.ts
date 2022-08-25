import { API_BASE } from '../services/endpoints';
import type { Word } from '../interfaces/words';
import type { AggregatedWord } from '../interfaces/userAggregatedWords';

const useAudio = (word: Word | AggregatedWord): [() => void, () => void] => {
  const { audio: audioSrc, audioExample: audioExampleSrc, audioMeaning: audioMeaningSrc } = word;
  const audio = new Audio(`${API_BASE}/${audioSrc}`);
  const audioExample = new Audio(`${API_BASE}/${audioExampleSrc}`);
  const audioMeaning = new Audio(`${API_BASE}/${audioMeaningSrc}`);

  audio.addEventListener('ended', () => audioMeaning.play());
  audioMeaning.addEventListener('ended', () => audioExample.play());

  const stop = (): void => {
    audio.pause();
    audioMeaning.pause();
    audioExample.pause();
    audio.currentTime = 0;
    audioMeaning.currentTime = 0;
    audioExample.currentTime = 0;
  };

  const play = async (): Promise<void> => {
    stop();
    audio.play();
  };

  return [play, stop];
};

export default useAudio;
