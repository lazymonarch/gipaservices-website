"use client";

import { useEffect, useRef, useState } from "react";
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

const HERO_ROUTES = new Set(["/", "/contact", "/driver-application"]);
const HEADER_HEIGHT_CLASS = "h-16";

type HeaderSurface = "hero" | "light";

function parseRgba(value: string) {
  const match = value.match(
    /rgba?\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*[,\s]\s*([\d.]+)(?:\s*[/,]\s*([\d.]+))?\s*\)/i,
  );
  if (!match) return null;

  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  };
}

function isDarkSurfaceAtPoint(x: number, y: number) {
  const node = document.elementFromPoint(x, y);
  let current: Element | null = node instanceof Element ? node : null;

  while (current && current !== document.documentElement) {
    const style = window.getComputedStyle(current);
    const image = style.backgroundImage;

    if (image && image !== "none") {
      return true;
    }

    const rgba = parseRgba(style.backgroundColor);
    if (rgba && rgba.a > 0.15) {
      const luminance = (0.2126 * rgba.r + 0.7152 * rgba.g + 0.0722 * rgba.b) / 255;
      return luminance < 0.45;
    }

    current = current.parentElement;
  }

  return false;
}

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHeroRoute = HERO_ROUTES.has(pathname);
  const overlaysHero = isHeroRoute && !scrolled;
  const isHomePage = pathname === "/";

  const surface: HeaderSurface =
    isHomePage && !scrolled
      ? "light"
      : overlaysHero || overDark
        ? "hero"
        : "light";

  const onDark = surface === "hero";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const nextScrolled = window.scrollY > 24;
      setScrolled(nextScrolled);

      const header = headerRef.current;
      if (!header) return;

      const previous = header.style.pointerEvents;
      header.style.pointerEvents = "none";
      const nextOverDark = isDarkSurfaceAtPoint(window.innerWidth / 2, 8);
      header.style.pointerEvents = previous;

      setOverDark(nextOverDark);
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [isHeroRoute, pathname]);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
          surface === "hero" &&
          "border-white/15 bg-[color:var(--gipa-charcoal)]/20 shadow-[0_8px_32px_rgba(28,28,28,0.12)] backdrop-blur-xl backdrop-saturate-150",
          surface === "light" &&
          "border-[color:var(--gipa-charcoal)]/10 bg-[color:var(--gipa-cream)]/75 shadow-[0_8px_32px_rgba(28,28,28,0.06)] backdrop-blur-xl backdrop-saturate-150",
        )}
      >
        <nav className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <Link href="/" className="relative z-10 flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#F5C518] text-sm font-bold text-[#2C2C2C]">
              G
            </div>
            <span
              className={cn(
                "ml-2 text-base font-semibold transition-colors duration-300",
                plusJakarta.className,
                onDark ? "text-white" : "text-[color:var(--gipa-charcoal)]",
              )}
            >
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
                    "group relative pb-1 text-[15px] font-medium tracking-wide transition-colors duration-200",
                    onDark ? "text-white hover:text-[#F5C518]" : "text-[color:var(--gipa-charcoal)] hover:text-[#F5C518]",
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#F5C518] transition-[width] duration-300 group-hover:w-full"
                    style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)", bottom: "-3px" }}
                  />
                </Link>
              );
            })}
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden rounded-[4px] bg-[#F5C518] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.05em] text-[color:var(--gipa-charcoal)] transition duration-200 hover:bg-[#F5C518]/90 lg:inline-flex"
            >
              Get a Quote
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex items-center justify-center lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-dropdown"
            >
              {mobileOpen ? (
                <X
                  className={cn(
                    "h-6 w-6 transition-colors duration-300",
                    onDark ? "text-white" : "text-[color:var(--gipa-charcoal)]",
                  )}
                />
              ) : (
                <Menu
                  className={cn(
                    "h-6 w-6 transition-colors duration-300",
                    onDark ? "text-white" : "text-[color:var(--gipa-charcoal)]",
                  )}
                />
              )}
            </button>
          </div>

          <div
            id="mobile-nav-dropdown"
            className={cn(
              "absolute left-0 right-0 top-full overflow-hidden border-b shadow-lg backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ease-in-out lg:hidden",
              onDark
                ? "border-white/10 bg-[color:var(--gipa-charcoal)]/90"
                : "border-[color:var(--gipa-charcoal)]/10 bg-[color:var(--gipa-cream)]/95",
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
                    "block py-4 px-6 text-[15px] font-medium transition-colors duration-150",
                    onDark ? "hover:bg-white/5" : "hover:bg-[color:var(--gipa-cream)]",
                    idx !== navLinks.length - 1 &&
                    (onDark ? "border-b border-white/10" : "border-b border-gray-50"),
                    onDark ? "text-white" : "text-[color:var(--gipa-charcoal)]",
                  )}
                >
                  <span className="block border-l-[3px] border-transparent pl-3">
                    {link.label}
                  </span>
                </Link>
              );
            })}

            <div
              className={cn(
                "px-6 py-5",
                onDark ? "bg-black/20" : "bg-[color:var(--gipa-cream)]",
              )}
            >
              <p
                className={cn(
                  "mb-2 text-xs uppercase tracking-wider",
                  onDark ? "text-white/50" : "text-[color:var(--gipa-muted-foreground)]",
                )}
              >
                Looking for HGV work?
              </p>
              <Link
                href="/driver-application"
                onClick={() => setMobileOpen(false)}
                className="mb-3 block w-full rounded-[4px] bg-[#F5C518] px-4 py-2 text-center text-sm font-semibold text-[#2C2C2C]"
              >
                Apply as Driver →
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block w-full rounded-[4px] border px-4 py-2 text-center text-sm font-semibold transition-colors duration-200",
                  onDark
                    ? "border-white/30 text-white hover:border-[#F5C518] hover:text-[#F5C518]"
                    : "border-[color:var(--gipa-charcoal)]/20 text-[color:var(--gipa-charcoal)] hover:border-[#F5C518] hover:text-[#F5C518]",
                )}
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </nav>
      </header>
      {!isHeroRoute && (
        <div className={cn(HEADER_HEIGHT_CLASS, "shrink-0")} aria-hidden="true" />
      )}
    </>
  );
};

export default Header;
