import { FC, PropsWithChildren, MouseEvent } from 'react';
import s from './WordButton.module.scss';

export interface WordButtonProps {
  active?: boolean;
  className?: string | string[];
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const WordButton: FC<PropsWithChildren<WordButtonProps>> = ({
  active,
  className,
  onClick,
  children,
}) => {
  let classNamesFromProps = '';

  if (className) {
    classNamesFromProps = typeof className === 'string' ? className : className?.join(' ');
  }

  return (
    <button
      type="button"
      className={`${s.root} ${active && s.root_active} ${classNamesFromProps}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default WordButton;
