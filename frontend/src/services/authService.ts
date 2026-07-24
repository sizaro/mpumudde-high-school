import api from "../api/axios";


import type {
  LoginDto,
  LoginResponse,
  RegisterDto,
  User,
} from "../types/auth";



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


    return data;

  }




  async me(): Promise<User> {



    const { data } = await api.get<User>(

      "/auth/me",

    );



    return data;


  }



}



export default new AuthService();