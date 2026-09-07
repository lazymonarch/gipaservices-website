import Link from "next/link";

import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/", className: "order-1 lg:order-1" },
  { label: "Warehouse Operative", href: "/warehouse-operative-application", className: "order-2 lg:order-5" },
  { label: "Contact", href: "/contact", className: "order-3 lg:order-3" },
  { label: "Driver Application", href: "/driver-application", className: "order-4 lg:order-4" },
  { label: "Our Story", href: "/our-story", className: "order-5 lg:order-2" },
  { label: "Privacy Policy", href: "/privacy-policy", className: "order-6 lg:order-6" },
];

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-[color:var(--gipa-charcoal)] text-[color:var(--gipa-cream)]">
      <div className="mx-auto max-w-7xl px-5 pb-[max(2rem,calc(1.25rem+env(safe-area-inset-bottom)))] pt-7 sm:px-6 sm:pb-8 lg:px-8 lg:py-7">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="max-w-sm">
            <div className="flex items-center">
              <img
                src="/assets/gipa-logo.png"
                alt="GIPA Services"
                width={251}
                height={150}
                className="h-[52px] w-auto shrink-0 object-contain object-left lg:h-14"
              />
            </div>
          </div>

          <div className="mt-5 border-t border-white/10 pt-5 lg:mt-0 lg:border-t-0 lg:pt-0">
            <nav
              className="grid w-full min-w-0 grid-cols-2 gap-x-4 gap-y-1 sm:gap-x-8 md:gap-x-10 lg:flex lg:w-auto lg:flex-wrap lg:justify-center lg:gap-x-6 lg:gap-y-2"
              aria-label="Footer navigation"
            >
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex min-h-10 min-w-0 items-center py-2 text-[13px] font-medium leading-snug text-[color:var(--gipa-cream)]/55 hover:text-[#F5C518] sm:min-h-[44px] sm:text-sm",
                    item.className,
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
