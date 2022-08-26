import { FC, MouseEvent, PropsWithChildren } from 'react';
import s from './AudiocallGroupItem.module.scss';

interface AudiocallGroupItemProps {
  active?: boolean;
  className?: string | string[];
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const AudiocallGroupItem: FC<PropsWithChildren<AudiocallGroupItemProps>> = ({
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

export default AudiocallGroupItem;
