import { FC } from 'react';
import s from './FormTextField.module.scss';

interface TextFieldProps {
  type: 'text' | 'password' | 'email';
  htmlFor: string;
  label: string;
}

const FormTextField: FC<TextFieldProps> = ({ type, htmlFor, label }) => {
  return (
    <label htmlFor={htmlFor} className={s.root}>
      <p className={s.label}>{label}</p>
      <input type={type} className={s.input} />
    </label>
  );
};

export default FormTextField;
