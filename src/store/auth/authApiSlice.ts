import useAuth from '../../services/useAuth';
import { SignInUserData } from '../../interfaces/signIn';

export const authApiSlice = useAuth.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userData: SignInUserData) => ({
        url: 'signin',
        method: 'POST',
        body: { ...userData },
      }),
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
