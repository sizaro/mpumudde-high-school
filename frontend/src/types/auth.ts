export interface User {

  id: string;

  email: string;

  roles: string[];

  permissions: string[];

}

export interface LoginResponse {

  access_token: string;

  user: User;

}

export interface LoginDto {

  email: string;

  password: string;

}