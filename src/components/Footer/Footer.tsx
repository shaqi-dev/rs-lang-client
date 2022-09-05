import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import ContentWrapper from '../../layouts/ContentWrapper';
import s from './Footer.module.scss';

const Footer: FC = () => {
  const location = useLocation();

  if (!location.pathname.split('/').includes('games')) {
    return (
      <footer className={s.root}>
        <ContentWrapper>Footer</ContentWrapper>
      </footer>
    );
  }

  return null;
};

export default Footer;
