import { FC } from 'react';
import ContentWrapper from '../../layouts/ContentWrapper';
import { useGetStatisticsQuery, useUpdateStatisticsMutation } from '../../services/statisticsApi';
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

  if (data) {
    const { learnedWords, optional } = data;
    const newWordsSrint = optional.games?.sprint?.newWordsCount || 0;
    const newWordsAudiocall = optional.games?.audiocall?.newWordsCount || 0;
    const newWordsTotal = newWordsSrint + newWordsAudiocall;
    const correctSprint = optional.games?.sprint?.correctAnswers || 0;
    const correctAudiocall = optional.games?.audiocall?.correctAnswers || 0;
    const incorrectSprint = optional.games?.sprint?.incorrectAnswers || 0;
    const incorrectAudiocall = optional.games?.audiocall?.incorrectAnswers || 0;
    const winStreakSprint = optional.games?.sprint?.longestWinStreak || 0;
    const winStreakAudiocall = optional.games?.audiocall?.longestWinStreak || 0;

    const winPercentGame = (game: 'sprint' | 'audiocall'): number => {
      const correct = game === 'sprint' ? correctSprint : correctAudiocall;
      const incorrect = game === 'sprint' ? incorrectSprint : incorrectAudiocall;

      if (correct && !incorrect) return 100;
      if (!correct && incorrect) return 0;
      return +((correct / (correct + incorrect)) * 100).toFixed(0);
    };

    const winPercentTotal = (): number => {
      if ((correctSprint || correctAudiocall) && !incorrectSprint && !incorrectAudiocall) {
        return 100;
      }

      if (!correctSprint && !correctAudiocall && (incorrectSprint || incorrectAudiocall)) {
        return 0;
      }

      const winRate =
        (correctSprint + correctAudiocall) /
        (correctSprint + incorrectSprint + correctAudiocall + incorrectAudiocall);

      return +(winRate * 100).toFixed(0);
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
              <p>Процент правильных ответов: {winPercentGame('sprint')}%</p>
              <p>Самая длинная серия побед: {winStreakSprint}</p>
            </div>
            <div className={s.gamesStatsItem}>
              <p className={s.gameTitle}>Аудиовызов</p>
              <p>Новые слова: {newWordsAudiocall}</p>
              <p>Процент правильных ответов: {winPercentGame('audiocall')}%</p>
              <p>Самая длинная серия побед: {winStreakAudiocall}</p>
            </div>
          </div>
        </section>
        <button type="button" onClick={handleUpdate}>
          Post
        </button>
      </ContentWrapper>
    );
  }

  return null;
};

export default Statistics;
