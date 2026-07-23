import { useState } from "react";

import { Menu, X } from "lucide-react";

import { Link } from "react-router-dom";

import LoginModal from "../auth/LoginModal";


export default function Navbar() {


  const [open, setOpen] = useState(false);

  const [showLogin, setShowLogin] = useState(false);



  return (

    <nav className="w-full shadow-md bg-white fixed top-0 left-0 z-50">


      {/* TOP BAR */}

      <div className="flex items-center justify-between px-4 py-3">



        <Link

          to="/"

          className="flex items-center gap-3 transition-opacity hover:opacity-90"

          aria-label="Go to Mpumudde High School homepage"

        >

          <img

            src="/logo.png"

            alt="Mpumudde High School logo"

            className="h-10 w-10 object-contain"

          />


          <div className="leading-tight">

            <h5 className="text-lg text-slate-900">

              Mpumudde High School

            </h5>


            <p className="text-xs text-slate-600">

              Excellence • Discipline • Service

            </p>


          </div>


        </Link>





        {/* Desktop Links */}

        <div className="hidden md:flex gap-6 items-center font-medium">


          <Link to="/">
            Home
          </Link>


          <Link to="/about">
            About
          </Link>


          <Link to="/academics">
            Academics
          </Link>


          <Link to="/news">
            News
          </Link>

          <Link to="/news-room">
            News Room
          </Link>


          <Link to="/contact">
            Contact
          </Link>



          <button

            onClick={() => setShowLogin(true)}

            className="
              rounded-lg
              bg-blue-600
              px-4
              py-2
              text-white
              hover:bg-blue-700
            "

          >

            Account

          </button>



        </div>





        {/* Mobile Menu Button */}

        <button

          className="md:hidden"

          onClick={() => setOpen(true)}

        >

          <Menu />

        </button>


      </div>






      {/* OVERLAY */}

      {open && (

        <div

          className="fixed inset-0 bg-black/40"

          onClick={() => setOpen(false)}

        />

      )}






      {/* MOBILE MENU */}

      <div

        className={`fixed top-0 right-0 h-full w-[70vw] bg-white shadow-lg transform transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "translate-x-full"}`}

      >



        {/* Header */}

        <div className="flex items-center justify-between p-4 border-b">


          <span className="font-bold">

            Menu

          </span>



          <button onClick={() => setOpen(false)}>

            <X />

          </button>


        </div>





        {/* Links */}

        <div className="flex flex-col gap-4 p-4 font-medium">


          <Link onClick={() => setOpen(false)} to="/">
            Home
          </Link>


          <Link onClick={() => setOpen(false)} to="/about">
            About
          </Link>


          <Link onClick={() => setOpen(false)} to="/academics">
            Academics
          </Link>


          <Link onClick={() => setOpen(false)} to="/news">
            News
          </Link>

          <Link onClick={() => setOpen(false)} to="/news-room">
            News Room
          </Link>


          <Link onClick={() => setOpen(false)} to="/contact">
            Contact
          </Link>



          <button

            onClick={() => {

              setOpen(false);

              setShowLogin(true);

            }}

            className="
              rounded-lg
              bg-blue-600
              px-4
              py-2
              text-white
            "

          >

            Account

          </button>



        </div>



      </div>






      {/* LOGIN MODAL */}

      {showLogin && (

        <LoginModal

          onClose={() => setShowLogin(false)}

        />

      )}



    </nav>

  );

}