import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaWhatsapp, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { publicNavigation } from "../../config/publicNavigation";

const socials = [
  { href: "https://facebook.com/mpumuddehighschool", label: "Facebook", icon: FaFacebook },
  { href: "https://x.com/mpumuddehs", label: "X", icon: FaXTwitter },
  { href: "https://instagram.com/mpumuddehighschool", label: "Instagram", icon: FaInstagram },
  { href: "https://youtube.com/@mpumuddehighschool", label: "YouTube", icon: FaYoutube },
  { href: "https://www.tiktok.com/@mpumuddehighschool", label: "TikTok", icon: FaTiktok },
  { href: "https://www.linkedin.com/company/mpumudde-high-school", label: "LinkedIn", icon: FaLinkedin },
  { href: "https://whatsapp.com/channel/xxxxxxxx", label: "WhatsApp", icon: FaWhatsapp },
];

export default function Footer() {
  return (
    <footer className="mt-0 bg-[#031c35] text-white">
      <div className="border-b border-white/10">
        <div className="site-container grid gap-10 py-12 sm:py-14 md:grid-cols-2 xl:grid-cols-[1.35fr_.7fr_1.2fr_1.25fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3" aria-label="Mpumudde High School home">
              <span className="grid h-12 w-12 place-items-center rounded-md border border-[#f2c64c]/80 bg-[#0a3768] text-xs font-black tracking-tight text-[#f2c64c]">MHS</span>
              <span><span className="block text-lg font-extrabold">Mpumudde High School</span><span className="mt-0.5 block text-xs font-semibold text-white/70">Excellence · Discipline · Service</span></span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-6 text-white/75">We equip learners with strong academics, discipline, leadership values, and practical life skills that prepare them for meaningful impact in society.</p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Explore</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2 text-sm xl:grid-cols-1">
              {publicNavigation.map((link) => <li key={link.to}><Link to={link.to} className="text-white/70 transition hover:text-[#f2c64c]">{link.label}</Link></li>)}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Contact</h2>
            <div className="mt-4 space-y-3 text-sm text-white/75">
              <p className="flex gap-3"><MapPin size={17} className="mt-0.5 shrink-0 text-[#f2c64c]"/>Mpumudde, Jinja District, Uganda</p>
              <p className="flex gap-3"><Phone size={17} className="shrink-0 text-[#f2c64c]"/>+256 312 345 678</p>
              <p className="flex gap-3"><Mail size={17} className="shrink-0 text-[#f2c64c]"/>info@mpumuddehs.ac.ug</p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">Connect With Us</h2>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-3">
              {socials.map((social) => { const Icon = social.icon; return <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="text-lg text-white/85 transition hover:-translate-y-0.5 hover:text-[#f2c64c]" aria-label={social.label}><Icon /></a>; })}
            </div>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/70">Follow our verified channels for admissions updates, announcements, and student achievement stories.</p>
          </div>
        </div>
      </div>
      <div className="bg-[#021426]">
        <div className="site-container flex flex-col items-center justify-between gap-3 py-4 text-xs text-white/60 md:flex-row">
          <p>© {new Date().getFullYear()} Mpumudde High School. All rights reserved.</p>
          <p>Developed by <a href="https://sizaforgeltd.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-white/80 transition hover:text-[#f2c64c]">SizaForge Technologies Ltd.</a></p>
        </div>
      </div>
    </footer>
  );
}
