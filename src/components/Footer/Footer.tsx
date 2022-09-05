import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import ContentWrapper from '../../layouts/ContentWrapper';
import { ReactComponent as RsSchoolLogo } from '../../assets/svg/rs-school-logo.svg';
import s from './Footer.module.scss';

const Footer: FC = () => {
  const location = useLocation();

  if (!location.pathname.split('/').includes('games')) {
    return (
      <footer className={s.root}>
        <ContentWrapper className={s.wrapper}>
          <span className={s.year}>2022</span>
          <ul className={s.developersList}>
            <span className={s.developersTitle}>Разработчики:</span>
            <li className={s.developersItem}>
              <a href="https://github.com/maria98kgm">maria98kgm</a>
            </li>
            <li className={s.developersItem}>
              <a href="https://github.com/1iekim">1iekim</a>
            </li>
            <li className={s.developersItem}>
              <a href="https://github.com/shaqi-dev">shaqi-dev</a>
            </li>
          </ul>
          <a href="https://rs.school/js/">
            <RsSchoolLogo className={s.rslogo} />
          </a>
        </ContentWrapper>
      </footer>
    );
  }

  return null;
};

export default Footer;
