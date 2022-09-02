import { FC, PropsWithChildren, MouseEvent } from 'react';
import s from './AudiocallGroupItem.module.scss';

export interface AudiocallGroupItemProps {
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
      className={`${s.groupItem} ${active && s.groupItem_active} ${s[classNamesFromProps]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default AudiocallGroupItem;
