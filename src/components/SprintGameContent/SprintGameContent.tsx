import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { GameStatsShort } from '../../interfaces/statistics';
import {
  useLazyGetStatisticsQuery,
  useUpdateStatisticsMutation,
} from '../../services/statisticsApi';
import getCurrentDate from '../../shared/getCurrentDate';
import { selectCurrentUserId } from '../../store/auth/authSlice';
import { clearStats, selectStats, setStats } from '../../store/sprint/sprintSlice';
import Button from '../Button';
import s from './SprintGame.module.scss';

interface SprintGameProps {
  seconds: number;
  answerCount: number;
  word?: string;
  translate?: string;
  // disabledBtn: boolean;
  checkWord: (answer: boolean) => void;
  // isLoading: boolean;
}

const SprintGameContent: FC<SprintGameProps> = ({
  seconds,
  answerCount,
  word,
  translate,
  // disabledBtn,
  checkWord,
  // isLoading,
}) => {
  const dispatch = useAppDispatch();

  const [getStatistics] = useLazyGetStatisticsQuery();
  const [updateStatistics] = useUpdateStatisticsMutation();

  const userId = useAppSelector(selectCurrentUserId);
  const stats = useAppSelector(selectStats);
  const currentDate = getCurrentDate();

  // SPRINT GAME STATS

  useEffect(() => {
    if (stats.date !== currentDate) {
      dispatch(clearStats());
    }

    if (userId) {
      const loadCurrentDateStats = async (): Promise<void> => {
        const { data: currentStatsData } = await getStatistics(userId);

        const currentDateStats =
          currentStatsData?.optional?.games?.sprint?.filter((x) => x.date === currentDate)[0] ||
          undefined;

        if (currentDateStats) {
          dispatch(setStats(currentDateStats));
        }
      };

      loadCurrentDateStats();
    }
  }, []);

  useEffect(() => {
    if (seconds === 0 && userId) {
      const updateStats = async (): Promise<void> => {
        const { data: prevStatsData } = await getStatistics(userId);

        const prevStats = prevStatsData?.optional?.games?.sprint || undefined;
        const audioStats = prevStatsData?.optional?.games?.audiocall || undefined;
        const currentDateStats = prevStats?.filter((x) => x.date === currentDate)[0] || undefined;

        let sprint: GameStatsShort[];

        if (prevStats) {
          if (currentDateStats) {
            sprint = [...prevStats.filter((x) => x.date !== currentDate), stats];
          } else {
            sprint = [...prevStats, stats];
          }
        } else {
          sprint = [stats];
        }

        const body = {
          optional: {
            games: {
              sprint,
              audiocall: audioStats,
            },
          },
        };

        await updateStatistics({ userId, body });
      };

      updateStats();
    }
  }, [word]);

  // Action BTN
  useEffect(() => {
    const onKeypress = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') checkWord(true);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') checkWord(false);
    };

    document.addEventListener('keydown', onKeypress);

    return () => {
      document.removeEventListener('keydown', onKeypress);
    };
  }, [checkWord, word]);

  // if (isLoading) return <p>Loading....</p>;

  if (word) {
    return (
      <>
        <section>
          <div className={s.content}>
            <span className={s.content_timer}>{seconds}</span>
            <span className={s.content_counter}>Подряд: {answerCount}</span>
          </div>
          <div className={s.wordContainer}>
            <h2>{word || 'Слова закончились!'}</h2>
            {word && <span>=</span>}
            {word && <h2>{translate || 'Перевод'}?</h2>}
          </div>
        </section>
        {word && (
          <section className={s.button}>
            <Button
              className={s.button_true}
              // disabled={disabledBtn}
              type="button"
              onClick={(): void => checkWord(true)}
            >
              Верно
            </Button>
            <Button
              className={s.button_false}
              // disabled={disabledBtn}
              type="button"
              onClick={(): void => checkWord(false)}
            >
              Неверно
            </Button>
          </section>
        )}
      </>
    );
  }

  return null;
};

export default SprintGameContent;
