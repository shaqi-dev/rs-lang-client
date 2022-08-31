import { API_USERS } from './endpoints';
import { INCORRECT_PASSWORD, UNEXPECTED_STATUS, USER_NOT_FOUND } from '../shared/authErrors';

const updateUserWord = async ({
  userId,
  wordId,
  userData,
  token,
}: {
  userId: string;
  wordId: string;
  userData: { difficulty: string | undefined; optional: { audiocall: number; sprint: number } };
  token: string;
}): Promise<{
  difficulty: string | undefined;
  optional: { audiocall: number; sprint: number } | undefined;
  error: Error | undefined;
}> => {
  try {
    const res = await fetch(`${API_USERS}/${userId}/words/${wordId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (res.status === 200) {
      const data = await res.json();

      return { difficulty: data.difficulty, optional: data.optional, error: undefined };
    }

    if (res.status === 403) throw INCORRECT_PASSWORD;

    if (res.status === 404) throw USER_NOT_FOUND;

    throw UNEXPECTED_STATUS;
  } catch (e) {
    return { difficulty: undefined, optional: undefined, error: e as Error };
  }
};

export default updateUserWord;
