import { useState } from "react";

import type { FormEvent } from "react";

import { X } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";



interface LoginModalProps {

  onClose: () => void;

}



export default function LoginModal({

  onClose,

}: LoginModalProps) {



  const { login } = useAuth();


  const navigate = useNavigate();



  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);





  async function handleSubmit(

    e: FormEvent,

  ) {


    e.preventDefault();


    setError("");

    setLoading(true);



    try {


      const user = await login({

        email,

        password,

      });



      onClose();



      if (
        user.roles.includes("SUPER_ADMIN")
      ) {


        navigate("/director");


      }

      else if (
        user.roles.includes("TEACHER")
      ) {


        navigate("/teacher");


      }

      else if (
        user.roles.includes("PARENT")
      ) {


        navigate("/parent");


      }

      else if (
        user.roles.includes("STUDENT")
      ) {


        navigate("/student");


      }



    }

    catch (error: any) {


      setError(

        error.response?.data?.message ??

        "Login failed"

      );


    }

    finally {


      setLoading(false);


    }


  }





  return (


    <div

      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
      "

    >



      <div

        className="
          relative
          w-full
          max-w-md
          rounded-xl
          bg-white
          p-6
          shadow-xl
        "

      >



        <button

          onClick={onClose}

          className="
            absolute
            right-4
            top-4
            text-gray-500
            hover:text-gray-900
          "

        >

          <X size={20}/>

        </button>




        <h2

          className="
            mb-6
            text-2xl
            font-bold
          "

        >

          Account Login

        </h2>




        <form

          onSubmit={handleSubmit}

          className="space-y-4"

        >



          <div>


            <label className="block text-sm mb-1">

              Email

            </label>



            <input

              type="email"

              value={email}

              onChange={(e)=>
                setEmail(e.target.value)
              }

              className="
                w-full
                rounded-lg
                border
                px-3
                py-2
              "

              required

            />


          </div>





          <div>


            <label className="block text-sm mb-1">

              Password

            </label>




            <input

              type="password"

              value={password}

              onChange={(e)=>
                setPassword(e.target.value)
              }

              className="
                w-full
                rounded-lg
                border
                px-3
                py-2
              "

              required

            />



          </div>





          {
            error && (

              <p className="text-red-600 text-sm">

                {error}

              </p>

            )
          }





          <button

            type="submit"

            disabled={loading}

            className="
              w-full
              rounded-lg
              bg-blue-600
              py-2
              text-white
              hover:bg-blue-700
              disabled:opacity-50
            "

          >

            {
              loading
              ? "Signing in..."
              : "Sign In"
            }


          </button>




        </form>




      </div>




    </div>


  );

}