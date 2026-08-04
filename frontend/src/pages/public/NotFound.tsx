import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section-shell flex min-h-[55svh] items-center justify-center text-center">
      <div className="max-w-xl">
        <p className="section-badge">Page not found</p>
        <h1 className="section-title">The page you requested is unavailable.</h1>
        <p className="section-lead mx-auto">The address may have changed, or the link may no longer be in use.</p>
        <Link to="/" className="public-primary-button mt-8 inline-flex"><ArrowLeft size={17} />Return home</Link>
      </div>
    </section>
  );
}
