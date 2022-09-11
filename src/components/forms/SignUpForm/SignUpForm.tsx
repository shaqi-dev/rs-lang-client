import { FC, useRef, ReactNode, useState } from 'react';
import { useForm, useFormState, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import ErrorBanner from '../../ErrorBanner';
import Button from '../../Button';
import { useCreateUserMutation, useLoginMutation } from '../../../services/authApi';
import { useAppDispatch } from '../../../hooks/redux';
import { setCredentials } from '../../../store/auth/authSlice';
import { RE_EMAIL, RE_USERNAME, RE_PASSWORD } from '../../../shared/validationRE';
import {
  EMAIL_REQUIRED,
  EMAIL_NOT_VALID,
  USERNAME_REQUIRED,
  USERNAME_TOO_SHORT,
  PASSWORD_REQUIRED,
  PASSWORDS_NOT_MATCH,
  PASSWORD_REPEAT_REQUIRED,
  PASSWORD_TOO_WEAK,
} from '../../../shared/validationErrors';
import { isFetchBaseQueryError, isErrorWithMessage } from '../../../shared/queryErrorHelpers';
import { SignUpUserData, SignUpFormData } from '../../../interfaces/signUp';
import { SignInResponse } from '../../../interfaces/signIn';
import s from './SignUpForm.module.scss';

const SignUpForm: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, control, watch, reset } = useForm<SignUpFormData>({
    mode: 'onChange',
  });
  const { errors, isValid } = useFormState<SignUpFormData>({ control });
  const passwordRef = useRef<string>('');
  passwordRef.current = watch('password', '');

  const [apiError, setApiError] = useState<string>('');
  const [createUser, { isLoading, isError }] = useCreateUserMutation();
  const [loginUser] = useLoginMutation();

  const onSubmit: SubmitHandler<SignUpFormData> = async (
    formData: SignUpFormData,
  ): Promise<void> => {
    const { email, name, password } = formData;

    if (isValid) {
      const userData: SignUpUserData = {
        email,
        name,
        password,
      };

      try {
        await createUser(userData).unwrap();

        reset();
        if (!isError) {
          const data: SignInResponse = await loginUser({ email, password }).unwrap();
          const { name: username, userId, token: accessToken, refreshToken } = data;

          dispatch(
            setCredentials({
              username,
              userId,
              accessToken,
              refreshToken,
            }),
          );

          navigate(-1);
        }
      } catch (e) {
        console.log(e);
        if (isFetchBaseQueryError(e) && 'originalStatus' in e) {
          const errorMessage =
            (e.originalStatus === 417 && 'Пользователь с данной эл. почтой уже существует') ||
            e.data;
          setApiError(errorMessage);
        } else if (isErrorWithMessage(e)) {
          setApiError(e.message);
        }

        reset();
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
          pattern: {
            value: RE_EMAIL,
            message: EMAIL_NOT_VALID,
          },
        })}
      />
      <ErrorMessage errors={errors} name="email" render={renderErrorMessage} />
      <input
        type="text"
        placeholder="Имя"
        className={s.textInput}
        autoComplete="name"
        disabled={isLoading}
        {...register('name', {
          required: USERNAME_REQUIRED,
          pattern: {
            value: RE_USERNAME,
            message: USERNAME_TOO_SHORT,
          },
        })}
      />
      <ErrorMessage errors={errors} name="name" render={renderErrorMessage} />
      <input
        type="password"
        placeholder="Пароль"
        className={s.textInput}
        autoComplete="new-password"
        disabled={isLoading}
        {...register('password', {
          required: PASSWORD_REQUIRED,
          pattern: {
            value: RE_PASSWORD,
            message: PASSWORD_TOO_WEAK,
          },
        })}
      />
      <ErrorMessage errors={errors} name="password" render={renderErrorMessage} />
      <input
        type="password"
        placeholder="Повторите пароль"
        className={s.textInput}
        autoComplete="new-password"
        disabled={isLoading}
        {...register('passwordRepeat', {
          required: PASSWORD_REPEAT_REQUIRED,
          pattern: {
            value: RE_PASSWORD,
            message: PASSWORD_TOO_WEAK,
          },
          validate: (value) => value === passwordRef.current || PASSWORDS_NOT_MATCH,
        })}
      />
      <ErrorMessage errors={errors} name="passwordRepeat" render={renderErrorMessage} />
      <Button type="submit" buttonStyle="primary" disabled={isLoading} className={s.signUp}>
        Зарегистрироваться
      </Button>
    </form>
  );
};

export default SignUpForm;
