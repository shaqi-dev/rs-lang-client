import { FC, PropsWithChildren } from 'react';
import s from './ContentWrapper.module.scss';

interface ContentWrapperProps {
  className?: string | string[];
}

const ContentWrapper: FC<PropsWithChildren<ContentWrapperProps>> = ({ children, className }) => {
  let classNamesFromProps = '';

  if (className) {
    classNamesFromProps = typeof className === 'object' ? className.join(' ') : className;
  }

  return <div className={`${s.root} ${classNamesFromProps}`}>{children}</div>;
};

export default ContentWrapper;
