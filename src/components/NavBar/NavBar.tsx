import { FC } from 'react';
import { Link } from 'react-router-dom';
import s from './NavBar.module.scss';

const NavBar: FC = () => {
  return (
    <nav className={s.root}>
      <Link to="/">Home</Link>
      <Link to="login">Login</Link>
    </nav>
  );
};

export default NavBar;
