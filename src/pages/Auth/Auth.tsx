import { FC, useState } from 'react';
import ContentWrapper from '../../layouts/ContentWrapper';
import SignInForm from '../../components/forms/SignInForm';
import SignUpForm from '../../components/forms/SignUpForm';
import Button from '../../components/Button';
import s from './Auth.module.scss';

type FormState = 'signIn' | 'signUp';

const Auth: FC = () => {
  const [form, setForm] = useState<FormState>('signIn');

  const toggleForm = (): void => {
    setForm(form === 'signIn' ? 'signUp' : 'signIn');
  };

  return (
    <ContentWrapper className={s.wrapper}>
      <p className={s.title}>Авторизация</p>
      {form === 'signIn' ? <SignInForm /> : <SignUpForm />}
      <Button type="button" buttonStyle="secondary" onClick={toggleForm} className={s.switch}>
        {form === 'signIn' ? 'Зарегистрироваться' : 'Войти'}
      </Button>
    </ContentWrapper>
  );
};

export default Auth;

// 007965, F58634, FFCC29
