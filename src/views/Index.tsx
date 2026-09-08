"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import UKMap from "@/components/UKMap";
import Testimonials from "@/components/Testimonials";
import HomePrimaryButton from "@/components/HomePrimaryButton";
import HeroEyebrow from "@/components/HeroEyebrow";
import { revealVariant } from "@/lib/animations";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

const heroOverlayGradients = [
  "radial-gradient(120% 95% at 0% 100%, rgba(10,10,10,0.58) 0%, rgba(10,10,10,0.52) 28%, rgba(10,10,10,0.29) 52%, rgba(10,10,10,0.07) 72%, transparent 86%)",
  "linear-gradient(to top, rgba(10,10,10,0.49) 0%, rgba(10,10,10,0.23) 36%, rgba(10,10,10,0.05) 62%, transparent 82%)",
  "linear-gradient(to right, rgba(10,10,10,0.43) 0%, rgba(10,10,10,0.19) 34%, rgba(10,10,10,0.04) 58%, transparent 76%)",
].join(", ");

const heroMobileExtraOverlay = [
  "linear-gradient(to top, rgba(10,10,10,0.93) 0%, rgba(10,10,10,0.42) 38%, transparent 58%)",
  "rgba(10,10,10,0.22)",
].join(", ");

const services = [
  {
    name: "Nationwide HGV Delivery",
    description:
      "Full-load and part-load transport operations covering routes across the United Kingdom.",
    tag: "Full-load · Part-load",
    number: "01",
    href: "/contact",
    image:
      "https://img.rocket.new/generatedImages/rocket_gen_img_1683f5bd2-1773072579871.png",
    alt: "HGV truck on a UK motorway route",
    wide: true
  },
  {
    name: "Secure Goods Transportation",
    description:
      "Compliance-led transport handling with operational controls focused on cargo safety and traceability.",
    tag: "Secure · Compliant",
    number: "02",
    href: "/contact",
    image: mediaUrl("serviceSecure"),
    alt: "Organised warehouse racking with bins and palletised goods",
    wide: false
  },
  {
    name: "Timed & Scheduled Deliveries",
    description:
      "Reliable collection and delivery windows aligned to your supply chain and warehouse operations.",
    tag: "Timed · Scheduled",
    number: "03",
    href: "/contact",
    image: mediaUrl("serviceTimed"),
    alt: "Loading dock with trucks at numbered warehouse bays",
    wide: false
  },
  {
    name: "Dedicated Logistics Partnerships",
    description:
      "Long-term transport planning for businesses requiring continuity, consistency, and accountability.",
    tag: "Dedicated · Long-term",
    number: "04",
    href: "/contact",
    image: mediaUrl("servicePartnership"),
    alt: "Two warehouse operatives in high-visibility vests reviewing a clipboard",
    wide: true
  }];


const whyGipaFeatures = [
  {
    number: "1",
    title: "Experienced Professional Drivers",
    description:
      "Experienced drivers and dependable HGV capability across nationwide routes.",
  },
  {
    number: "2",
    title: "Compliance & Safety First",
    description:
      "Structured execution aligned with UK transport and safety standards.",
  },
  {
    number: "3",
    title: "Nationwide UK Coverage",
    description:
      "Operating HGV routes across England, Scotland, Wales, and Northern Ireland.",
  },
];


const heroStats = [
  {
    title: "Dependable Support",
    sub: "Timely & Secure",
  },
  {
    title: "UK-Wide",
    label: "Coverage",
    note: "Eng · Sco · Wal · NI",
  },
  {
    title: "Professional",
    sub: "Standards & Compliance",
  },
];


const coverageSupportPoints = [
  {
    number: "01",
    title: "Nationwide Reach",
    description: "UK-wide HGV transport coverage."
  },
  {
    number: "02",
    title: "Flexible Logistics",
    description: "Support for scheduled and time-sensitive deliveries."
  },
  {
    number: "03",
    title: "Reliable Operations",
    description: "Dependable transport coordination."
  }];


const careerRoles = [
  {
    name: "HGV Drivers",
    number: "01",
    description: "Professional HGV driving roles supporting UK logistics operations.",
    href: "/driver-application",
    image: mediaUrl("careerDriver"),
    alt: "HGV truck on a UK route",
    imageClassName: "object-cover object-center"
  },
  {
    name: "Warehouse Operatives",
    number: "02",
    description: "Warehouse operative roles supporting UK distribution operations.",
    href: "/warehouse-operative-application",
    image: mediaUrl("careerWarehouse"),
    alt: "Warehouse operative in a hard hat checking stock",
    imageClassName: "object-cover object-center"
  }];


function CareersSplit() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="overflow-hidden border border-[color:var(--gipa-card-border)]">
      <div className="grid items-stretch lg:grid-cols-12">
        <div className="flex flex-col border-[color:var(--gipa-card-border)] lg:col-span-5 lg:min-h-[506px] lg:border-r">
          {careerRoles.map((role, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={role.name}
                onClick={() => setActiveIndex(index)}
                className={`flex min-h-0 flex-col overflow-hidden border-l-[3px] px-5 transition-[flex-grow,background-color,border-color] duration-500 ease-out motion-reduce:transition-none ${
                  isActive
                    ? "cursor-default border-l-[#F5C518] bg-[#EFEBE3] lg:flex-1"
                    : "cursor-pointer border-l-transparent bg-white lg:flex-none"
                }`}
              >

                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={`career-panel-${role.number}`}
                  className={`flex w-full items-baseline justify-between gap-4 text-left ${isActive ? "pt-5 lg:pt-7" : "py-5"}`}
                  onClick={() => setActiveIndex(index)}>
                  <h3 className="font-display text-xl font-bold leading-tight tracking-[-0.025em] text-[color:var(--gipa-charcoal)] lg:text-2xl">
                    {role.name}
                  </h3>
                  <span className="shrink-0 font-display text-2xl font-bold tabular-nums leading-none text-[color:var(--gipa-charcoal)]/20 lg:text-3xl">
                    {role.number}
                  </span>
                </button>

                <div
                  id={`career-panel-${role.number}`}
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
                    isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="flex flex-col pb-3 pr-4 lg:pb-7 lg:pr-8">
                      <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-[color:var(--gipa-charcoal)]/65 lg:mt-3 lg:text-base lg:leading-[1.7]">
                        {role.description}
                      </p>
                      <HomePrimaryButton href={role.href} className="mb-0 mt-4 self-start lg:mt-8">
                        Apply Now
                      </HomePrimaryButton>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative min-h-[210px] overflow-hidden border-t border-[color:var(--gipa-card-border)] lg:col-span-7 lg:min-h-[506px] lg:border-t-0">
          {careerRoles.map((role, index) =>
          <Image
            key={role.image}
            src={role.image}
            alt={role.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className={`pointer-events-none transition-opacity duration-500 ease-out motion-reduce:transition-none ${
              role.imageClassName
            } ${
              activeIndex === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={activeIndex !== index} />
          )}
        </div>
      </div>
    </div>
  );
}


const Index = () => {
  const prefersReducedMotion = useReducedMotion();
  const sectionHeadingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const imageWipeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageScaleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const servicesTrackRef = useRef<HTMLDivElement>(null);
  const serviceVisibilityRatiosRef = useRef<number[]>(services.map(() => 0));
  const [servicesRevealed, setServicesRevealed] = useState(false);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  const goToService = (index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    card.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      inline: "start",
      block: "nearest",
    });
    setActiveServiceIndex(index);
  };

  useEffect(() => {
    if (servicesRevealed) return;

    const reveal = () => {
      setServicesRevealed(true);
    };

    const headingObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reveal();
          headingObserver.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    if (sectionHeadingRef.current) {
      headingObserver.observe(sectionHeadingRef.current);
    }

    if (servicesTrackRef.current) {
      headingObserver.observe(servicesTrackRef.current);
    }

    return () => {
      headingObserver.disconnect();
    };
  }, [servicesRevealed]);

  useEffect(() => {
    const track = servicesTrackRef.current;
    if (!track) return;

    const cards = cardRefs.current.filter((card): card is HTMLElement => card !== null);
    if (cards.length === 0) return;

    serviceVisibilityRatiosRef.current = services.map(() => 0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = cardRefs.current.indexOf(entry.target as HTMLElement);
          if (idx >= 0) {
            serviceVisibilityRatiosRef.current[idx] = entry.intersectionRatio;
          }
        });

        const ratios = serviceVisibilityRatiosRef.current;
        const bestIdx = ratios.reduce(
          (best, ratio, idx) => (ratio > ratios[best] ? idx : best),
          0,
        );

        if (ratios[bestIdx] > 0) {
          setActiveServiceIndex(bestIdx);
        }
      },
      {
        root: track,
        threshold: [0, 0.25, 0.5, 0.6, 0.75, 1],
      },
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [servicesRevealed]);

  return (
    <Layout>
      <div className="font-sans">
        <div className="max-md:flex max-md:h-[100svh] max-md:max-h-[100svh] max-md:flex-col max-md:overflow-hidden">
          {/* Hero section */}
          <section className="relative max-md:flex max-md:min-h-0 max-md:flex-1 max-md:flex-col overflow-hidden md:min-h-[100svh]">
            <img
              src={mediaUrl("homeHero")}
              alt="HGV truck on a winding mountain road"
              fetchPriority="high"
              className="pointer-events-none absolute max-w-none object-cover object-[58%_82%] md:hidden"
              style={{
                top: 0,
                right: "auto",
                bottom: 0,
                left: "-14%",
                height: "100%",
                width: "150%",
              }}
            />
            <Image
              src={mediaUrl("homeHero")}
              alt="HGV truck on a winding mountain road"
              fill
              priority
              sizes="100vw"
              className="hidden object-cover object-[55%_45%] md:block lg:object-center"
            />
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{ background: heroOverlayGradients }}
            />
            <div
              className="absolute inset-0 md:hidden"
              aria-hidden="true"
              style={{ background: heroMobileExtraOverlay }}
            />

            <div className="relative z-10 flex max-md:min-h-0 max-md:flex-1 items-end pb-4 pt-20 md:min-h-[100svh] md:pb-20 md:pt-28 lg:pb-24">
              <div className="mx-auto w-full max-w-[1400px] px-6 md:px-8 lg:px-12">
                <div className="max-w-xl lg:max-w-2xl">
                  <HeroEyebrow text="UK Logistics & HGV Transport" className="mb-8 max-md:mb-6" />

                  <h1 className="gipa-hero-title text-[44px] text-white md:text-[60px] lg:text-[76px]">
                    Dependable
                    <br />
                    <span className="gipa-hero-accent">HGV Logistics</span>
                  </h1>

                  <p className="mt-10 max-w-md text-base leading-relaxed text-white max-md:mt-8 lg:mt-12 lg:text-lg">
                    Professional HGV transport across England, Scotland, Wales and Northern Ireland.
                  </p>

                  <div className="mt-12 max-md:mt-10 lg:mt-14">
                    <Link
                      href="/contact"
                      className="gipa-btn-primary w-full sm:w-auto">
                      Get a Quote
                      <ChevronRight className="gipa-btn-icon" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            aria-label="Company figures"
            className="max-md:shrink-0 border-y border-[color:var(--gipa-card-border)] bg-[color:var(--gipa-cream)] max-md:border-t-0">
            <div className="mx-auto grid w-full max-w-[1400px] grid-cols-3 gap-2 sm:grid-cols-3">
              {heroStats.map((stat, index) => (
                <div
                  key={stat.title}
                  className={cn(
                    "px-3 py-3 text-center sm:flex sm:items-baseline sm:gap-4 sm:px-6 sm:py-5 sm:text-left md:px-8 lg:px-12",
                    index > 0 && "sm:border-l sm:border-[color:var(--gipa-card-border)]",
                  )}
                >
                  <div className="sm:hidden">
                    <p className="font-display text-base font-bold leading-tight text-[#1C1C1C]">
                      {stat.title}
                    </p>
                    {stat.label && stat.note ? (
                      <div className="mt-1">
                        <p className="text-[10px] uppercase leading-tight tracking-wider text-slate-500">
                          {stat.label}
                        </p>
                        <p className="text-[10px] uppercase leading-tight tracking-wider text-slate-500">
                          {stat.note}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-1 text-[10px] uppercase leading-tight tracking-wider text-slate-500">
                        {stat.sub}
                      </p>
                    )}
                  </div>

                  <p className="hidden font-display text-2xl font-bold text-[#1C1C1C] sm:block lg:text-[1.75rem]">
                    {stat.title}
                  </p>
                  <div className="hidden sm:block">
                    {stat.label && stat.note ? (
                      <>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {stat.label}
                        </p>
                        <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                          {stat.note}
                        </p>
                      </>
                    ) : (
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {stat.sub}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Services section */}
        <section
          id="services"
          className="overflow-hidden bg-[color:var(--gipa-cream)]"
          aria-labelledby="services-heading">

          <div className="h-1 w-full bg-[#F5C518]" aria-hidden="true" />

          <div className="mx-auto max-w-7xl px-6 pt-12 pb-10 md:py-20 lg:px-8 lg:py-32">
            {/* Section heading — fade + upward reveal */}
            <div
              ref={sectionHeadingRef}
              className="mb-8 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end lg:mb-16"
              style={{
                opacity: servicesRevealed ? 1 : 0,
                transform: servicesRevealed ? "translateY(0)" : "translateY(28px)",
                transition: "opacity 800ms ease, transform 800ms ease"
              }}>
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="gipa-rule" />
                  <span className="gipa-eyebrow">
                    What We Do
                  </span>
                </div>
                <h2
                  id="services-heading"
                  className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.025em] text-[#1C1C1C]">

                  Our Services
                </h2>
              </div>
              <p className="max-w-md border-r-2 border-[#F5C518] pr-4 text-base leading-relaxed text-[#1C1C1C]/65 md:text-right">
                Focused transport solutions designed for performance,
                compliance, and continuity across high-volume operational
                routes.
              </p>
            </div>

            <div>
              <div
                ref={servicesTrackRef}
                className="flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain overscroll-y-none touch-pan-x scroll-px-6 scroll-smooth pb-1 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] md:grid md:grid-cols-12 md:gap-4 md:overflow-visible md:overscroll-auto md:scroll-px-0 md:touch-auto md:pb-0 lg:gap-5 [&::-webkit-scrollbar]:hidden"
                aria-label="Our services"
              >
                {services?.map((service, index) => {
                  const staggerDelay = index * 100;
                  return (
                    <article
                      key={service?.name}
                      ref={(el) => { cardRefs.current[index] = el; }}
                      className={`gipa-card group relative w-[86vw] shrink-0 snap-start overflow-hidden bg-white md:w-auto md:min-w-0 md:shrink md:snap-align-none ${service?.wide ? "md:col-span-7" : "md:col-span-5"}`}
                      style={{
                        opacity: servicesRevealed ? 1 : 0,
                        transform: servicesRevealed ? "translateY(0)" : "translateY(32px)",
                        transition: `opacity 700ms ease ${staggerDelay}ms, transform 700ms ease ${staggerDelay}ms`
                      }}>

                      {/* Image container with wipe reveal */}
                      <div
                        className={cn(
                          "relative overflow-hidden",
                          "max-md:h-[clamp(210px,calc(28vw-10px),330px)]",
                          service?.wide
                            ? "md:h-[clamp(250px,calc(35vw-10px),410px)]"
                            : "md:h-[clamp(210px,calc(28vw-10px),330px)]",
                        )}
                      >

                        {/* Image wrapper — starts scaled up, scales to 1 on reveal */}
                        <div
                          ref={(el) => { imageScaleRefs.current[index] = el; }}
                          data-idx={index}
                          className="absolute inset-0"
                          style={{
                            transform: servicesRevealed ? "scale(1)" : "scale(1.12)",
                            transition: "transform 1600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                          }}>
                          <Image
                            src={service?.image}
                            alt={service?.alt}
                            fill
                            sizes={
                              service?.wide ?
                                "(max-width: 768px) 100vw, 58vw" :
                                "(max-width: 768px) 100vw, 42vw"
                            }
                            className="object-cover transition-transform [transition-duration:1200ms] ease-out md:group-hover:scale-[1.06]" />
                        </div>

                        {/* Wipe overlay — slides out to the left on reveal */}
                        <div
                          ref={(el) => { imageWipeRefs.current[index] = el; }}
                          className="absolute inset-0 z-20 bg-[color:var(--gipa-cream)]"
                          style={{
                            transform: servicesRevealed ? "translateX(101%)" : "translateX(0)",
                            transition: "transform 1200ms cubic-bezier(0.77, 0, 0.175, 1)"
                          }} />

                        {/* Gradient overlay */}
                        <div
                          className="absolute inset-0 z-[1]"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.22) 55%, transparent 100%)"
                          }} />

                        <div className="absolute left-5 top-5 z-10">
                          <span className="rounded-sm bg-[#F5C518] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1C1C1C]">
                            {service?.tag}
                          </span>
                        </div>
                        <div className="absolute bottom-5 right-5 z-10 font-display text-[4rem] font-bold leading-none text-white/25">
                          {service?.number}
                        </div>
                      </div>

                      <div className="px-7 pt-7 pb-3 lg:px-8 lg:pt-8 lg:pb-3">
                        <span
                          className="mb-4 block h-[3px] w-12 bg-[#F5C518]"
                          aria-hidden="true" />

                        <h3
                          className={`mb-3 font-bold leading-snug tracking-tight text-[#1C1C1C] ${service?.wide ?
                            "text-xl lg:text-2xl" : "text-xl"}`}>

                          {service?.name}
                        </h3>
                        <p className="text-sm leading-relaxed text-[#1C1C1C]/65">
                          {service?.description}
                        </p>
                        {/* Learn More — hidden by default, slides in on card hover (desktop only) */}
                        <div className="max-h-0 overflow-hidden transition-[max-height,margin] duration-500 ease-out max-md:mt-0 md:group-hover:mt-4 md:group-hover:max-h-10">
                          <Link
                            href={service?.href}
                            className="inline-flex translate-x-[-110%] items-center gap-0 text-xs font-bold uppercase tracking-widest text-[#C48A00] opacity-0 transition-all duration-500 ease-out md:group-hover:translate-x-0 md:group-hover:gap-3 md:group-hover:opacity-100">
                            <span className="block h-[1.5px] w-8 bg-[#F5C518] transition-all duration-500 ease-out md:group-hover:w-10" />
                            Learn More
                            <ChevronRight className="gipa-btn-icon" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div
                className="mt-4 flex justify-center gap-2 md:hidden"
                role="tablist"
                aria-label="Service slides"
              >
                {services.map((service, index) => (
                  <button
                    key={service.name}
                    type="button"
                    role="tab"
                    aria-label={`Go to service ${index + 1}`}
                    aria-current={activeServiceIndex === index ? "true" : undefined}
                    onClick={() => goToService(index)}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center p-2"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "block h-0.5 rounded-full transition-[width,background-color] duration-300 ease-out",
                        activeServiceIndex === index
                          ? "w-6 bg-[#F5C518]"
                          : "w-2 bg-[#1C1C1C]/20",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="why-gipa"
          className="overflow-x-hidden bg-[#0E0E0E]"
          aria-labelledby="why-gipa-heading">

          <div className="h-1 w-full bg-[#F5C518]" aria-hidden="true" />

          <div className="gipa-section-y">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="gipa-rule" />
                    <span className="gipa-eyebrow">
                      Why Choose GIPA
                    </span>
                  </div>
                  <h2
                    id="why-gipa-heading"
                    className="mb-6 text-[clamp(2.2rem,4vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.025em] text-white">

                    <span className="font-display">Logistics you can</span>
                    <br />
                    <span className="font-display italic text-[#F5C518]">
                      actually rely on
                    </span>
                  </h2>
                  <p className="mb-8 max-w-md text-base leading-relaxed text-white/55">
                    We operate with a structured delivery philosophy: plan
                    accurately, execute safely, and maintain compliance across
                    every movement.
                  </p>
                  <HomePrimaryButton href="/our-story">Our Story</HomePrimaryButton>
                </div>

                <div className="flex w-full flex-col gap-4 lg:col-span-7">
                  {whyGipaFeatures.map((feature) =>
                    <motion.article
                      key={feature.title}
                      variants={revealVariant}
                      custom={0}
                      initial={prefersReducedMotion ? "visible" : "hidden"}
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.45, margin: "0px 0px -18% 0px" }}
                      className="box-border flex w-full items-stretch gap-5 border border-white/20 p-7 lg:border-white/10 lg:p-7"
                    >
                      <span className="font-display text-[2.75rem] font-bold leading-none tabular-nums text-[#F5C518] lg:text-5xl">
                        {feature.number}
                      </span>
                      <span
                        className="w-px shrink-0 self-stretch bg-white/10"
                        aria-hidden="true"
                      />
                      <div className="min-w-0 py-0.5">
                        <h3 className="mb-2 text-base font-bold tracking-tight text-white">
                          {feature.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-white/50">
                          {feature.description}
                        </p>
                      </div>
                    </motion.article>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="coverage"
          className="overflow-hidden bg-[color:var(--gipa-cream)]"
          aria-labelledby="coverage-heading">

          <div className="h-1 w-full bg-[#F5C518]" aria-hidden="true" />

          <div className="pt-8 pb-8 lg:pt-10 lg:pb-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:items-stretch lg:gap-10">
                <div className="flex min-w-0 max-w-xl flex-col lg:max-w-none">
                  <div className="mb-5">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="gipa-rule" />
                      <span className="gipa-eyebrow">
                        Where We Operate
                      </span>
                    </div>
                    <h2
                      id="coverage-heading"
                      className="font-display text-[clamp(2.2rem,4vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.025em] text-[color:var(--gipa-charcoal)]">

                      UK-Wide
                      <br />
                      <span className="italic">Coverage</span>
                    </h2>
                    <p className="mt-5 max-w-[36ch] text-lg leading-[1.8] text-[color:var(--gipa-charcoal)]/65">
                      Supporting logistics operations across England, Scotland, Wales and Northern Ireland.
                    </p>
                  </div>

                  <ol className="mt-2 flex flex-1 flex-col justify-between">
                    {coverageSupportPoints.map((point, index) =>
                    <li
                      key={point.number}
                      className="flex items-start gap-5 py-5 lg:py-7"
                      style={{
                        borderBottom:
                          index < coverageSupportPoints.length - 1 ?
                            "1px solid rgba(28,28,28,0.10)" :
                            "none"
                      }}>

                      <span className="mt-0.5 shrink-0 font-display text-xl font-bold tabular-nums leading-none text-[#F5C518] lg:text-2xl">
                        {point.number} —
                      </span>
                      <div>
                        <p className="text-lg font-bold tracking-tight text-[color:var(--gipa-charcoal)] lg:text-xl">
                          {point.title}
                        </p>
                        <p className="mt-2 text-base leading-[1.75] text-[color:var(--gipa-charcoal)]/65">
                          {point.description}
                        </p>
                      </div>
                    </li>
                    )}
                  </ol>
                </div>

                <div className="flex min-h-0 min-w-0 items-center justify-center overflow-visible lg:justify-end">
                  <UKMap />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="careers"
          className="scroll-mt-28 overflow-hidden bg-[color:var(--gipa-cream)]"
          aria-labelledby="careers-heading">

          <div className="h-1 w-full bg-[#F5C518]" aria-hidden="true" />

          <div className="pt-8 pb-16 lg:pt-12 lg:pb-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mb-12 md:mb-16">
                <div className="mb-4 flex items-center gap-3">
                  <div className="gipa-rule" />
                  <span className="gipa-eyebrow">
                    Join Our Team
                  </span>
                </div>
                <h2
                  id="careers-heading"
                  className="font-display text-[clamp(2.2rem,4vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.025em] text-[color:var(--gipa-charcoal)]">

                  Careers at GIPA
                </h2>
              </div>

              <CareersSplit />
            </div>
          </div>
        </section>

        <Testimonials />

        <section
          id="home-cta"
          className="relative overflow-hidden bg-[color:var(--gipa-cream)]"
          aria-labelledby="home-cta-heading">

          <div className="absolute inset-x-0 top-0 z-10 h-1 bg-[#F5C518]" />

          <div className="flex min-h-0 flex-col lg:min-h-[calc(clamp(28rem,50vw,38rem)+80px)] lg:flex-row">
            <div className="flex w-full items-center px-6 py-[18px] md:px-10 lg:w-1/2 lg:px-16 lg:py-[34px]">
              <div className="w-full max-w-xl">
                <div className="mb-5 flex items-center gap-3">
                  <div className="gipa-rule" />
                  <span className="gipa-eyebrow">
                    Ready to Move?
                  </span>
                </div>
                <h2
                  id="home-cta-heading"
                  className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.025em] text-[#1C1C1C]">

                  Start a conversation
                  <br />
                  <span className="italic text-[#F5C518]">
                    about your logistics
                  </span>
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#1C1C1C]/65">
                  Tell us your route profile and delivery requirements. We will
                  design a practical transport plan aligned with your timelines
                  and operational standards.
                </p>
                <div className="mb-10 mt-8 flex flex-wrap items-center gap-6">
                  <HomePrimaryButton href="/contact">
                    Contact Us
                  </HomePrimaryButton>
                </div>
                <div className="flex flex-col gap-3 text-sm text-[#1C1C1C]/50 sm:flex-row sm:gap-6">
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F5C518]" />
                    <a
                      href="mailto:info@gipaservicesuk.com"
                      className="hover:text-[#F5C518]">

                      info@gipaservicesuk.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F5C518]" />
                    <span>Mon–Fri, 07:00–18:00 GMT</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative min-h-[360px] w-full overflow-hidden lg:min-h-0 lg:w-1/2">
              <Image
                src={mediaUrl("homeCta")}
                alt="HGV truck driving on a mountain road"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-right" />

            </div>
          </div>
        </section>
      </div>
    </Layout>);

};

export default Index;