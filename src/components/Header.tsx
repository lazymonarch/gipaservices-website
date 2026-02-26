"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Our Story", path: "/our-story" },
  { label: "Contact", path: "/contact" },
  { label: "Driver Application", path: "/driver-application" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileButtonRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (mobileOpen) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      if (isHome) {
        setScrolled(currentScrollY > window.innerHeight * 0.7);
      } else {
        setScrolled(true);
      }

      lastScrollY.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedOutsideMenu = !mobileMenuRef.current?.contains(target);
      const clickedOutsideButton = !mobileButtonRef.current?.contains(target);

      if (clickedOutsideMenu && clickedOutsideButton) {
        setMobileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-in-out
        ${visible ? "translate-y-0" : "-translate-y-full"}
        ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
            : "bg-slate-900/60 backdrop-blur-md"
        }
      `}
    >
      <nav className="relative w-full max-w-6xl mx-auto px-6">
        <div id="main-navbar" className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-yellow-400 rounded-md flex items-center justify-center text-slate-900 font-semibold">
              G
            </div>
            <span
              className={`font-semibold text-lg tracking-tight ${
                scrolled ? "text-slate-900" : "text-white"
              }`}
            >
              GIPA Services
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  scrolled
                    ? "text-slate-700 hover:text-slate-900"
                    : "text-white hover:text-yellow-300",
                  pathname === link.path
                    ? isHome
                      ? "border-b-2 border-yellow-400 pb-1 font-medium"
                      : "border-b-2 border-slate-900 pb-1 font-medium text-slate-900"
                    : "",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button
              asChild
              className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 bg-[length:200%_100%] hover:bg-[position:100%_0] text-slate-900 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ease-in-out shadow-sm h-auto"
            >
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <div
              id="mobile-nav-menu"
              ref={mobileMenuRef}
              className={cn(
                "relative h-10 overflow-hidden transition-all duration-300 ease-out",
                mobileOpen
                  ? "w-[min(72vw,22rem)] opacity-100 pointer-events-auto"
                  : "w-0 opacity-0 pointer-events-none",
              )}
              aria-hidden={!mobileOpen}
            >
              <div
                className={cn(
                  "flex h-full items-center gap-1.5 px-2 transition-all duration-300 ease-out whitespace-nowrap",
                  mobileOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0",
                )}
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-2 py-1 text-xs font-medium transition-colors duration-200",
                  scrolled
                    ? "text-slate-700 hover:text-slate-900"
                    : "text-white hover:text-yellow-300",
                  pathname === link.path
                    ? isHome
                      ? "text-yellow-300 border-b-2 border-yellow-400"
                      : "text-slate-900 border-b-2 border-slate-900"
                    : "",
                )}
              >
                {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <button
              ref={mobileButtonRef}
              type="button"
              className={cn(
                "relative inline-flex h-10 w-10 items-center justify-center transition-colors duration-200",
                scrolled
                  ? "text-slate-900 hover:text-slate-700"
                  : "text-white hover:text-yellow-300",
              )}
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-menu"
            >
              <span className="relative block h-4 w-5">
                <span
                  className={cn(
                    "absolute left-0 h-[2px] w-5 rounded-full bg-current transition-all duration-200 ease-out",
                    mobileOpen ? "top-[7px] rotate-45" : "top-[3px] rotate-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-[2px] w-5 rounded-full bg-current transition-all duration-200 ease-out",
                    mobileOpen ? "top-[7px] -rotate-45" : "top-[11px] rotate-0",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
