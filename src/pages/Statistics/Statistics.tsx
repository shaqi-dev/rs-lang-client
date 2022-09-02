import { FC } from 'react';
import ContentWrapper from '../../layouts/ContentWrapper';
import { useGetStatisticsQuery } from '../../services/statisticsApi';
import getGameWinrate from '../../shared/getGameWinrate';
import s from './Statistics.module.scss';

interface StatisticsProps {
  userId: string;
}

const Statistics: FC<StatisticsProps> = ({ userId }) => {
  const { data } = useGetStatisticsQuery(userId);

  const learnedWords = data?.optional?.learnedWords || 0;
  const sprint = data?.optional?.games?.sprint;
  const audiocall = data?.optional?.games?.audiocall;
  const newWordsSrint = sprint?.newWordsCount || 0;
  const newWordsAudiocall = audiocall?.newWordsCount || 0;
  const newWordsTotal = newWordsSrint + newWordsAudiocall;
  const winStreakSprint = sprint?.longestWinStreak || 0;
  const winStreakAudiocall = audiocall?.longestWinStreak || 0;

  const winPercentTotal = (): number => {
    if (sprint && audiocall) return (getGameWinrate(sprint) + getGameWinrate(audiocall)) / 2;
    if (sprint) return getGameWinrate(sprint);
    if (audiocall) return getGameWinrate(audiocall);
    return 0;
  };

  return (
    <ContentWrapper className={s.wrapper}>
      <section>
        <p className={s.sectionTitle}>Статистика по словам</p>
        <div className={s.wordsStats}>
          <p>Новые слова: {newWordsTotal}</p>
          <p>Изученные слова: {learnedWords}</p>
          <p>Процент правильных ответов: {winPercentTotal()}%</p>
        </div>
      </section>
      <section>
        <p className={s.sectionTitle}>Статистика по мини-играм</p>
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
      </section>
    </ContentWrapper>
  );
};

export default Statistics;
