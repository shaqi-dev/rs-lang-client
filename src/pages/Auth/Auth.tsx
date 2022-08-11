import { FC, useState } from 'react';
import ContentWrapper from '../../layouts/ContentWrapper';
import AuthForm from '../../components/forms/AuthForm';
import SignUpForm from '../../components/forms/SignUpForm';
import LinkButton from '../../components/LinkButton';
import s from './Auth.module.scss';

type FormState = 'signIn' | 'signUp';

const Auth: FC = () => {
  const [form, setForm] = useState<FormState>('signIn');

  const toggleForm = (): void => {
    setForm(form === 'signIn' ? 'signUp' : 'signIn');
  };

  const switchToSignUp = (
    <p className={s.switch}>
      Нет аккаунта?{' '}
      <LinkButton type="button" onClick={toggleForm}>
        Зарегистрироваться
      </LinkButton>
    </p>
  );

  const switchToSignIn = (
    <p className={s.switch}>
      Уже есть аккаунт?{' '}
      <LinkButton type="button" onClick={toggleForm}>
        Войти
      </LinkButton>
    </p>
  );

  return (
    <ContentWrapper className={s.wrapper}>
      {form === 'signIn' ? <AuthForm /> : <SignUpForm />}
      {form === 'signIn' ? switchToSignUp : switchToSignIn}
    </ContentWrapper>
  );
};

export default Auth;
