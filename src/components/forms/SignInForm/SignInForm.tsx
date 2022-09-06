import { FC, useState, ReactNode } from 'react';
import { useForm, useFormState, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { EMAIL_REQUIRED, PASSWORD_REQUIRED } from '../../../shared/validationErrors';
import Button from '../../Button';
import ErrorBanner from '../../ErrorBanner';
import { useAppDispatch } from '../../../hooks/redux';
import { useLoginMutation } from '../../../services/authApi';
import { setCredentials } from '../../../store/auth/authSlice';
import type { SignInResponse, SignInUserData } from '../../../interfaces/signIn';
import { isFetchBaseQueryError, isErrorWithMessage } from '../../../shared/queryErrorHelpers';
import s from './SignInForm.module.scss';

const SignInForm: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, control, reset } = useForm<SignInUserData>({ mode: 'onChange' });
  const { errors, isValid } = useFormState<SignInUserData>({ control });

  const [apiError, setApiError] = useState<string>('');
  const [loginUser, { isLoading }] = useLoginMutation();

  const onSubmit: SubmitHandler<SignInUserData> = async (
    userData: SignInUserData,
  ): Promise<void> => {
    if (isValid) {
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

        reset();
        navigate(-1);
      } catch (e) {
        if (isFetchBaseQueryError(e) && 'originalStatus' in e) {
          const errorMessage =
            (e.originalStatus === 404 && 'Вы ввели неверную эл. почту') ||
            (e.originalStatus === 403 && 'Вы ввели неверный пароль') ||
            e.data;
          setApiError(errorMessage);
        } else if (isErrorWithMessage(e)) {
          setApiError(e.message);
        }
      }
    }
  };

  const renderErrorMessage = ({ message }: { message: string }): ReactNode => (
    <p className={s.validateError}>{message}</p>
  );

  return (
    <form className={s.root} onSubmit={handleSubmit(onSubmit)}>
      {apiError && <ErrorBanner>{apiError}</ErrorBanner>}
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
