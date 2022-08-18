import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout, selectCurrentUsername } from '../../store/auth/authSlice';
import Button from '../Button';
import Dropdown, { DropdownOption } from './Dropdown';
import s from './NavBar.module.scss';

const gamesOptions: DropdownOption[] = [
  { name: 'Саванна', link: 'games/savanna' },
  { name: 'Оазис', link: 'games/oasis' },
  { name: 'Спринт', link: 'games/sprint' },
  { name: 'Аудиовызов', link: 'games/audiocall' },
];

const NavBar: FC = () => {
  const dispatch = useAppDispatch();
  const currentUsername = useAppSelector(selectCurrentUsername);

  const handleLogout = (): void => {
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
        <li className={s.item}>
          <Link to="/statistic" className={s.link}>
            Статистика
          </Link>
        </li>
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
