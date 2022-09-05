import { FC } from 'react';
import ContentWrapper from '../../layouts/ContentWrapper';
import s from './Home.module.scss';

const Home: FC = () => {
  return (
    <ContentWrapper className={s.wrapper}>
      <section className={s.hero}>Hero section</section>
      <section className={s.about}>About RS Lang</section>
      <section className={s.team}>About Team</section>
    </ContentWrapper>
  );
};

export default Home;
