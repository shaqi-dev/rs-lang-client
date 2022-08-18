import useAuth from '../hooks/useAuth';
import type { SignInUserData, SignInResponse } from '../interfaces/signIn';
import type { SignUpResponse, SignUpUserData } from '../interfaces/signUp';

export const authApiSlice = useAuth.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<SignInResponse, SignInUserData>({
      query: (userData) => ({
        url: 'signin',
        method: 'POST',
        body: { ...userData },
      }),
    }),
    createUser: builder.mutation<SignUpResponse, SignUpUserData>({
      query: (userData) => ({
        url: 'users',
        method: 'POST',
        body: { ...userData },
      }),
    }),
  }),
});

export const { useLoginMutation, useCreateUserMutation } = authApiSlice;
