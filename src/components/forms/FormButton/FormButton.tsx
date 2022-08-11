import { FC } from 'react';
import s from './FormButton.module.scss';

interface FormButtonProps {
  type: 'submit' | 'reset';
  htmlFor: string;
  value: string;
}

const FormButton: FC<FormButtonProps> = ({ type, htmlFor, value }) => {
  return (
    <label htmlFor={htmlFor} className={s.root}>
      <input type={type} value={value} className={s.button} />
    </label>
  );
};

export default FormButton;
