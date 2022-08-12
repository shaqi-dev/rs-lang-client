export class SignUpError extends Error {
  name: string;

  constructor(message: string) {
    super(message);
    this.name = 'SignUpError';
  }
}

export const UNEXPECTED_STATUS = new SignUpError('Unexpected response status');

export const INCORRECT_SIGNUP_DATA = new SignUpError('Incorrect e-mail or password');

export const USERS_ALREADY_EXISTS = new SignUpError(
  'User with this e-mail or name is already exists',
);
