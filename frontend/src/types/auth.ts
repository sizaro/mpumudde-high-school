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

export interface RegisterDto {

  email: string;

  password: string;

  role: string;

  firstName?: string;

  lastName?: string;

  phone?: string;

  relationship?: string;

}