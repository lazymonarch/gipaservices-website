import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t bg-accent text-accent-foreground">
      <div className="container-narrow section-padding py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary font-bold text-primary-foreground text-xs">
                G
              </div>
              <span className="text-lg font-semibold">GIPA Services</span>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              GIPA Services Limited is a UK-registered company providing professional HGV logistics and transport services nationwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-70">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Home</Link>
              <Link href="/our-story" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Our Story</Link>
              <Link href="/contact" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Contact</Link>
              <Link href="/driver-application" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Driver Application</Link>
              <span className="text-sm opacity-80">Privacy Policy</span>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-70">Contact</h4>
            <div className="text-sm opacity-80 space-y-1 leading-relaxed">
              <p>6 Glen Way, Oadby</p>
              <p>Leicester, LE2 5YE</p>
              <p>United Kingdom</p>
              <p className="pt-2">
                <a href="mailto:info@gipaservices.com" className="hover:opacity-100 transition-opacity">
                  info@gipaservices.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-accent-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs opacity-60">
            © {new Date().getFullYear()} GIPA Services Limited. All rights reserved. Registered in England & Wales.
          </p>
          <p className="text-xs opacity-60">
            Nationwide HGV Coverage — England · Scotland · Wales · Northern Ireland
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
