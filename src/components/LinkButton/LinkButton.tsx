import { FC, PropsWithChildren } from 'react';
import s from './LinkButton.module.scss';

interface LinkButtonProps {
  type: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const LinkButton: FC<PropsWithChildren<LinkButtonProps>> = ({ type, onClick, children }) => {
  return (
    // eslint-disable-next-line react/button-has-type
    <button type={type} onClick={onClick} className={s.root}>
      {children}
    </button>
  );
};

export default LinkButton;
