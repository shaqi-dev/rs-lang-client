import { FC } from 'react';
import { Link } from 'react-router-dom';
import ContentWrapper from '../../layouts/ContentWrapper';
import s from './Home.module.scss';

const Home: FC = () => {
  return (
    <ContentWrapper className={s.wrapper}>
      <section className={s.about}>
        <h2 className={s.about_name}>Rs Lang -</h2>
        <p className={s.about_descr}>
          приложение по изучению английского языка,
          <br />
          включающего в себя две игры и словарь.
        </p>
      </section>
      <section className={s.scope}>
        <h2>Возможности приложения</h2>
        <div className={s.scope_textbook}>
          <Link to="/rs-lang-client/textbook" className={s.link}>
            <div className={s.textbookImage}>
              <p className={s.textbookText}>Учебник</p>
            </div>
          </Link>
          <p className={s.explanation}>
            Учебник включает в себя 3500 слов, y каждого есть: транскрипция, перевод, аудио, пример
            использования в предложении.
          </p>
        </div>
        <div className={s.scope_sprint}>
          <p className={s.explanation}>
            Проверь свою реакцию и возможность быстро принимать решения. Переведи за 30 секунд как
            можно больше слов.
          </p>
          <Link to="/rs-lang-client/games/sprint" className={s.link}>
            <div className={s.sprintImage}>
              <p className={s.sprintText}>Спринт</p>
            </div>
          </Link>
        </div>
        <div className={s.scope_audiocall}>
          <Link to="/rs-lang-client/games/audiocall" className={s.link}>
            <div className={s.audiocallImage}>
              <p className={s.audiocallText}>Аудиозвонок</p>
            </div>
          </Link>
          <p className={s.explanation}>
            Испытай свой слух на понимание английских слов. Выбери из предложенных вариантов
            правильный перевод.
          </p>
        </div>
      </section>
      <section className={s.team}>
        <h2>О команде</h2>
        <div className={s.teamMembers}>
          <div className={s.member}>
            <div className={s.mikhailProfileImage} />
            <a href="https://github.com/1iekim" className={s.profileLink}>
              1iekim
            </a>
            <p className={s.participation}>Разработка игры "Спринт", фикс багов.</p>
          </div>
          <div className={s.member}>
            <div className={s.vladProfileImage} />
            <a href="https://github.com/shaqi-dev" className={s.profileLink}>
              shaqi-dev
            </a>
            <p className={s.teamLead}>Тимлид команды</p>
            <p className={s.participation}>
              Разработка структуры приложения, учебника, регистрации и графика. Фикс багов.
            </p>
          </div>
          <div className={s.member}>
            <div className={s.mariaProfileImage} />
            <a href="https://github.com/maria98kgm" className={s.profileLink}>
              maria98kgm
            </a>
            <p className={s.participation}>Разработка игры "Aудиозвонок", дизайн приложения.</p>
          </div>
        </div>
      </section>
    </ContentWrapper>
  );
};

export default Home;
