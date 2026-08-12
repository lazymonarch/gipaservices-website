import Link from "next/link";
import { Mail, MapPin, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { plusJakarta } from "@/lib/fonts";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const renderBrandColumn = () => (
    <div>
      <div className="flex items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#F5C518] text-sm font-bold text-[#2C2C2C]">
          G
        </div>
        <span className={cn("ml-2 text-base font-semibold text-white", plusJakarta.className)}>
          GIPA Services
        </span>
      </div>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/50">
        GIPA Services Limited is a UK-registered company providing professional HGV logistics and transport services nationwide.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
          <MapPin className="h-3 w-3" />
          Leicester, UK
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
          <Shield className="h-3 w-3" />
          UK GDPR Compliant
        </span>
      </div>
    </div>
  );

  return (
    <footer className="border-t-4 border-[#F5C518] bg-[#1C1C1C] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 lg:hidden">
          {renderBrandColumn()}
        </div>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-3 lg:gap-10">
          <div className="hidden lg:block">
            {renderBrandColumn()}
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
              NAVIGATION
            </h4>
            <nav className="flex flex-col gap-2 lg:gap-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "Our Story", href: "/our-story" },
                { label: "Contact", href: "/contact" },
                { label: "Driver Application", href: "/driver-application" },
                { label: "Privacy Policy", href: "/privacy-policy" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="group inline-flex items-center gap-2 text-xs text-white/60 transition-colors duration-200 hover:text-[#F5C518] lg:text-sm">
                  <span>{item.label}</span>
                  <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">→</span>
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
              CONTACT US
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-xs leading-relaxed text-white/60 lg:text-sm">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-[#F5C518] lg:h-4 lg:w-4" />
                <div>
                  <p>6 Glen Way, Oadby</p>
                  <p>Leicester, LE2 5YE</p>
                  <p>United Kingdom</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/60 lg:text-sm">
                <Mail className="h-3 w-3 shrink-0 text-[#F5C518] lg:h-4 lg:w-4" />
                <a href="mailto:info@gipaservices.com" className="transition-colors hover:text-[#F5C518]">
                  info@gipaservices.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 bg-[#111111] px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-xs text-white/30">
            &copy; {currentYear} GIPA Services Limited. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Registered in England & Wales
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
