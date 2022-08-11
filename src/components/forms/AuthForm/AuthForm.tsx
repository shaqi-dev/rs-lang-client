import { FC, FormEvent } from 'react';
import FormTextField from '../FormTextField';
import FormButton from '../FormButton';
import s from './AuthForm.module.scss';

const AuthForm: FC = () => {
  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    console.log('auth form submit');
  };

  return (
    <form className={s.root} onSubmit={handleSubmit}>
      <FormTextField type="email" htmlFor="auth-email" label="Эл. почта" />
      <FormTextField type="password" htmlFor="auth-password" label="Пароль" />
      <FormButton type="submit" htmlFor="auth-submit" value="Войти" />
    </form>
  );
};

export default AuthForm;
