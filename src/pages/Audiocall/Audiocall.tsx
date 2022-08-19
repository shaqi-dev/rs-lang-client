import { FC } from 'react';
import ContentWrapper from '../../layouts/ContentWrapper';
import s from './Audiocall.module.scss';

const Audiocall: FC = () => {
  return (
    <ContentWrapper className={s.audiocallWrapper}>
      <div>chip</div>
    </ContentWrapper>
  );
};

export default Audiocall;
