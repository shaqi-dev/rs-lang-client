import { FC, FormEvent } from 'react';
import FormTextField from '../FormTextField';
import Button from '../../Button';
import s from './AuthForm.module.scss';

const AuthForm: FC = () => {
  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    console.log('auth form submit');
  };

  return (
    <form className={s.root} onSubmit={handleSubmit}>
      <FormTextField type="email" htmlFor="auth-email" label="Эл. почта" autoComplete="email" />
      <FormTextField
        type="password"
        htmlFor="auth-password"
        label="Пароль"
        autoComplete="current-password"
      />
      <Button type="submit" buttonStyle="primary">
        Войти
      </Button>
    </form>
  );
};

export default AuthForm;
