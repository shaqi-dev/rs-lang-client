import { GameStatistics } from '../interfaces/userWords';

const getGameWinrate = (game: GameStatistics | undefined): number => {
  if (!game) return 0;

  const correct = game.correctAnswers;
  const incorrect = game.incorrectAnswers;

  if (correct && !incorrect) return 100;
  if (!correct && incorrect) return 0;
  return +((correct / (correct + incorrect)) * 100).toFixed(0);
};

export default getGameWinrate;
