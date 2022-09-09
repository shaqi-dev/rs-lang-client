import { FC } from 'react';
import ContentWrapper from '../../layouts/ContentWrapper';
import { useGetStatisticsQuery } from '../../services/statisticsApi';
import Chart from '../../components/Chart';
import getCurrentDate from '../../shared/getCurrentDate';
import getGameWinrate from '../../shared/getGameWinrate';
import s from './Statistics.module.scss';
import { ChartDataItem } from '../../interfaces/ChartDataItem';

import { GameStatsShort } from '../../interfaces/statistics';

interface StatisticsProps {
  userId: string;
}

const Statistics: FC<StatisticsProps> = ({ userId }) => {
  const { data } = useGetStatisticsQuery(userId);

  const currendDate = getCurrentDate();
  const sprint = data?.optional?.games?.sprint;
  const audiocall = data?.optional?.games?.audiocall;
  const sprintToday = data?.optional?.games?.sprint?.filter((x) => x.date === currendDate)[0];
  const audiocallToday = data?.optional?.games?.audiocall?.filter((x) => x.date === currendDate)[0];
  const newWordsSrint = sprintToday?.newWords || 0;
  const newWordsAudiocall = audiocallToday?.newWords || 0;
  const newWordsTotal = newWordsSrint + newWordsAudiocall;
  const learnedWordsTotal = (sprintToday?.learnedWords || 0) + (audiocallToday?.learnedWords || 0);
  const winStreakSprint = sprintToday?.longestWinStreak || 0;
  const winStreakAudiocall = audiocallToday?.longestWinStreak || 0;

  const winPercentTotal = (): number => {
    if (sprint && audiocall)
      return (getGameWinrate(sprintToday) + getGameWinrate(audiocallToday)) / 2;
    if (sprint) return getGameWinrate(sprintToday);
    if (audiocall) return getGameWinrate(audiocallToday);
    return 0;
  };

  const getUniqueDates = (): string[] => {
    let fullStats: GameStatsShort[] = [];

    if (sprint) fullStats = sprint;
    if (audiocall) fullStats = [...fullStats, ...audiocall];

    const uniqueDates = new Set(fullStats.map((stats) => stats.date));
    const sortedDates = Array.from(uniqueDates).sort((a, b) => Date.parse(a) - Date.parse(b));

    return sortedDates;
  };

  const newWordsChartData = (): ChartDataItem[] => {
    const result = getUniqueDates().map((date) => {
      const sprintCurrentDate = sprint?.filter((x) => x.date === date);
      const audiocallCurrentDate = audiocall?.filter((x) => x.date === date);
      const sprintValue = (sprintCurrentDate?.length && sprintCurrentDate[0].newWords) || 0;
      const audiocallValue =
        (audiocallCurrentDate?.length && audiocallCurrentDate[0].newWords) || 0;

      return {
        date,
        sprint: sprintValue,
        audiocall: audiocallValue,
      };
    });

    return result;
  };

  const learnedWordsChartData = (): ChartDataItem[] => {
    let sprintTotal = 0;
    let audiocallTotal = 0;

    const result = getUniqueDates().map((date) => {
      const sprintCurrentDate = sprint?.filter((x) => x.date === date);
      const audiocallCurrentDate = audiocall?.filter((x) => x.date === date);
      const sprintValue = (sprintCurrentDate?.length && sprintCurrentDate[0].learnedWords) || 0;
      const audiocallValue =
        (audiocallCurrentDate?.length && audiocallCurrentDate[0].learnedWords) || 0;

      sprintTotal += sprintValue;
      audiocallTotal += audiocallValue;

      return {
        date,
        sprint: sprintTotal,
        audiocall: audiocallTotal,
      };
    });

    return result;
  };

  return (
    <ContentWrapper className={s.wrapper}>
      <section className={s.shortStatsSection}>
        <p className={s.sectionTitle}>Статистика за сегодня</p>
        <div>
          <p className={s.shortStatsTitle}>Статистика по словам</p>
          <div className={s.wordsStats}>
            <p>Новые слова: {newWordsTotal}</p>
            <p>Изученные слова: {learnedWordsTotal}</p>
            <p>Процент правильных ответов: {winPercentTotal()}%</p>
          </div>
        </div>
        <div>
          <p className={s.shortStatsTitle}>Статистика по мини-играм</p>
          <div className={s.gamesStats}>
            <div className={s.gamesStatsItem}>
              <p className={s.gameTitle}>Спринт</p>
              <p>Новые слова: {newWordsSrint}</p>
              <p>Процент правильных ответов: {getGameWinrate(sprintToday)}%</p>
              <p>Самая длинная серия побед: {winStreakSprint}</p>
            </div>
            <div className={s.gamesStatsItem}>
              <p className={s.gameTitle}>Аудиовызов</p>
              <p>Новые слова: {newWordsAudiocall}</p>
              <p>Процент правильных ответов: {getGameWinrate(audiocallToday)}%</p>
              <p>Самая длинная серия побед: {winStreakAudiocall}</p>
            </div>
          </div>
        </div>
      </section>
      <section className={s.longStatsSection}>
        <p className={s.sectionTitle}>Статистика за всё время</p>
        <div>
          <p className={s.chartTitle}>Новые слова по дням</p>
          <Chart type="bar" chartData={newWordsChartData()} />
        </div>
        <div>
          <p className={s.chartTitle}>Изученные слова за все время</p>
          <Chart type="area" chartData={learnedWordsChartData()} />
        </div>
      </section>
    </ContentWrapper>
  );
};

export default Statistics;
