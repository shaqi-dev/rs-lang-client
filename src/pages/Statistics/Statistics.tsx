import { FC } from 'react';
import ContentWrapper from '../../layouts/ContentWrapper';
import { useGetStatisticsQuery, useUpdateStatisticsMutation } from '../../services/statisticsApi';
import getGameWinrate from '../../shared/getGameWinrate';
import s from './Statistics.module.scss';

interface StatisticsProps {
  userId: string;
}

const mockData = {
  learnedWords: 15,
  optional: {
    games: {
      sprint: {
        newWordsCount: 5,
        correctAnswers: 15,
        incorrectAnswers: 8,
        longestWinStreak: 10,
      },
      audiocall: {
        newWordsCount: 7,
        correctAnswers: 18,
        incorrectAnswers: 11,
        longestWinStreak: 8,
      },
    },
  },
};

const Statistics: FC<StatisticsProps> = ({ userId }) => {
  const { data } = useGetStatisticsQuery(userId);
  const [updateStatistics] = useUpdateStatisticsMutation();

  const handleUpdate = async (): Promise<void> => {
    await updateStatistics({
      userId,
      body: mockData,
    }).unwrap();
  };

  const learnedWords = data?.learnedWords;
  const sprint = data?.optional?.games?.sprint;
  const audiocall = data?.optional?.games?.audiocall;
  const newWordsSrint = sprint?.newWordsCount || 0;
  const newWordsAudiocall = audiocall?.newWordsCount || 0;
  const newWordsTotal = newWordsSrint + newWordsAudiocall;
  const winStreakSprint = sprint?.longestWinStreak || 0;
  const winStreakAudiocall = audiocall?.longestWinStreak || 0;

  const winPercentTotal = (): number => (getGameWinrate(sprint) + getGameWinrate(audiocall)) / 2;

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
      <button type="button" onClick={handleUpdate}>
        Post
      </button>
    </ContentWrapper>
  );
};

export default Statistics;
