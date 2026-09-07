"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials, type Testimonial } from "@/data/testimonials";
import { cn } from "@/lib/utils";

function getInitials(testimonial: Testimonial) {
  if (testimonial.initials) return testimonial.initials;

  const parts = testimonial.name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = getInitials(testimonial);
  const meta = [testimonial.role, testimonial.company, testimonial.location]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="flex h-full flex-col px-6 py-2 md:px-8 lg:px-10">
      <span
        className="font-display text-5xl leading-none text-[#F5C518]"
        aria-hidden="true"
      >
        &ldquo;
      </span>
      <p className="gipa-text-body mt-4 flex-1 text-white/80">
        {testimonial.quote}
      </p>
      <span
        className="my-6 block h-px w-12 bg-[#F5C518]"
        aria-hidden="true"
      />
      <div className="flex items-center gap-3">
        {initials ? (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-gipa border border-gipa-yellow/30 bg-gipa-yellow/10 text-xs font-bold tracking-wide text-gipa-yellow">
            {initials}
          </span>
        ) : null}
        <div>
          <p className="text-sm font-bold text-white">{testimonial.name}</p>
          {meta ? (
            <p className="mt-0.5 text-xs text-white/50">{meta}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByPage = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section
      id="testimonials"
      className="overflow-hidden bg-[#0E0E0E] gipa-section-y"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="gipa-rule" />
              <span className="gipa-eyebrow">
                Client Feedback
              </span>
            </div>
            <h2
              id="testimonials-heading"
              className="font-display text-[clamp(2.2rem,4vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.025em] text-white"
            >
              Trusted by
              <br />
              <span className="italic text-[#F5C518]">UK businesses</span>
            </h2>
            <p className="gipa-text-body mt-5 max-w-xl text-white/55">
              Client feedback focused on reliability, communication, and delivery
              consistency.
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label="Previous testimonials"
              disabled={!canPrev}
              onClick={() => scrollByPage(-1)}
              className="flex h-11 w-11 items-center justify-center border border-white/25 text-white transition-opacity duration-200 enabled:hover:border-[#F5C518] enabled:hover:text-[#F5C518] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next testimonials"
              disabled={!canNext}
              onClick={() => scrollByPage(1)}
              className="flex h-11 w-11 items-center justify-center border border-white/25 text-white transition-opacity duration-200 enabled:hover:border-[#F5C518] enabled:hover:text-[#F5C518] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={cn(
                "w-full shrink-0 snap-start md:w-1/2",
                index < testimonials.length - 1 &&
                  "border-r border-white/10",
              )}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
