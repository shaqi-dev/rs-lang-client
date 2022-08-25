import { FC, PropsWithChildren } from 'react';
import AudiocallGroupItemProps from '../../interfaces/audiocallGroupItemProps';
import s from './AudiocallGroupItem.module.scss';

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
