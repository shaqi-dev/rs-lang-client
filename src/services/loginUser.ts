import { API_SIGNIN } from './endpoints';
import { SignInUserData, SignInResponse, LoginUserResponse } from '../interfaces/signIn';
import { INCORRECT_PASSWORD, USER_NOT_FOUND, UNEXPECTED_STATUS } from '../shared/authErrors';

const loginUser = async (userData: SignInUserData): Promise<LoginUserResponse> => {
  try {
    const res = await fetch(API_SIGNIN, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (res.status === 200) {
      const data: SignInResponse = await res.json();

      return { data, error: undefined };
    }

    if (res.status === 403) throw INCORRECT_PASSWORD;

    if (res.status === 404) throw USER_NOT_FOUND;

    throw UNEXPECTED_STATUS;
  } catch (e) {
    return { data: undefined, error: e as Error };
  }
};

export default loginUser;
