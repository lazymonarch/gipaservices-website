import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-[#F5F3F0] text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-yellow-400 font-bold text-slate-900 text-xs">
                G
              </div>
              <span className="text-lg font-semibold text-slate-900">GIPA Services</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              GIPA Services Limited is a UK-registered company providing professional HGV logistics and transport services nationwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2.5">Menue</h4>
            <nav className="flex flex-col gap-1">
              <Link href="/" className="text-sm text-slate-600 hover:text-amber-600 transition">Home</Link>
              <Link href="/our-story" className="text-sm text-slate-600 hover:text-amber-600 transition">Our Story</Link>
              <Link href="/contact" className="text-sm text-slate-600 hover:text-amber-600 transition">Contact</Link>
              <Link href="/driver-application" className="text-sm text-slate-600 hover:text-amber-600 transition">Driver Application</Link>
              <Link href="/privacy-policy" className="text-sm text-slate-600 hover:text-amber-600 transition">Privacy Policy</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2.5">Contact</h4>
            <div className="text-sm text-slate-600 space-y-0.5 leading-relaxed">
              <p>6 Glen Way, Oadby</p>
              <p>Leicester, LE2 5YE</p>
              <p>United Kingdom</p>
              <p className="pt-1">
                <a href="mailto:info@gipaservices.com" className="text-sm text-slate-600 hover:text-amber-600 transition">
                  info@gipaservices.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-4 pt-2.5 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} GIPA Services Limited.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
