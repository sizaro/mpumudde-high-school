import api from "../api/axios";

import type {
  LoginDto,
  LoginResponse,
  RegisterDto,
  User,
} from "../types/auth";

const ACCESS_TOKEN_KEY = "mpumudde_access_token";

function setClientToken(token?: string) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

const storedToken = getStoredToken();
if (storedToken) {
  setClientToken(storedToken);
}

class AuthService {



  async login(

    loginDto: LoginDto,

  ): Promise<LoginResponse> {



    const { data } = await api.post<LoginResponse>(

      "/auth/login",

      loginDto,

    );



    return data;


  }


  async register(

    registerDto: RegisterDto,

  ): Promise<LoginResponse> {


    const { data } = await api.post<LoginResponse>(

      "/auth/register",

      registerDto,

    );

    if (data.access_token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
      setClientToken(data.access_token);
    }

    return data;

  }




  async me(): Promise<User> {



    const { data } = await api.get<User>(

      "/auth/me",

    );



    return data;


  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const { data } = await api.patch<{ message: string }>("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return data;
  }



}



export default new AuthService();
