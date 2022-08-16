import { FC, FormEvent } from 'react';
import Button from '../../Button';
import s from './SignInForm.module.scss';

const AuthForm: FC = () => {
  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    console.log('auth form submit');
  };

  return (
    <form className={s.root} onSubmit={handleSubmit}>
      <input type="email" placeholder="Эл. почта" className={s.textInput} autoComplete="email" />
      <input
        type="password"
        placeholder="Пароль"
        className={s.textInput}
        autoComplete="current-password"
      />
      <Button type="submit" buttonStyle="primary">
        Войти
      </Button>
    </form>
  );
};

export default AuthForm;
