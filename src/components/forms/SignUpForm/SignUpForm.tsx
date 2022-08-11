import { FC, FormEvent } from 'react';
import FormTextField from '../FormTextField';
import FormButton from '../FormButton';
import s from './SignUpForm.module.scss';

const SignUpForm: FC = () => {
  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    console.log('signup form submit');
  };

  return (
    <form className={s.root} onSubmit={handleSubmit}>
      <FormTextField type="email" htmlFor="auth-email" label="Эл. почта" />
      <FormTextField type="text" htmlFor="auth-name" label="Имя" />
      <FormTextField type="password" htmlFor="auth-password" label="Пароль" />
      <FormTextField type="password" htmlFor="auth-password" label="Повторите пароль" />
      <FormButton type="submit" htmlFor="auth-submit" value="Зарегистрироваться" />
    </form>
  );
};

export default SignUpForm;
