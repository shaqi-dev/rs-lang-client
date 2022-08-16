import { FC, PropsWithChildren } from 'react';
import s from './Button.module.scss';

interface ButtonProps {
  type: 'button' | 'submit' | 'reset';
  buttonStyle?: 'primary' | 'secondary' | 'link';
  className?: string | string[];
  onClick?: () => void;
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({
  type,
  buttonStyle,
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
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={`${s.root} ${
        buttonStyle === 'primary' ? s.primary : s.secondary
      } ${classNamesFromProps}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
