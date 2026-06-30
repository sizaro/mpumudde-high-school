import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Academics from "../pages/public/Academics";
import Admissions from "../pages/public/Admissions";
import News from "../pages/public/News";
import Gallery from "../pages/public/Gallery";
import Contact from "../pages/public/Contact";


export default function AppRoutes() {
  return (
    <Routes>

      <Route element={<PublicLayout />}>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

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

    </Routes>
  );
}