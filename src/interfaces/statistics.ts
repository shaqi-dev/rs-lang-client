import { GameStatistics } from './userWords';

export interface GameStatsShort extends GameStatistics {
  newWordsCount: number;
  longestWinStreak: number;
}

export interface UserStatisticsData {
  optional?: {
    learnedWords?: number;
    games?: {
      sprint?: GameStatsShort;
      audiocall?: GameStatsShort;
    };
  };
}

export interface UserStatisticsResponse {
  id: string;
  optional?: {
    learnedWords?: number;
    games?: {
      sprint?: GameStatsShort;
      audiocall?: GameStatsShort;
    };
  };
}
