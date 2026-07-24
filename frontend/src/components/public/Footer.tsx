import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Academics", to: "/academics" },
  { label: "Admissions", to: "/admissions" },
  { label: "News", to: "/news" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

const socials = [
  { href: "https://facebook.com/mpumuddehighschool", label: "Facebook", icon: FaFacebook },
  { href: "https://x.com/mpumuddehs", label: "X", icon: FaXTwitter },
  { href: "https://instagram.com/mpumuddehighschool", label: "Instagram", icon: FaInstagram },
  { href: "https://youtube.com/@mpumuddehighschool", label: "YouTube", icon: FaYoutube },
  { href: "https://www.tiktok.com/@mpumuddehighschool", label: "TikTok", icon: FaTiktok },
  {
    href: "https://www.linkedin.com/company/mpumudde-high-school",
    label: "LinkedIn",
    icon: FaLinkedin,
  },
  { href: "https://whatsapp.com/channel/xxxxxxxx", label: "WhatsApp", icon: FaWhatsapp },
];

export default function Footer() {
  return (
    <footer className="relative mt-20">
      <div className="glass-card site-container grid gap-10 py-14 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <h3 className="text-2xl font-extrabold text-white">Mpumudde High School</h3>
          <p className="mt-4 text-sm leading-7 text-white/70">
            We equip learners with strong academics, discipline, leadership values, and practical
            life skills that prepare them for meaningful impact in society.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Explore</h4>
          <ul className="mt-4 space-y-3 text-sm">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-white/70 transition-colors hover:text-emerald-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Contact</h4>
          <div className="mt-4 space-y-4 text-sm">
            <p className="flex gap-3 text-white/70">
              <MapPin size={18} className="mt-0.5 shrink-0 text-emerald-400" />
              Mpumudde, Jinja District, Uganda
            </p>
            <p className="flex gap-3 text-white/70">
              <Phone size={18} className="shrink-0 text-emerald-400" />
              +256 312 345 678
            </p>
            <p className="flex gap-3 text-white/70">
              <Mail size={18} className="shrink-0 text-emerald-400" />
              info@mpumuddehs.ac.ug
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
            Connect With Us
          </h4>
          <div className="mt-4 flex flex-wrap gap-3">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card rounded-xl p-2.5 text-white/80 transition-all hover:text-emerald-300"
                  aria-label={social.label}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
          <p className="mt-5 text-sm leading-6 text-white/60">
            Follow our verified channels for admissions updates, announcements, and student
            achievement stories.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="site-container flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} Mpumudde High School. All rights reserved.</p>
          <p>
            Developed by{" "}
            <a
              href="https://sizaforgeltd.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
            >
              SizaForge Technologies Ltd.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}