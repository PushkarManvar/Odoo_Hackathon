export interface SafeUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResult {
  user: SafeUser;
  token: string;
}