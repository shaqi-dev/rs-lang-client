import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout, selectCurrentUsername } from '../../store/auth/authSlice';
import Button from '../Button';
// import Dropdown, { DropdownOption } from './Dropdown';
import s from './NavBar.module.scss';

interface NavBarProps {
  userId: string | null;
}

// const gamesOptions: DropdownOption[] = [
//   { name: 'Спринт', link: 'rs-lang-client/games/sprint' },
//   { name: 'Аудиовызов', link: 'rs-lang-client/games/audiocall' },
// ];

const NavBar: FC<NavBarProps> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const currentUsername = useAppSelector(selectCurrentUsername);

  const handleLogout = async (): Promise<void> => {
    dispatch(logout());
  };

  return (
    <nav className={s.navbar}>
      <ul className={s.navbar_content}>
        <li className={s.item}>
          <Link to="/rs-lang-client/textbook" className={s.link}>
            Учебник
          </Link>
        </li>
        {/* <li className={`${s.item} ${s.dropdown}`}>
          <Dropdown options={gamesOptions} />
        </li> */}
        <li className={s.item}>
          <Link to="rs-lang-client/games/audiocall" className={s.link}>
            Аудиовызов
          </Link>
        </li>
        <li className={s.item}>
          <Link to="rs-lang-client/games/sprint" className={s.link}>
            Спринт
          </Link>
        </li>
        {!!userId && (
          <li className={s.item}>
            <Link to="/rs-lang-client/statistics" className={s.link}>
              Статистика
            </Link>
          </li>
        )}
        <li className={s.item}>
          {currentUsername && (
            <div className={s.userContainer}>
              <span className={s.userName}>{currentUsername}</span>
              <Button
                type="button"
                buttonStyle="link"
                onClick={handleLogout}
                className={s.logOutButton}
              >
                Выйти
              </Button>
            </div>
          )}
          {!currentUsername && (
            <Link to="/rs-lang-client/authorization" className={s.link}>
              <div className={s.logInButton}>Войти</div>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
