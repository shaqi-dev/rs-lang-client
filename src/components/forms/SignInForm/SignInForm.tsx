import { FC, useState, ReactNode } from 'react';
import { useForm, useFormState, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { EMAIL_REQUIRED, PASSWORD_REQUIRED } from '../../../shared/validationErrors';
import Button from '../../Button';
import ErrorBanner from '../../ErrorBanner';
import { useAppDispatch } from '../../../hooks/redux';
import { useLoginMutation } from '../../../store/auth/authApiSlice';
import { setCredentials } from '../../../store/auth/authSlice';
import type { SignInResponse, SignInUserData } from '../../../interfaces/signIn';
import s from './SignInForm.module.scss';

const SignInForm: FC = () => {
  const [, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<Error | null>(null);
  const { register, handleSubmit, control } = useForm<SignInUserData>();
  const { errors, isValid } = useFormState<SignInUserData>({ control });

  const [loginUser, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<SignInUserData> = async (
    userData: SignInUserData,
  ): Promise<void> => {
    if (isValid) {
      setServerError(null);
      setLoading(true);

      try {
        const data: SignInResponse = await loginUser(userData).unwrap();
        const { name: username, userId, token: accessToken, refreshToken } = data;

        dispatch(
          setCredentials({
            username,
            userId,
            accessToken,
            refreshToken,
          }),
        );
      } catch (e) {
        setServerError(e as Error);
      }

      setLoading(false);
    }
  };

  const handleChange = (): void => {
    if (serverError) setServerError(null);
  };

  const renderErrorMessage = ({ message }: { message: string }): ReactNode => (
    <p className={s.validateError}>{message}</p>
  );

  return (
    <form className={s.root} onSubmit={handleSubmit(onSubmit)} onChange={handleChange}>
      {serverError && <ErrorBanner>{serverError.message}</ErrorBanner>}
      <input
        type="email"
        placeholder="Эл. почта"
        className={s.textInput}
        autoComplete="email"
        disabled={isLoading}
        {...register('email', {
          required: EMAIL_REQUIRED,
        })}
      />
      <ErrorMessage errors={errors} name="email" render={renderErrorMessage} />
      <input
        type="password"
        placeholder="Пароль"
        className={s.textInput}
        autoComplete="current-password"
        disabled={isLoading}
        {...register('password', {
          required: PASSWORD_REQUIRED,
        })}
      />
      <ErrorMessage errors={errors} name="password" render={renderErrorMessage} />
      <Button type="submit" buttonStyle="primary" disabled={isLoading}>
        Войти
      </Button>
    </form>
  );
};

export default SignInForm;
