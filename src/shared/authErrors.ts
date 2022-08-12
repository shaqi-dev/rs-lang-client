export class AuthError extends Error {
  name: string;

  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const UNEXPECTED_STATUS = new AuthError('Unexpected response status');

export const INCORRECT_USER_DATA = new AuthError('Incorrect e-mail or password');

export const INCORRECT_PASSWORD = new AuthError('Incorrect password');

export const USER_ALREADY_EXISTS = new AuthError('User with this e-mail or name is already exists');

export const USER_NOT_FOUND = new AuthError('Incorrect e-mail');
