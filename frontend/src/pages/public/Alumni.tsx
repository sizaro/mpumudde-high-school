import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSearchParams } from "react-router-dom";
import {
  AlumniRegistrationForm,
} from "../../components/alumni";
import AlumniLanding from "./alumni/AlumniLanding";

export default function Alumni() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    AOS.init({
      duration: 650,
      easing: "ease-out-cubic",
      once: true,
      offset: 70,
      disable: () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });

    return () => AOS.refreshHard();
  }, []);

  if (token) {
    return <AlumniRegistrationForm token={token} />;
  }

  return <AlumniLanding />;
}
