import useAuth from '../hooks/useAuth';
import { UserSettingsResponse, UserSettingsBody } from '../interfaces/userSettings';

export const authApiSlice = useAuth.injectEndpoints({
  endpoints: (builder) => ({
    getUserSettings: builder.query<UserSettingsResponse, string>({
      query: (userId) => `users/${userId}/settings`,
    }),
    updateUserSettings: builder.mutation<
      UserSettingsResponse,
      { userId: string; body: UserSettingsBody }
    >({
      query: ({ userId, body }) => ({
        url: `users/${userId}/settings`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const {
  useGetUserSettingsQuery,
  useLazyGetUserSettingsQuery,
  useUpdateUserSettingsMutation,
} = authApiSlice;
