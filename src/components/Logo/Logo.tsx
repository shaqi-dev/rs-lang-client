import { FC } from 'react';
import { Link } from 'react-router-dom';
import s from './Logo.module.scss';

interface LogoProps {
  closeNav?: () => void;
}

const Logo: FC<LogoProps> = ({ closeNav }) => {
  return (
    <Link to="/rs-lang-client" className={s.logo} onClick={closeNav}>
      RS Lang
    </Link>
  );
};

export default Logo;
