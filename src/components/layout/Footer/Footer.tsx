import { FC } from 'react';
import ContentWrapper from '../ContentWrapper';
import s from './Footer.module.scss';

const Footer: FC = () => {
  return (
    <footer className={s.root}>
      <ContentWrapper>Footer</ContentWrapper>
    </footer>
  );
};

export default Footer;
