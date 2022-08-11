import { FC } from 'react';
import ContentWrapper from '../ContentWrapper';
import Logo from '../../Logo';
import NavBar from '../../NavBar';
import s from './Header.module.scss';

const Header: FC = () => {
  return (
    <header className={s.root}>
      <ContentWrapper className={s.wrapper}>
        <Logo />
        <NavBar />
      </ContentWrapper>
    </header>
  );
};

export default Header;
