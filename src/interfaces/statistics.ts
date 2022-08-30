export interface GameStatistics {
  newWordsCount: number;
  correctAnswers: number;
  incorrectAnswers: number;
  longestWinStreak: number;
}

export interface UserStatisticsData {
  learnedWords: number;
  optional: {
    games?: {
      sprint?: GameStatistics;
      audiocall?: GameStatistics;
    };
  };
}

export interface UserStatisticsResponse {
  id: string;
  learnedWords: number;
  optional: {
    games?: {
      sprint?: GameStatistics;
      audiocall?: GameStatistics;
    };
  };
}
