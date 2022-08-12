import { API_USERS } from './endpoints';
import { SignUpUserData, SignUpResponse, CreateUserResponse } from '../interfaces/signUp';
import { UNEXPECTED_STATUS, INCORRECT_SIGNUP_DATA, USERS_ALREADY_EXISTS } from './errors';

const createUser = async (userData: SignUpUserData): Promise<CreateUserResponse> => {
  try {
    const res = await fetch(API_USERS, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (res.status === 200) {
      const data: SignUpResponse = await res.json();

      return { data, error: undefined };
    }

    if (res.status === 417) throw USERS_ALREADY_EXISTS;

    if (res.status === 422) throw INCORRECT_SIGNUP_DATA;

    throw UNEXPECTED_STATUS;
  } catch (e: unknown) {
    return { data: undefined, error: e as Error };
  }
};

export default createUser;
