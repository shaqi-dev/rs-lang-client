import { API_WORDS } from './endpoints';
import { UNEXPECTED_STATUS } from '../shared/authErrors';
import type {
  Word,
  GetWordsData,
  GetWordsResponse,
  GetWordByIdResponse,
} from '../interfaces/words';

export const getWords = async ({ group, page }: GetWordsData): Promise<GetWordsResponse> => {
  try {
    const res = await fetch(`${API_WORDS}?group=${group}&page=${page}`);

    if (res.status === 200) {
      const data: Word[] = await res.json();

      return { data, error: undefined };
    }

    throw UNEXPECTED_STATUS;
  } catch (e) {
    return { data: undefined, error: e as Error };
  }
};

export const getWordById = async (id: number): Promise<GetWordByIdResponse> => {
  try {
    const res = await fetch(`${API_WORDS}/${id}`);

    if (res.status === 200) {
      const data: Word = await res.json();

      return { data, error: undefined };
    }

    throw UNEXPECTED_STATUS;
  } catch (e) {
    return { data: undefined, error: e as Error };
  }
};
