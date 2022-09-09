import { FC } from 'react';
import { selectCurrentUserId } from '../../store/auth/authSlice';
import { useAppSelector } from '../../hooks/redux';
// import ContentWrapper from '../../layouts/ContentWrapper';
import Logo from '../Logo';
import NavBar from '../NavBar';
import s from './Header.module.scss';

const Header: FC = () => {
  const userId = useAppSelector(selectCurrentUserId);

  return (
    <header className={s.header}>
      <Logo />
      <NavBar userId={userId} />
    </header>
  );
};

export default Header;
