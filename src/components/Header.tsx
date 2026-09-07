"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Our Story", path: "/our-story" },
  { label: "Contact", path: "/contact" },
];

const careersLinks = [
  { label: "Driver", mobileLabel: "Driver Application", path: "/driver-application" },
  { label: "Warehouse Operative", mobileLabel: "Warehouse Operative", path: "/warehouse-operative-application" },
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
  const [careersOpen, setCareersOpen] = useState(false);
  const [careersMobileOpen, setCareersMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const careersRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isCareersActive = careersLinks.some((link) => pathname === link.path);
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
  const mobileChromeOnDark = !mobileOpen && (onDark || (isHomePage && !scrolled));

  useEffect(() => {
    setMobileOpen(false);
    setCareersOpen(false);
    setCareersMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (mobilePanelRef.current?.contains(target)) return;
      if (mobileToggleRef.current?.contains(target)) return;
      setMobileOpen(false);
      setCareersMobileOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setCareersMobileOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!careersOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (careersRef.current?.contains(event.target as Node)) return;
      setCareersOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCareersOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [careersOpen]);

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

  useEffect(() => {
    if (!mobileOpen) return;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [mobileOpen]);

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
          isHomePage &&
            !scrolled &&
            !mobileOpen &&
            "max-md:!border-transparent max-md:!bg-transparent max-md:!shadow-none max-md:!backdrop-blur-none max-md:!backdrop-saturate-100",
          mobileOpen &&
            "max-lg:border-transparent max-lg:bg-transparent max-lg:shadow-none max-lg:backdrop-blur-none",
        )}
      >
        <nav className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <Link href="/" className="relative z-10 flex items-center" aria-label="GIPA Services home">
            <img
              src="/assets/gipa-logo.png"
              alt="GIPA Services"
              width={251}
              height={150}
              className="h-[52px] w-auto max-h-full shrink-0 object-contain object-left lg:h-14"
            />
          </Link>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
            {navLinks.map((link) => {
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

            <div
              ref={careersRef}
              className="relative"
              onMouseEnter={() => setCareersOpen(true)}
              onMouseLeave={() => setCareersOpen(false)}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={careersOpen}
                onClick={() => setCareersOpen((prev) => !prev)}
                className={cn(
                  "group relative inline-flex items-center gap-0.5 pb-1 text-[15px] font-medium tracking-wide transition-colors duration-200",
                  onDark ? "text-white hover:text-[#F5C518]" : "text-[color:var(--gipa-charcoal)] hover:text-[#F5C518]",
                  isCareersActive && (onDark ? "text-[#F5C518]" : "text-[#F5C518]"),
                )}
              >
                Careers
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 origin-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]",
                    careersOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute bottom-0 left-0 h-[2px] bg-[#F5C518] transition-[width] duration-300 group-hover:w-full",
                    isCareersActive || careersOpen ? "w-full" : "w-0",
                  )}
                  style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)", bottom: "-3px" }}
                />
              </button>

              <div
                role="menu"
                className={cn(
                  "absolute left-1/2 top-full z-50 min-w-[200px] -translate-x-1/2 pt-2 transition-all duration-200",
                  careersOpen
                    ? "pointer-events-auto visible translate-y-0 opacity-100"
                    : "pointer-events-none invisible -translate-y-1 opacity-0",
                )}
              >
                <div className="overflow-hidden rounded-none border border-white/10 bg-[#1C1C1C]">
                  <div className="h-[2px] w-full bg-[#F5C518]" aria-hidden="true" />
                  {careersLinks.map((link, idx) => {
                    const isActive = pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        href={link.path}
                        role="menuitem"
                        onClick={() => setCareersOpen(false)}
                        className={cn(
                          "group flex items-stretch text-[15px] font-medium tracking-wide transition-colors duration-200",
                          "text-white/90 hover:bg-[#F5C518]/15 hover:text-[#F5C518]",
                          "focus:outline-none focus-visible:bg-[#F5C518]/15 focus-visible:text-[#F5C518]",
                          isActive && "bg-[#F5C518]/10 font-semibold text-[#F5C518]",
                          idx !== careersLinks.length - 1 && "border-b border-b-white/10",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "w-[3px] shrink-0 bg-transparent transition-colors duration-200",
                            "group-hover:bg-[#F5C518] group-focus-visible:bg-[#F5C518]",
                            isActive && "bg-[#F5C518]",
                          )}
                        />
                        <span className="px-4 py-3">
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="hidden lg:block">
              <Link
                href="/contact"
                className="gipa-btn-nav"
              >
                Get a Quote
                <ChevronRight className="gipa-btn-icon" aria-hidden="true" />
              </Link>
            </div>

            <button
              ref={mobileToggleRef}
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-gipa lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-dropdown"
            >
              {mobileOpen ? (
                <X className="h-6 w-6 text-[#F8F6F1]" />
              ) : (
                <Menu
                  className={cn(
                    "h-6 w-6 transition-colors duration-300",
                    mobileChromeOnDark ? "text-white" : "text-[color:var(--gipa-charcoal)]",
                  )}
                />
              )}
            </button>
          </div>
        </nav>
      </header>

      <div
        className="lg:hidden"
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            "fixed inset-0 z-40 bg-[#1C1C1C]/80 backdrop-blur-2xl backdrop-saturate-150",
            "transition-opacity [transition-duration:200ms] ease-out motion-reduce:transition-none",
            mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          onClick={() => {
            setMobileOpen(false);
            setCareersMobileOpen(false);
          }}
        />

        <div
          ref={mobilePanelRef}
          id="mobile-nav-dropdown"
          role="dialog"
          aria-modal={mobileOpen}
          aria-label="Mobile navigation"
          className={cn(
            "fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4",
            "transition-[opacity,transform] [transition-duration:200ms] ease-out motion-reduce:transition-none motion-reduce:transform-none",
            mobileOpen
              ? "pointer-events-none visible translate-y-0 opacity-100"
              : "pointer-events-none invisible translate-y-2 opacity-0",
          )}
        >
          <nav aria-label="Mobile" className="pointer-events-auto flex flex-col">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex min-h-[3.5rem] items-center border-b border-white/10 py-5 text-[1.65rem] font-medium tracking-tight text-[#F8F6F1] transition-colors duration-150",
                    "hover:text-[#F5C518] focus:outline-none focus-visible:text-[#F5C518]",
                    isActive && "text-[#F5C518]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="border-b border-white/10">
              <button
                type="button"
                aria-expanded={careersMobileOpen}
                aria-controls="mobile-careers-submenu"
                onClick={() => setCareersMobileOpen((prev) => !prev)}
                className={cn(
                  "flex min-h-[3.5rem] w-full items-center justify-between py-5 text-left text-[1.65rem] font-medium tracking-tight text-[#F8F6F1] transition-colors duration-150",
                  "hover:text-[#F5C518] focus:outline-none focus-visible:text-[#F5C518]",
                  isCareersActive && "text-[#F5C518]",
                )}
              >
                Careers
                <ChevronDown
                  className={cn(
                    "h-5 w-5 origin-center text-[#F5C518] transition-transform [transition-duration:200ms] ease-out motion-reduce:transition-none",
                    careersMobileOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>

              <div
                id="mobile-careers-submenu"
                className={cn(
                  "grid transition-[grid-template-rows] [transition-duration:200ms] ease-out motion-reduce:transition-none",
                  careersMobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="mb-4 ml-1 border-l-2 border-[#F5C518] pl-4">
                    {careersLinks.map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        onClick={() => {
                          setMobileOpen(false);
                          setCareersMobileOpen(false);
                        }}
                        className={cn(
                          "flex min-h-12 items-center py-2 text-[1.05rem] font-medium tracking-wide text-[#F8F6F1]/75 transition-colors duration-150",
                          "hover:text-[#F5C518] focus:outline-none focus-visible:text-[#F5C518]",
                          pathname === link.path && "font-semibold text-[#F5C518]",
                        )}
                      >
                        {link.mobileLabel}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div className="pointer-events-auto mt-auto pt-8">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="gipa-btn-primary w-full"
            >
              Get a Quote
              <ChevronRight className="gipa-btn-icon" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
      {!isHeroRoute && (
        <div className={cn(HEADER_HEIGHT_CLASS, "shrink-0")} aria-hidden="true" />
      )}
    </>
  );
};

export default Header;
