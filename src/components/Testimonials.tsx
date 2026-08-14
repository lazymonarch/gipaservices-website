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
    <article className="flex h-full flex-col rounded-[4px] border border-white/10 bg-[#1A1A1A] p-7 lg:p-8">
      <span
        className="font-display text-5xl leading-none text-[#F5C518]"
        aria-hidden="true"
      >
        &ldquo;
      </span>
      <p className="mt-4 flex-1 text-base leading-relaxed text-white/80">
        {testimonial.quote}
      </p>
      <span
        className="my-6 block h-px w-12 bg-[#F5C518]"
        aria-hidden="true"
      />
      <div className="flex items-center gap-3">
        {initials ? (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-[#F5C518]/30 bg-[#F5C518]/10 text-xs font-bold tracking-wide text-[#F5C518]">
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
  const count = testimonials.length;

  return (
    <section
      id="testimonials"
      className="overflow-hidden bg-[#0E0E0E] py-16 lg:py-24"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 max-w-3xl md:mb-16">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-[2px] w-8 bg-[#F5C518]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5C518]">
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
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/55">
            Client feedback focused on reliability, communication, and delivery
            consistency.
          </p>
        </div>

        <div
          className={cn(
            "grid gap-5",
            count === 1
              ? "mx-auto max-w-2xl grid-cols-1"
              : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
          )}
        >
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
