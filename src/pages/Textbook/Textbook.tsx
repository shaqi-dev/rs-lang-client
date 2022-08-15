import { FC } from 'react';
import ContentWrapper from '../../layouts/ContentWrapper';
import s from './Textbook.module.scss';

const Textbook: FC = () => {
  return (
    <ContentWrapper className={s.wrapper}>
      <div className={s.levels}>Words levels</div>
      <section className={s.words}>Words</section>
    </ContentWrapper>
  );
};

export default Textbook;
