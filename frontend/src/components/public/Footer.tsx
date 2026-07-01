import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20 w-full">

      <div className="w-full px-4 py-10 grid md:grid-cols-3 gap-8">

        {/* School Info */}
        <div>
          <h2 className="text-xl font-bold">
            Mpumudde High School
          </h2>
          <p className="text-sm mt-2 text-gray-300">
            Excellence, discipline, and service.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <p className="text-gray-300 text-sm">
            Email: info@mpumudde.ac.ug
          </p>
          <p className="text-gray-300 text-sm">
            Phone: +256 XXX XXX XXX
          </p>
        </div>

      </div>

      <div className="text-center text-sm py-4 border-t border-gray-700">
        © {new Date().getFullYear()} Mpumudde High School. All rights reserved.
      </div>

    </footer>
  );
}