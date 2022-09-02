import { GameStatistics } from './userWords';

export interface GameStatsShort extends GameStatistics {
  newWordsCount: number;
  longestWinStreak: number;
}

export interface UserStatisticsData {
  learnedWords: number;
  optional?: {
    games?: {
      sprint?: GameStatsShort;
      audiocall?: GameStatsShort;
    };
  };
}

export interface UserStatisticsResponse {
  id: string;
  learnedWords: number;
  optional?: {
    games?: {
      sprint?: GameStatsShort;
      audiocall?: GameStatsShort;
    };
  };
}
