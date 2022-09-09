import { FC } from 'react';
import { Link } from 'react-router-dom';
import s from './Logo.module.scss';

const Logo: FC = () => {
  return (
    <Link to="/rs-lang-client" className={s.logo}>
      RS Lang
    </Link>
  );
};

export default Logo;
