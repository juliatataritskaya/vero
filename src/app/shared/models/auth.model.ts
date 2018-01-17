export interface ILoginData {
  username: string;
  password: string;
}

export interface ILoginSuccessResponse {
  bearerToken: string;
  refreshToken: string;
  bearerExpires: number;
  refreshExpires: number;
}

export interface IEmail {
  email: string;
}
