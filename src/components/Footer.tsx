import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { plusJakarta } from "@/lib/fonts";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/our-story" },
  { label: "Contact", href: "/contact" },
  { label: "Driver Application", href: "/driver-application" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-[color:var(--gipa-charcoal)] text-[color:var(--gipa-cream)]">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8 lg:py-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="max-w-sm">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#F5C518] text-sm font-bold text-[#2C2C2C]">
                G
              </div>
              <span
                className={cn(
                  "ml-2 text-base font-semibold text-[color:var(--gipa-cream)]",
                  plusJakarta.className,
                )}
              >
                GIPA Services
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--gipa-cream)]/55">
              GIPA Services Limited is a UK-registered company providing
              professional HGV logistics and transport services nationwide.
            </p>
          </div>

          <nav
            className="flex flex-wrap gap-x-6 gap-y-3 lg:justify-center"
            aria-label="Footer navigation"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[44px] items-center text-sm font-medium text-[color:var(--gipa-cream)]/55 hover:text-[#F5C518]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-3 text-sm text-[color:var(--gipa-cream)]/55 lg:max-w-xs lg:text-right">
            <div className="flex items-start gap-2 lg:justify-end">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F5C518] lg:order-2" />
              <div className="leading-relaxed">
                <p>6 Glen Way, Oadby</p>
                <p>Leicester, LE2 5YE</p>
                <p>United Kingdom</p>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:justify-end">
              <Mail className="h-4 w-4 shrink-0 text-[#F5C518] lg:order-2" />
              <a
                href="mailto:info@gipaservices.com"
                className="hover:text-[#F5C518]"
              >
                info@gipaservices.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
