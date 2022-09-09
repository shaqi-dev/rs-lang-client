export interface SignInUserData {
  email: string;
  password: string;
}

export interface SignInResponse {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface LoginUserResponse {
  data: SignInResponse | undefined;
  error: Error | undefined;
}
