import { Outlet } from "react-router-dom";
import Footer from "../components/public/Footer";
import Navbar from "../components/public/Navbar";

export default function PublicLayout() {
  return (
    <div className="public-site min-h-screen">
      <a href="#public-content" className="skip-link">Skip to main content</a>
      <div className="public-ambient" aria-hidden="true">
        <span className="public-ambient__glow public-ambient__glow--one" />
        <span className="public-ambient__glow public-ambient__glow--two" />
      </div>
      <Navbar />
      <main id="public-content" className="public-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
