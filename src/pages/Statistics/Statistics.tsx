import { FC } from 'react';
import ContentWrapper from '../../layouts/ContentWrapper';
import { useGetStatisticsQuery } from '../../services/statisticsApi';
import getCurrentDate from '../../shared/getCurrentDate';
import getGameWinrate from '../../shared/getGameWinrate';
import s from './Statistics.module.scss';

interface StatisticsProps {
  userId: string;
}

const Statistics: FC<StatisticsProps> = ({ userId }) => {
  const { data } = useGetStatisticsQuery(userId);

  console.log(data);

  const currendDate = getCurrentDate();
  const sprint = data?.optional?.games?.sprint?.filter((x) => x.date === currendDate)[0];
  const audiocall = data?.optional?.games?.audiocall?.filter((x) => x.date === currendDate)[0];
  const newWordsSrint = sprint?.newWords || 0;
  const newWordsAudiocall = audiocall?.newWords || 0;
  const newWordsTotal = newWordsSrint + newWordsAudiocall;
  const learnedWordsTotal = (sprint?.learnedWords || 0) + (audiocall?.learnedWords || 0);
  const winStreakSprint = sprint?.longestWinStreak || 0;
  const winStreakAudiocall = audiocall?.longestWinStreak || 0;

  const winPercentTotal = (): number => {
    if (sprint && audiocall) return (getGameWinrate(sprint) + getGameWinrate(audiocall)) / 2;
    if (sprint) return getGameWinrate(sprint);
    if (audiocall) return getGameWinrate(audiocall);
    return 0;
  };

  return (
    <ContentWrapper>
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
              <p>Процент правильных ответов: {getGameWinrate(sprint)}%</p>
              <p>Самая длинная серия побед: {winStreakSprint}</p>
            </div>
            <div className={s.gamesStatsItem}>
              <p className={s.gameTitle}>Аудиовызов</p>
              <p>Новые слова: {newWordsAudiocall}</p>
              <p>Процент правильных ответов: {getGameWinrate(audiocall)}%</p>
              <p>Самая длинная серия побед: {winStreakAudiocall}</p>
            </div>
          </div>
        </div>
      </section>
    </ContentWrapper>
  );
};

export default Statistics;
