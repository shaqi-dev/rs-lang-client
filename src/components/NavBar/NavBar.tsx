import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout, selectCurrentUsername } from '../../store/auth/authSlice';
import Button from '../Button';
import Dropdown, { DropdownOption } from './Dropdown';
import s from './NavBar.module.scss';

interface NavBarProps {
  userId: string | null;
}

const gamesOptions: DropdownOption[] = [
  { name: 'Спринт', link: 'games/sprint' },
  { name: 'Аудиовызов', link: 'games/audiocall' },
];

const NavBar: FC<NavBarProps> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const currentUsername = useAppSelector(selectCurrentUsername);

  const handleLogout = async (): Promise<void> => {
    dispatch(logout());
  };

  return (
    <nav className={s.root}>
      <ul className={s.main}>
        <li className={s.item}>
          <Link to="/textbook" className={s.link}>
            Учебник
          </Link>
        </li>
        <li className={`${s.item} ${s.dropdown}`}>
          <Dropdown options={gamesOptions} />
        </li>
        {!!userId && (
          <li className={s.item}>
            <Link to="/statistics" className={s.link}>
              Статистика
            </Link>
          </li>
        )}
        <li className={s.item}>
          {currentUsername && (
            <>
              <span>{currentUsername}, </span>
              <Button type="button" buttonStyle="link" onClick={handleLogout}>
                Выйти
              </Button>
            </>
          )}
          {!currentUsername && (
            <Link to="/authorization" className={s.link}>
              Войти
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
