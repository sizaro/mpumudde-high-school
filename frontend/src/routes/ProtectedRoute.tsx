import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";



interface ProtectedRouteProps {

  children: ReactNode;

  roles?: string[];

}



export default function ProtectedRoute({

  children,

  roles = [],

}: ProtectedRouteProps) {



  const {

    isAuthenticated,

    hasRole,

    loading,

  } = useAuth();





  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center">

        Loading...

      </div>

    );

  }





  if (!isAuthenticated) {

    return (

      <Navigate

        to="/"

        replace

      />

    );

  }





  if (

    roles.length > 0 &&

    !roles.some((role) => hasRole(role))

  ) {

    return (

      <Navigate

        to="/"

        replace

      />

    );

  }





  return children;

}