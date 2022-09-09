import { FC, PropsWithChildren } from 'react';
import s from './Button.module.scss';

interface ButtonProps {
  type: 'button' | 'submit' | 'reset';
  buttonStyle?: 'primary' | 'secondary' | 'link';
  className?: string | string[];
  onClick?: () => void;
  active?: boolean;
  inactive?: boolean;
  disabled?: boolean;
}

const Button: FC<PropsWithChildren<ButtonProps>> = ({
  type,
  buttonStyle,
  className,
  onClick,
  children,
  active,
  inactive,
  disabled,
}) => {
  let classNamesFromProps = '';

  if (className) {
    classNamesFromProps = typeof className === 'string' ? className : className?.join(' ');
  }

  const style =
    (buttonStyle === 'primary' && s.primary) ||
    (buttonStyle === 'secondary' && s.secondary) ||
    (buttonStyle === 'link' && s.link);

  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={`${s.root} ${style} ${active ? s.active : ''} ${
        inactive ? s.inactive : ''
      } ${classNamesFromProps}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
