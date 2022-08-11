import { FC, useState } from 'react';
import ContentWrapper from '../../layouts/ContentWrapper';
import AuthForm from '../../components/forms/AuthForm';
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
      {form === 'signIn' ? <AuthForm /> : <SignUpForm />}
      <Button type="button" buttonStyle="secondary" onClick={toggleForm} className={s.switch}>
        {form === 'signIn' ? 'Зарегистрироваться' : 'Войти'}
      </Button>
    </ContentWrapper>
  );
};

export default Auth;
