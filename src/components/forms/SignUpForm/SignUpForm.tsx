import { FC, FormEvent } from 'react';
import FormTextField from '../FormTextField';
import Button from '../../Button';
import s from './SignUpForm.module.scss';

const SignUpForm: FC = () => {
  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    console.log('signup form submit');
  };

  return (
    <form className={s.root} onSubmit={handleSubmit}>
      <FormTextField type="email" htmlFor="auth-email" label="Эл. почта" autoComplete="email" />
      <FormTextField type="text" htmlFor="auth-name" label="Имя" autoComplete="name" />
      <FormTextField
        type="password"
        htmlFor="auth-password"
        label="Пароль"
        autoComplete="new-password"
      />
      <FormTextField
        type="password"
        htmlFor="auth-password"
        label="Повторите пароль"
        autoComplete="new-password"
      />
      <Button type="submit" buttonStyle="primary">
        Зарегистрироваться
      </Button>
    </form>
  );
};

export default SignUpForm;
