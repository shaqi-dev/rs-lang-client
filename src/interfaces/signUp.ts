export interface SignUpUserData {
  name: string;
  email: string;
  password: string;
}

interface SignUpAdditionalFormData {
  passwordRepeat: string;
}

export type SignUpFormData = SignUpUserData & SignUpAdditionalFormData;

export interface SignUpResponse {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserResponse {
  data: SignUpResponse | undefined;
  error: Error | undefined;
}
