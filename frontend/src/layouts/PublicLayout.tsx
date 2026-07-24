import { Outlet } from "react-router-dom";

import Navbar from "../components/public/Navbar";
import Footer from "../components/public/Footer";
import { useTheme } from "../context/ThemeContext";


export default function PublicLayout(){
  const { theme } = useTheme();

return (

    <div className="relative min-h-screen overflow-hidden">
        {/* Animated background orbs - MORE VIBRANT in dark, subtle in light */}
        <div className="fixed inset-0 -z-10 transition-opacity duration-500">
          {theme === 'dark' ? (
            <>
              {/* Ultra dark theme - SUPER VIBRANT orbs */}
              <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-emerald-500/30 blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 h-[600px] w-[600px] rounded-full bg-cyan-500/30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] rounded-full bg-violet-500/30 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
              <div className="absolute bottom-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-amber-500/20 blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
            </>
          ) : (
            <>
              {/* Light theme - Subtle pastel orbs */}
              <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/2 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </>
          )}
        </div>

        <Navbar />

        <main className="pt-28">
            <Outlet />
        </main>

        <Footer />

    </div>

);

}