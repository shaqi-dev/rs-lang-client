import { FC, PropsWithChildren } from 'react';
import s from './ErrorBanner.module.scss';

const ErrorBanner: FC<PropsWithChildren> = ({ children }) => {
  return <p className={s.root}>{children}</p>;
};

export default ErrorBanner;
