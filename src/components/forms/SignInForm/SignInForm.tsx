import { FC, useState, ReactNode } from 'react';
import { useForm, useFormState, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import loginUser from '../../../services/loginUser';
import Button from '../../Button';
import { SignInUserData } from '../../../interfaces/signIn';
import s from './SignInForm.module.scss';
import ErrorBanner from '../../ErrorBanner';
import { EMAIL_REQUIRED, PASSWORD_REQUIRED } from '../../../shared/validationErrors';

const SignInForm: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<Error | null>(null);
  const { register, handleSubmit, control } = useForm<SignInUserData>();
  const { errors, isValid } = useFormState<SignInUserData>({ control });

  const onSubmit: SubmitHandler<SignInUserData> = async (
    userData: SignInUserData,
  ): Promise<void> => {
    if (isValid) {
      setServerError(null);
      setIsLoading(true);

      const { data, error } = await loginUser(userData);

      setIsLoading(false);

      if (error) setServerError(error);
      if (data) console.log(data);
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
