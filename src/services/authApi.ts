import useAuth from '../hooks/useAuth';
import type { SignInUserData, SignInResponse } from '../interfaces/signIn';

export const authApiSlice = useAuth.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<SignInResponse, SignInUserData>({
      query: (userData) => ({
        url: 'signin',
        method: 'POST',
        body: { ...userData },
      }),
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
