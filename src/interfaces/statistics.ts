import { GameStatistics } from './userWords';

export interface GameStatsShort extends GameStatistics {
  date: string;
  newWords: number;
  learnedWords: number;
  longestWinStreak: number;
}

export interface UserStatisticsData {
  optional?: {
    games?: {
      sprint?: GameStatsShort[];
      audiocall?: GameStatsShort[];
    };
  };
}

export interface UserStatisticsResponse {
  id: string;
  optional?: {
    games?: {
      sprint?: GameStatsShort[];
      audiocall?: GameStatsShort[];
    };
  };
}
