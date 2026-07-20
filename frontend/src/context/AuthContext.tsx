import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";


import type { ReactNode } from "react";


import AuthService from "../services/authService";


import type {
  User,
  LoginDto,
} from "../types/auth";




interface AuthContextType {


  user: User | null;


  loading: boolean;


  isAuthenticated: boolean;



  login: (

    loginDto: LoginDto

  ) => Promise<User>;



  logout: () => void;



  hasRole: (

    role: string

  ) => boolean;



  hasPermission: (

    permission: string

  ) => boolean;



}






const AuthContext = createContext<

  AuthContextType | undefined

>(undefined);






interface Props {

  children: ReactNode;

}







export function AuthProvider({

  children,

}: Props) {



  const [user, setUser] = useState<User | null>(null);



  const [loading, setLoading] = useState(true);






  useEffect(() => {


    async function loadUser() {


      try {


        const currentUser =

          await AuthService.me();



        setUser(currentUser);



      }


      catch {


        setUser(null);


      }


      finally {


        setLoading(false);


      }


    }



    loadUser();



  }, []);









  async function login(

    loginDto: LoginDto,

  ): Promise<User> {



    setLoading(true);



    try {



      const response =

        await AuthService.login(loginDto);




      setUser(response.user);



      return response.user;



    }



    finally {


      setLoading(false);


    }


  }









  function logout() {



    setUser(null);



  }









  function hasRole(

    role: string,

  ) {



    return (

      user?.roles.includes(role)

      ?? false

    );


  }









  function hasPermission(

    permission: string,

  ) {



    return (

      user?.permissions.includes(permission)

      ?? false

    );


  }









  const value = useMemo(


    () => ({



      user,



      loading,



      isAuthenticated: !!user,



      login,



      logout,



      hasRole,



      hasPermission,



    }),



    [


      user,


      loading,


    ],



  );








  return (


    <AuthContext.Provider

      value={value}

    >


      {children}


    </AuthContext.Provider>


  );


}









export function useAuth() {



  const context = useContext(AuthContext);



  if (!context) {


    throw new Error(

      "useAuth must be used inside AuthProvider",

    );


  }



  return context;



}