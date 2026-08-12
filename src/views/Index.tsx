"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Route,
  Shield,
  Truck,
} from "lucide-react";
import Layout from "@/components/Layout";
import UKMap from "@/components/UKMap";
import { inter, plusJakarta } from "@/lib/fonts";

const services = [
  {
    name: "Nationwide HGV Delivery",
    description:
      "Full-load and part-load transport operations covering routes across the United Kingdom.",
  },
  {
    name: "Secure Goods Transportation",
    description:
      "Compliance-led transport handling with operational controls focused on cargo safety and traceability.",
  },
  {
    name: "Timed & Scheduled Deliveries",
    description:
      "Reliable collection and delivery windows aligned to your supply chain and warehouse operations.",
  },
  {
    name: "Dedicated Logistics Partnerships",
    description:
      "Long-term transport planning for businesses requiring continuity, consistency, and accountability.",
  },
];

const whyGipaFeatures = [
  {
    title: "Compliance-First Operations",
    description:
      "Structured execution aligned with UK transport and safety standards.",
    icon: Shield,
  },
  {
    title: "Planned Route Discipline",
    description:
      "Consistent route coordination for predictable handovers and delivery timing.",
    icon: Route,
  },
  {
    title: "Professional Fleet Delivery",
    description:
      "Experienced drivers and dependable HGV capability across nationwide routes.",
    icon: Truck,
  },
];

const testimonials = [
  {
    quote:
      "Reliable and timely delivery support. GIPA has been instrumental in keeping our supply chain running smoothly.",
    name: "Transport Manager",
    location: "Midlands",
  },
  {
    quote:
      "Highly dependable transport company. Their professionalism and consistency set them apart.",
    name: "Logistics Coordinator",
    location: "London",
  },
  {
    quote:
      "Excellent safety and coordination standards. We trust GIPA with our most critical shipments.",
    name: "Operations Director",
    location: "Scotland",
  },
];

const overlineClass =
  "text-xs font-semibold uppercase tracking-[0.2em] text-[#C8A96E]";

const sectionPadding = "py-12 md:py-16 lg:py-24";

const Index = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[activeTestimonial];

  const prevTestimonial = () => {
    setActiveTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <Layout>
      <div className={inter.className}>
        <section
          className="relative flex min-h-[calc(100svh-4rem)] items-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 md:px-6 md:py-28 lg:py-32">
            <div className="mx-auto max-w-xl text-center md:mx-0 md:max-w-[55%] md:text-left">
              <h1
                className={`text-3xl font-bold leading-tight text-white lg:text-5xl ${plusJakarta.className}`}
              >
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#F5C518] px-8 py-3 text-sm font-semibold text-[#2C2C2C] transition duration-200 hover:bg-[#F5C518]/90 sm:w-auto"
                >
                  Contact Us
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/driver-application"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] border-2 border-white px-8 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-white hover:text-[#2C2C2C] sm:w-auto"
                >
                  Apply as Driver
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={`bg-[#FAF8F4] ${sectionPadding}`}>
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className={overlineClass}>OUR SERVICES</p>
              <h2
                className={`mt-3 text-3xl font-bold text-[#2C2C2C] md:text-4xl ${plusJakarta.className}`}
              >
                Services Built for UK Logistics Demands
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base text-[#6B7280]">
                Focused transport solutions designed for performance,
                compliance, and continuity across high-volume operational
                routes.
              </p>
            </div>

            <div className="mt-10 grid gap-4">
              {services.map((service) => (
                <article
                  key={service.name}
                  className="group flex items-center justify-between rounded-md border-l-4 border-l-transparent bg-white p-6 shadow-sm transition-all duration-200 hover:border-l-[#F5C518] hover:shadow-md"
                >
                  <div className="flex items-stretch gap-5 pr-4">
                    <span className="w-1 rounded-sm bg-[#F5C518]" aria-hidden="true" />
                    <div>
                      <h3
                        className={`text-lg font-semibold text-[#2C2C2C] ${plusJakarta.className}`}
                      >
                        {service.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#6B7280]">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#C8A96E]" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={`bg-white ${sectionPadding}`}>
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] md:px-6 lg:gap-16">
            <div>
              <Image
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80"
                alt="Logistics warehouse and loading operations"
                width={900}
                height={1200}
                className="h-[360px] w-full rounded-xl object-cover md:h-[480px]"
              />
            </div>

            <div>
              <p className={overlineClass}>WHY GIPA</p>
              <h2
                className={`mt-3 text-3xl font-bold text-[#2C2C2C] md:text-4xl ${plusJakarta.className}`}
              >
                Operational discipline built for dependable UK-wide logistics.
              </h2>
              <p className="mt-4 text-base text-[#6B7280]">
                We operate with a structured delivery philosophy: plan
                accurately, execute safely, and maintain compliance across every
                movement.
              </p>

              <div className="mt-8 space-y-5">
                {whyGipaFeatures.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div key={feature.title} className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#F5C518]">
                        <Icon className="h-5 w-5 text-[#2C2C2C]" />
                      </span>
                      <div>
                        <h3
                          className={`text-base font-semibold text-[#2C2C2C] ${plusJakarta.className}`}
                        >
                          {feature.title}
                        </h3>
                        <p className="mt-1 text-sm text-[#6B7280]">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#FAF8F4] py-10 md:py-12 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className={overlineClass}>COVERAGE</p>
              <h2
                className={`mt-2 text-3xl font-bold text-[#2C2C2C] md:text-4xl ${plusJakarta.className}`}
              >
                Nationwide UK Delivery Coverage
              </h2>
              <p className="mt-2 text-base text-[#6B7280]">
                Operating HGV routes across England, Scotland, Wales, and
                Northern Ireland.
              </p>
            </div>

            <div className="mt-5 flex justify-center overflow-x-hidden md:mt-6">
              <UKMap />
            </div>

            <div className="mt-5 grid w-full grid-cols-3 gap-3 md:mt-6">
              <div className="rounded-xl bg-white p-3 text-center shadow-sm md:p-4">
                <p
                  className={`text-base font-bold text-[#2C2C2C] md:text-lg ${plusJakarta.className}`}
                >
                  UK-Wide Routes
                </p>
                <p className="mt-1 text-xs text-[#6B7280]">Nationwide</p>
              </div>
              <div className="rounded-xl bg-white p-3 text-center shadow-sm md:p-4">
                <p
                  className={`text-base font-bold text-[#2C2C2C] md:text-lg ${plusJakarta.className}`}
                >
                  Compliance-Led
                </p>
                <p className="mt-1 text-xs text-[#6B7280]">Every Delivery</p>
              </div>
              <div className="rounded-xl bg-white p-3 text-center shadow-sm md:p-4">
                <p
                  className={`text-base font-bold text-[#2C2C2C] md:text-lg ${plusJakarta.className}`}
                >
                  HGV Specialist
                </p>
                <p className="mt-1 text-xs text-[#6B7280]">Trained Drivers</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`bg-white ${sectionPadding}`}>
          <div className="mx-auto max-w-7xl px-4 text-center md:px-6">
            <h2
              className={`text-3xl font-bold text-[#2C2C2C] md:text-4xl ${plusJakarta.className}`}
            >
              Trusted by Operations Teams Across the UK
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-[#6B7280]">
              Client feedback focused on reliability, communication, and
              delivery consistency.
            </p>

            <div className="mx-auto mt-12 flex max-w-5xl items-center justify-center gap-3 md:gap-8">
              <button
                type="button"
                onClick={prevTestimonial}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-[#2C2C2C] transition-colors duration-200 hover:border-[#F5C518] hover:text-[#F5C518]"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="max-w-3xl flex-1">
                <span className="block text-8xl leading-none text-[#F5C518]">
                  &ldquo;
                </span>
                <p className="mx-auto -mt-4 max-w-2xl text-xl font-medium italic text-[#2C2C2C]">
                  {currentTestimonial.quote}
                </p>
                <span className="mx-auto my-6 block h-0.5 w-16 bg-[#F5C518]" />
                <p
                  className={`text-base font-semibold text-[#2C2C2C] ${plusJakarta.className}`}
                >
                  {currentTestimonial.name}
                </p>
                <p className="text-sm text-[#6B7280]">{currentTestimonial.location}</p>
              </div>

              <button
                type="button"
                onClick={nextTestimonial}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-[#2C2C2C] transition-colors duration-200 hover:border-[#F5C518] hover:text-[#F5C518]"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.name}
                  type="button"
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-3 w-3 rounded-full transition-colors duration-200 ${
                    index === activeTestimonial
                      ? "bg-[#F5C518]"
                      : "border-2 border-gray-300 bg-transparent"
                  }`}
                  aria-label={`Show testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1C1C1C] py-12 md:py-16 lg:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2 md:px-6 lg:gap-12">
            <div>
              <h2
                className={`text-3xl font-bold leading-tight text-white md:text-4xl ${plusJakarta.className}`}
              >
                Need a dependable logistics partner for nationwide HGV delivery?
              </h2>
              <p className="mt-4 max-w-md text-base text-white/70">
                Tell us your route profile and delivery requirements. We will
                design a practical transport plan aligned with your timelines
                and operational standards.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-[4px] bg-[#F5C518] px-8 py-3 text-sm font-semibold text-[#2C2C2C] transition duration-200 hover:bg-[#F5C518]/90"
                >
                  Contact Us
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/driver-application"
                  className="text-sm font-medium text-white underline transition-colors duration-200 hover:text-[#F5C518]"
                >
                  Driver Application
                </Link>
              </div>
            </div>

            <div>
              <Image
                src="https://images.unsplash.com/photo-1519003300449-424ad0405076?w=900&q=80"
                alt="HGV truck on a UK motorway route"
                width={900}
                height={600}
                className="h-[300px] w-full rounded-xl object-cover object-[20%_42%] opacity-80 md:object-[center_40%]"
              />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
