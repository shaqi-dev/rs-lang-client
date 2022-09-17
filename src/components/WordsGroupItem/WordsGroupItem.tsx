import { FC, MouseEvent, PropsWithChildren } from 'react';
import s from './WordsGroupItem.module.scss';

interface WordsGroupItemProps {
  active?: boolean;
  className?: string | string[];
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const WordsGroupItem: FC<PropsWithChildren<WordsGroupItemProps>> = ({
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
      className={`${s.groupItem} ${active && s[`${classNamesFromProps}_active`]} ${
        s[classNamesFromProps]
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default WordsGroupItem;
