import { FC } from 'react';
import s from './FormTextField.module.scss';

interface TextFieldProps {
  type: 'text' | 'password' | 'email';
  htmlFor: string;
  label: string;
  autoComplete?: string;
}

const FormTextField: FC<TextFieldProps> = ({ type, htmlFor, label, autoComplete }) => {
  return (
    <label htmlFor={htmlFor} className={s.root}>
      <input
        type={type}
        className={s.input}
        placeholder={label}
        autoComplete={autoComplete || 'off'}
      />
    </label>
  );
};

export default FormTextField;
