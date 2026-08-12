"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { plusJakarta } from "@/lib/fonts";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Our Story", path: "/our-story" },
  { label: "Contact", path: "/contact" },
  { label: "Driver Application", path: "/driver-application" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <nav className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="relative z-10 flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#F5C518] text-sm font-bold text-[#2C2C2C]">
            G
          </div>
          <span className={cn("ml-2 text-base font-semibold text-[#2C2C2C]", plusJakarta.className)}>
            GIPA Services
          </span>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;

            return (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "border-b-2 border-transparent pb-1 text-[15px] font-medium tracking-wide text-[#2C2C2C] transition-[color,border-color] duration-200 hover:border-[#F5C518] hover:text-[#F5C518]",
                  isActive && "border-[#F5C518] text-[#F5C518]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="relative z-10 inline-flex items-center justify-center lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-dropdown"
        >
          {mobileOpen ? (
            <X className="h-6 w-6 text-[#2C2C2C]" />
          ) : (
            <Menu className="h-6 w-6 text-[#2C2C2C]" />
          )}
        </button>

        {/* Desktop spacer so justify-between keeps the logo left-aligned */}
        <div className="hidden w-8 lg:block" aria-hidden="true" />

        <div
          id="mobile-nav-dropdown"
          className={cn(
            "absolute left-0 right-0 top-full overflow-hidden border-b border-gray-100 bg-white shadow-lg transition-all duration-300 ease-in-out lg:hidden",
            mobileOpen ? "max-h-screen" : "max-h-0",
          )}
        >
          {navLinks.map((link, idx) => {
            const isActive = pathname === link.path;

            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block py-4 px-6 text-[15px] font-medium text-[#2C2C2C] transition-colors duration-150 hover:bg-[#FAF8F4]",
                  idx !== navLinks.length - 1 && "border-b border-gray-50",
                  isActive && "text-[#F5C518]",
                )}
              >
                <span
                  className={cn(
                    "block border-l-[3px] border-transparent pl-3",
                    isActive && "border-[#F5C518]",
                  )}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}

          <div className="bg-[#FAF8F4] px-6 py-5">
            <p className="mb-2 text-xs uppercase tracking-wider text-[#6B7280]">
              Looking for HGV work?
            </p>
            <Link
              href="/driver-application"
              onClick={() => setMobileOpen(false)}
              className="block w-full rounded-[4px] bg-[#F5C518] px-4 py-2 text-center text-sm font-semibold text-[#2C2C2C]"
            >
              Apply as Driver →
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
