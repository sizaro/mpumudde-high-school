import { Routes, Route } from "react-router-dom";


import PublicLayout from "../layouts/PublicLayout";

import ProtectedRoute from "./ProtectedRoute";



import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Academics from "../pages/public/Academics";
import Admissions from "../pages/public/Admissions";
import News from "../pages/public/News";
import Gallery from "../pages/public/Gallery";
import Contact from "../pages/public/Contact";



import DirectorDashboard from "../pages/director/Dashboard";
import TeacherDashboard from "../pages/teacher/Dashboard";
import ParentDashboard from "../pages/parent/Dashboard";
import StudentDashboard from "../pages/student/Dashboard";



export default function AppRoutes() {


  return (


    <Routes>


      {/* PUBLIC WEBSITE */}


      <Route element={<PublicLayout />}>


        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/about"
          element={<About />}
        />


        <Route
          path="/academics"
          element={<Academics />}
        />


        <Route
          path="/admissions"
          element={<Admissions />}
        />


        <Route
          path="/news"
          element={<News />}
        />


        <Route
          path="/gallery"
          element={<Gallery />}
        />


        <Route
          path="/contact"
          element={<Contact />}
        />


      </Route>





      {/* PROTECTED DASHBOARDS */}



      <Route

        path="/director"

        element={

          <ProtectedRoute roles={["SUPER_ADMIN"]}>

            <DirectorDashboard />

          </ProtectedRoute>

        }

      />





      <Route

        path="/teacher"

        element={

          <ProtectedRoute roles={["TEACHER"]}>

            <TeacherDashboard />

          </ProtectedRoute>

        }

      />





      <Route

        path="/parent"

        element={

          <ProtectedRoute roles={["PARENT"]}>

            <ParentDashboard />

          </ProtectedRoute>

        }

      />





      <Route

        path="/student"

        element={

          <ProtectedRoute roles={["STUDENT"]}>

            <StudentDashboard />

          </ProtectedRoute>

        }

      />



    </Routes>


  );

}