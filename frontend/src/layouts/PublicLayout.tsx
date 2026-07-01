import { Outlet } from "react-router-dom";

import Navbar from "../components/public/Navbar";
import Footer from "../components/public/Footer";


export default function PublicLayout(){

return (

    <>

        <Navbar />

        <main className="pt-20">
            <Outlet />
        </main>

        <Footer />

    </>

);

}