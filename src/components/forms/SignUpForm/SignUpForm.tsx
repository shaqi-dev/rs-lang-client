import { FC, useRef, useState, ReactNode } from 'react';
import { useForm, useFormState, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import ErrorBanner from '../../ErrorBanner';
import Button from '../../Button';
import createUser from '../../../services/createUser';
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
import { SignUpUserData, SignUpFormData } from '../../../interfaces/signUp';
import s from './SignUpForm.module.scss';

const SignUpForm: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<Error | null>(null);
  const { register, handleSubmit, control, watch } = useForm<SignUpFormData>();
  const { errors, isValid } = useFormState<SignUpFormData>({ control });
  const passwordRef = useRef<string>('');
  passwordRef.current = watch('password', '');

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

      setServerError(null);
      setIsLoading(true);

      const { data, error } = await createUser(userData);

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
      <Button type="submit" buttonStyle="primary" disabled={isLoading}>
        Зарегистрироваться
      </Button>
    </form>
  );
};

export default SignUpForm;
