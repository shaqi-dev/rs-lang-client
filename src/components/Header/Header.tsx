import { FC, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { selectCurrentUserId } from '../../store/auth/authSlice';
import { useAppSelector } from '../../hooks/redux';
import Logo from '../Logo';
import NavBar from '../NavBar';
import s from './Header.module.scss';
import { ReactComponent as BurgerIcon } from '../../assets/svg/burger-icon.svg';

const Header: FC = () => {
  const [show, setShow] = useState(false);

  const handleClose = (): void => setShow(false);
  const handleShow = (): void => setShow(true);

  const userId = useAppSelector(selectCurrentUserId);

  return (
    <header className={s.header}>
      <Logo />
      <BurgerIcon className={`d-lg-none ${s.burgerIcon}`} onClick={handleShow} />
      <Offcanvas show={show} onHide={handleClose} responsive="lg" right="true">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <Logo closeNav={handleClose} />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <NavBar userId={userId} closeNav={handleClose} />
        </Offcanvas.Body>
      </Offcanvas>
    </header>
  );
};

export default Header;
