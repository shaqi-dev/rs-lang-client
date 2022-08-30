export interface GameStatistics {
  newWordsCount: number;
  correctAnswers: number;
  incorrectAnswers: number;
  longestWinStreak: number;
}

export interface UserStatistics {
  learnedWords: number;
  optional: {
    games: {
      sprint: GameStatistics;
      audiocall: GameStatistics;
    };
  };
}
