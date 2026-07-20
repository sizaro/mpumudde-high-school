import { Link } from "react-router-dom";

import {
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaLinkedin,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-20">

      <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-4 md:grid-cols-2 gap-10">

        {/* School */}
        <div>
          <h3 className="text-2xl font-bold text-white">
            Mpumudde High School
          </h3>

          <p className="mt-4 text-sm leading-7">
            Excellence in Education, Character, and Leadership.
            We are committed to nurturing responsible citizens
            through quality education, discipline, innovation,
            and Christian values.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">
            Quick Links
          </h4>

          <ul className="space-y-3 text-sm">

            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>

            <li>
              <Link to="/about" className="hover:text-white">
                About Us
              </Link>
            </li>

            <li>
              <Link to="/academics" className="hover:text-white">
                Academics
              </Link>
            </li>

            <li>
              <Link to="/admissions" className="hover:text-white">
                Admissions
              </Link>
            </li>

            <li>
              <Link to="/news" className="hover:text-white">
                News & Events
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>

          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">
            Contact
          </h4>

          <div className="space-y-4 text-sm">

            <div className="flex gap-3">
              <MapPin size={18} className="mt-1 text-green-500" />
              <span>
                Mpumudde, Jinja District
                <br />
                Uganda
              </span>
            </div>

            <div className="flex gap-3">
              <Phone size={18} className="text-green-500" />
              <span>+256 XXX XXX XXX</span>
            </div>

            <div className="flex gap-3">
              <Mail size={18} className="text-green-500" />
              <span>info@mpumuddehighschool.ac.ug</span>
            </div>

          </div>
        </div>

        {/* Social */}
        
        {/* Social */}
<div>
  <h4 className="text-white font-semibold mb-4">
    Connect With Us
  </h4>

  <div className="flex flex-wrap gap-4">

    <a
      href="https://facebook.com/mpumuddehighschool"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white transition"
      aria-label="Facebook"
    >
      <FaFacebook size={22} />
    </a>

    <a
      href="https://x.com/mpumuddehs"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white transition"
      aria-label="X"
    >
      <FaXTwitter size={22} />
    </a>

    <a
      href="https://instagram.com/mpumuddehighschool"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white transition"
      aria-label="Instagram"
    >
      <FaInstagram size={22} />
    </a>

    <a
      href="https://youtube.com/@mpumuddehighschool"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white transition"
      aria-label="YouTube"
    >
      <FaYoutube size={22} />
    </a>

    <a
      href="https://www.tiktok.com/@mpumuddehighschool"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white transition"
      aria-label="TikTok"
    >
      <FaTiktok size={22} />
    </a>

    <a
      href="https://www.linkedin.com/company/mpumudde-high-school"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white transition"
      aria-label="LinkedIn"
    >
      <FaLinkedin size={22} />
    </a>

    <a
      href="https://whatsapp.com/channel/xxxxxxxx"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white transition"
      aria-label="WhatsApp Channel"
    >
      <FaWhatsapp size={22} />
    </a>

  </div>

  <p className="mt-6 text-sm leading-6">
    Stay connected for announcements, admissions, academic updates,
    student achievements, and upcoming school events.
  </p>

  <p className="mt-4 text-xs text-gray-400 leading-5">
    These are the official Mpumudde High School communication channels.
    Follow only these verified accounts for authentic school updates and announcements.
  </p>
</div>

      </div>

      <div className="border-t border-slate-800">

        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">

          <p>
            © {new Date().getFullYear()} Mpumudde High School. All Rights Reserved.
          </p>

          <div className="flex gap-6">

            <Link to="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>

            <Link to="/terms" className="hover:text-white">
              Terms of Use
            </Link>

          </div>

        </div>

      </div>

      <div className="bg-slate-950 border-t border-slate-800">

        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-xs text-gray-500">

          Website designed, developed, and maintained by{" "}
          <a
            href="https://sizaforgeltd.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 font-medium"
          >
            SizaForge Technologies Ltd.
          </a>

        </div>

      </div>

    </footer>
  );
}