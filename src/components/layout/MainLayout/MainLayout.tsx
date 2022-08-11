import { FC, PropsWithChildren } from 'react';
import Header from '../Header';
import Footer from '../Footer';
// import s from './MainLayout.module.scss';

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
