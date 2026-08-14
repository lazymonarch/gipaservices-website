"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  ChevronRight,
  Route,
  Shield,
  Truck } from
"lucide-react";
import Layout from "@/components/Layout";
import UKMap from "@/components/UKMap";
import Testimonials from "@/components/Testimonials";
import HomePrimaryButton from "@/components/HomePrimaryButton";

const services = [
{
  name: "Nationwide HGV Delivery",
  description:
  "Full-load and part-load transport operations covering routes across the United Kingdom.",
  tag: "Full-load · Part-load",
  number: "01",
  href: "/contact",
  image:
  "https://img.rocket.new/generatedImages/rocket_gen_img_1a293c69e-1773072588388.png",
  alt: "HGV articulated lorry driving on a UK motorway",
  wide: true
},
{
  name: "Secure Goods Transportation",
  description:
  "Compliance-led transport handling with operational controls focused on cargo safety and traceability.",
  tag: "Secure · Compliant",
  number: "02",
  href: "/contact",
  image:
  "https://img.rocket.new/generatedImages/rocket_gen_img_157f7924c-1786705239862.png",
  alt: "Logistics warehouse and loading operations",
  wide: false
},
{
  name: "Timed & Scheduled Deliveries",
  description:
  "Reliable collection and delivery windows aligned to your supply chain and warehouse operations.",
  tag: "Timed · Scheduled",
  number: "03",
  href: "/contact",
  image:
  "https://images.unsplash.com/photo-1690913967058-e1a7323a58a2",
  alt: "Loading dock at night with trucks at warehouse bays",
  wide: false
},
{
  name: "Dedicated Logistics Partnerships",
  description:
  "Long-term transport planning for businesses requiring continuity, consistency, and accountability.",
  tag: "Dedicated · Long-term",
  number: "04",
  href: "/contact",
  image:
  "https://img.rocket.new/generatedImages/rocket_gen_img_1683f5bd2-1773072579871.png",
  alt: "HGV truck on a UK motorway route",
  wide: true
}];


const whyGipaFeatures = [
{
  title: "Experienced Professional Drivers",
  description:
  "Experienced drivers and dependable HGV capability across nationwide routes.",
  icon: Truck
},
{
  title: "Compliance & Safety First",
  description:
  "Structured execution aligned with UK transport and safety standards.",
  icon: Shield
},
{
  title: "Nationwide UK Coverage",
  description:
  "Operating HGV routes across England, Scotland, Wales, and Northern Ireland.",
  icon: Route
}];


const Index = () => {
  const sectionHeadingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const imageWipeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageScaleRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Section heading observer — 20% threshold, 800ms ease
    const headingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            headingObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionHeadingRef.current) {
      headingObserver.observe(sectionHeadingRef.current);
    }

    // Card observer — 10% threshold, staggered delays
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            cardObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((card) => {
      if (card) cardObserver.observe(card);
    });

    // Image wipe observer — triggers wipe + scale reveal
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt((entry.target as HTMLElement).dataset.idx || "0");
            const wipe = imageWipeRefs.current[idx];
            const scale = imageScaleRefs.current[idx];

            if (wipe) {
              wipe.style.transform = "translateX(101%)";
            }
            if (scale) {
              scale.style.transform = "scale(1)";
            }

            imageObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    imageScaleRefs.current.forEach((el) => {
      if (el) imageObserver.observe(el);
    });

    return () => {
      headingObserver.disconnect();
      cardObserver.disconnect();
      imageObserver.disconnect();
    };
  }, []);

  return (
    <Layout>
      <div className="font-sans">
        {/* Hero section */}
        <section
          className="relative flex min-h-[calc(100svh-4rem)] items-center"
          style={{
            backgroundImage:
            "url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat"
          }}>
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 md:px-6 md:py-28 lg:py-32">
            <div className="mx-auto max-w-xl text-center md:mx-0 md:max-w-[55%] md:text-left">
              <h1 className="font-display text-3xl font-bold leading-tight text-white lg:text-5xl">
                A logistics partner you can trust, mile after mile.
              </h1>
              <p className="mt-4 max-w-md text-base text-white/80 lg:text-lg">
                GIPA Services supports your business with UK-wide HGV delivery,
                trained drivers, and compliance-led operations designed around
                your timelines and cargo needs.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#F5C518] px-8 py-3 text-sm font-semibold text-[#2C2C2C] transition duration-200 hover:bg-[#F5C518]/90 sm:w-auto">
                  
                  Contact Us
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/driver-application"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] border-2 border-white px-8 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-white hover:text-[#2C2C2C] sm:w-auto">
                  
                  Apply as Driver
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services section */}
        <section
          id="services"
          className="overflow-hidden bg-[#111111] py-20 lg:py-32"
          aria-labelledby="services-heading">
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Section heading — fade + upward reveal */}
            <div
              ref={sectionHeadingRef}
              className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end lg:mb-24"
              style={{
                opacity: 0,
                transform: "translateY(28px)",
                transition: "opacity 800ms ease, transform 800ms ease"
              }}>
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-[2px] w-8 bg-[#F5C518]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5C518]">
                    What We Do
                  </span>
                </div>
                <h2
                  id="services-heading"
                  className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.025em] text-white">
                  
                  Our Services
                </h2>
              </div>
              <p className="max-w-md border-r-2 border-[#F5C518] pr-4 text-base leading-relaxed text-white/45 md:text-right">
                Focused transport solutions designed for performance,
                compliance, and continuity across high-volume operational
                routes.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:gap-5">
              {services?.map((service, index) => {
                const staggerDelay = index * 100;
                return (
                  <article
                    key={service?.name}
                    ref={(el) => { cardRefs.current[index] = el; }}
                    className={`group relative overflow-hidden rounded bg-[#1A1A1A] ${
                    service?.wide ? "md:col-span-7" : "md:col-span-5"}`}
                    style={{
                      opacity: 0,
                      transform: "translateY(32px)",
                      transition: `opacity 700ms ease ${staggerDelay}ms, transform 700ms ease ${staggerDelay}ms`
                    }}>
                    
                    {/* Image container with wipe reveal */}
                    <div
                      className="relative overflow-hidden"
                      style={{
                        height: service?.wide ?
                        "clamp(260px, 35vw, 420px)" :
                        "clamp(220px, 28vw, 340px)"
                      }}>
                      
                      {/* Image wrapper — starts scaled up, scales to 1 on reveal */}
                      <div
                        ref={(el) => { imageScaleRefs.current[index] = el; }}
                        data-idx={index}
                        className="absolute inset-0"
                        style={{
                          transform: "scale(1.12)",
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
                          className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]" />
                      </div>

                      {/* Dark wipe overlay — slides out to the left on reveal */}
                      <div
                        ref={(el) => { imageWipeRefs.current[index] = el; }}
                        className="absolute inset-0 z-20 bg-[#111111]"
                        style={{
                          transform: "translateX(0)",
                          transition: "transform 1200ms cubic-bezier(0.77, 0, 0.175, 1)"
                        }} />

                      {/* Gradient overlay */}
                      <div
                        className="absolute inset-0 z-[1]"
                        style={{
                          background:
                          "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.3) 55%, transparent 100%)"
                        }} />
                    
                      <div className="absolute left-5 top-5 z-10">
                        <span className="rounded-sm bg-[#F5C518] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1C1C1C]">
                          {service?.tag}
                        </span>
                      </div>
                      <div className="absolute bottom-5 right-5 z-10 font-display text-[4rem] font-bold leading-none text-white/20">
                        {service?.number}
                      </div>
                    </div>

                    <div className="p-7 lg:p-8">
                      <span
                        className="mb-4 block h-[3px] w-12 bg-[#F5C518]"
                        aria-hidden="true" />
                    
                      <h3
                        className={`mb-3 font-bold leading-snug tracking-tight text-white ${
                        service?.wide ?
                        "text-xl lg:text-2xl" : "text-xl"}`}>
                        
                        {service?.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/55">
                        {service?.description}
                      </p>
                      {/* Learn More — hover gap expands from 2 to 4 */}
                      <Link
                        href={service?.href}
                        className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F5C518] transition-[gap] duration-300 hover:gap-4">
                        
                        Learn More
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="why-gipa"
          className="overflow-hidden bg-[#0E0E0E]"
          aria-labelledby="why-gipa-heading">
          
          <div
            className="relative w-full overflow-hidden"
            style={{ height: "clamp(200px, 18vw, 280px)" }}>
            
            <Image
              src="https://img.rocket.new/generatedImages/rocket_gen_img_157f7924c-1786705239862.png"
              alt="Logistics warehouse and loading operations"
              fill
              sizes="100vw"
              className="object-cover object-[center_40%]" />
            
            <div
              className="absolute inset-0 z-[1]"
              style={{
                background:
                "linear-gradient(to bottom, rgba(14,14,14,0.15) 0%, rgba(14,14,14,0.0) 40%, rgba(14,14,14,0.85) 100%)"
              }} />
            
            <div className="absolute bottom-8 left-0 right-0 z-10 mx-auto max-w-7xl px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-8 bg-[#F5C518]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5C518]">
                  Why Choose GIPA
                </span>
              </div>
            </div>
          </div>

          <div className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
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

                <div className="flex flex-col lg:col-span-7">
                  {whyGipaFeatures?.map((feature, index) => {
                    const Icon = feature?.icon;

                    return (
                      <div
                        key={feature?.title}
                        className="flex items-start gap-5 py-7"
                        style={{
                          borderBottom:
                          index < whyGipaFeatures?.length - 1 ?
                          "1px solid rgba(255,255,255,0.08)" :
                          "none"
                        }}>
                        
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] text-[#F5C518]"
                          style={{
                            background: "rgba(245,197,24,0.12)",
                            border: "1px solid rgba(245,197,24,0.25)"
                          }}>
                          
                          <Icon className="h-[22px] w-[22px]" />
                        </div>
                        <div>
                          <h3 className="mb-2 text-base font-bold tracking-tight text-white">
                            {feature?.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-white/50">
                            {feature?.description}
                          </p>
                        </div>
                      </div>);

                  })}
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

          <div className="pt-8 pb-16 lg:pt-10 lg:pb-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mb-8 flex flex-col justify-between gap-6 md:mb-10 md:flex-row md:items-end">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-[2px] w-8 bg-[#F5C518]" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5C518]">
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
                </div>
                <p className="max-w-sm border-r-2 border-[#F5C518] pr-4 text-base leading-relaxed text-[color:var(--gipa-charcoal)]/55 md:text-right">
                  Operating HGV routes across England, Scotland, Wales, and
                  Northern Ireland.
                </p>
              </div>

              <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
                <div className="min-w-0 lg:col-span-7 [&>div]:!max-w-none [&>div]:overflow-visible [&_.rounded-md]:rounded-none [&_rect]:fill-[color:var(--gipa-cream)]">
                  <UKMap />
                </div>

                <div className="lg:col-span-5">
                  <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                    "England",
                    "Scotland",
                    "Wales",
                    "Northern Ireland"]?.
                    map((region) =>
                    <div
                      key={region}
                      className="rounded-[4px] border border-[color:var(--gipa-charcoal)]/10 border-l-[3px] border-l-[#F5C518] bg-white p-5">
                      
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[#F5C518]" />
                          <p className="text-lg font-bold text-[color:var(--gipa-charcoal)]">
                            {region}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-l-4 border-[#F5C518] py-1 pl-6">
                    <p className="text-base leading-relaxed text-[color:var(--gipa-charcoal)]/65">
                      Our network operates across England, Scotland, Wales and
                      Northern Ireland, providing dependable HGV transport
                      coverage across the UK.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Testimonials />

        <section
          id="home-cta"
          className="relative overflow-hidden bg-[color:var(--gipa-cream)]"
          aria-labelledby="home-cta-heading">
          
          <div className="absolute inset-x-0 top-0 z-10 h-1 bg-[#F5C518]" />

          <div className="flex min-h-0 flex-col lg:min-h-[clamp(28rem,50vw,38rem)] lg:flex-row">
            <div className="flex w-full items-center px-6 py-12 md:px-10 lg:w-1/2 lg:px-16 lg:py-16">
              <div className="w-full max-w-xl">
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-[2px] w-8 bg-[#F5C518]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5C518]">
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
                  <Link
                    href="/driver-application"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1C1C1C] transition-colors duration-200 hover:text-[#F5C518]">
                    
                    Driver Application
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex flex-col gap-3 text-sm text-[#1C1C1C]/50 sm:flex-row sm:gap-6">
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F5C518]" />
                    <a
                      href="mailto:info@gipaservices.co.uk"
                      className="hover:text-[#F5C518]">
                      
                      info@gipaservices.co.uk
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F5C518]" />
                    <span>Mon–Fri, 07:00–18:00 GMT</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative min-h-[280px] w-full overflow-hidden lg:min-h-0 lg:w-1/2">
              <Image
                src="https://images.unsplash.com/photo-1652081439602-b917d33f794b"
                alt="HGV truck driving on a UK motorway at dusk"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[center_55%]" />
              
            </div>
          </div>
        </section>
      </div>
    </Layout>);

};

export default Index;