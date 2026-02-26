import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Layout from "@/components/Layout";
import ContactButton from "@/components/ContactButton";
import { FadeUp } from "@/components/motion/Reveal";

const services = [
  {
    title: "Nationwide HGV Delivery",
    desc: "Full-load and part-load transport operations covering routes across the United Kingdom.",
  },
  {
    title: "Secure Goods Transportation",
    desc: "Compliance-led transport handling with operational controls focused on cargo safety and traceability.",
  },
  {
    title: "Timed & Scheduled Deliveries",
    desc: "Reliable collection and delivery windows aligned to your supply chain and warehouse operations.",
  },
  {
    title: "Dedicated Logistics Partnerships",
    desc: "Long-term transport planning for businesses requiring continuity, consistency, and accountability.",
  },
];

const whyGipaItems = [
  {
    title: "Compliance-First Operations",
    description:
      "Structured execution aligned with UK transport and safety standards.",
  },
  {
    title: "Planned Route Discipline",
    description:
      "Consistent route coordination for predictable handovers and delivery timing.",
  },
  {
    title: "Professional Fleet Delivery",
    description:
      "Experienced drivers and dependable HGV capability across nationwide routes.",
  },
];

const reviews = [
  {
    text: "Reliable and timely delivery support. GIPA has been instrumental in keeping our supply chain running smoothly.",
    author: "Transport Manager, Midlands",
  },
  {
    text: "Highly dependable transport company. Their professionalism and consistency set them apart.",
    author: "Logistics Coordinator, London",
  },
  {
    text: "Excellent safety and coordination standards. We trust GIPA with our most critical shipments.",
    author: "Operations Director, Scotland",
  },
];

const Index = () => {
  return (
    <Layout>
      <section className="relative min-h-[70vh] flex items-center">
        <div className="absolute inset-0 before:absolute before:inset-0 before:z-10 before:bg-gradient-to-r before:from-black/80 before:via-black/60 before:to-black/20 before:content-['']">
          <Image
            src="/assets/hero-truck.jpg"
            alt="HGV truck on UK motorway"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_center]"
          />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto px-6 w-full">
          <FadeUp className="max-w-xl" mode="mount">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight mb-5 max-w-xl">
              A logistics partner you can trust, mile after mile.
            </h1>
            <p className="max-w-lg text-slate-100/80 text-base md:text-lg leading-relaxed mb-8">
              GIPA Services supports your business with UK-wide HGV delivery,
              trained drivers, and compliance-led operations designed around
              your timelines and cargo needs.
            </p>
            <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-4">
              <ContactButton />
              <Button
                asChild
                variant="outline"
                className="border border-slate-200/60 text-slate-100 hover:bg-white/10 px-5 py-2.5 rounded-full text-sm font-medium h-auto bg-transparent"
              >
                <Link href="/driver-application">Apply as Driver</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#F5F3F0]">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
              Services Built for UK Logistics Demands
            </h2>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mt-3">
              Focused transport solutions designed for performance, compliance,
              and continuity across high-volume operational routes.
            </p>
          </FadeUp>

          <div className="grid gap-6 md:grid-cols-2 mt-8">
            {services.map((service) => (
              <FadeUp key={service.title}>
                <article className="bg-white rounded-xl border border-slate-200 border-t border-slate-100 p-6 transition hover:shadow-sm">
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.desc}
                  </p>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#F5F3F0]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <div className="relative">
              <Image
                src="/assets/warehouse-logistics.jpg"
                alt="Logistics warehouse operations"
                width={1200}
                height={800}
                className="rounded-2xl object-cover w-full h-full"
              />
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <p className="text-sm uppercase tracking-widest text-amber-500 font-medium mb-3">
              Why GIPA
            </p>

            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
              Operational discipline built for dependable UK-wide logistics.
            </h2>

            <p className="text-sm md:text-base text-slate-500 max-w-2xl mt-3 mb-8">
              We operate with a structured delivery philosophy: plan
              accurately, execute safely, and maintain compliance across every
              movement.
            </p>

            <div className="space-y-6 mt-6">
              {whyGipaItems.map((item) => (
                <div key={item.title}>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#F5F3F0] py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
              Trusted by Operations Teams Across the UK
            </h2>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl mt-3">
              Client feedback focused on reliability, communication, and
              delivery consistency.
            </p>
          </FadeUp>

          <div className="relative mt-10 md:mt-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[#F5F3F0] to-transparent md:hidden" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[#F5F3F0] to-transparent md:hidden" />

            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
              {reviews.map((review) => (
                <div
                  key={review.author}
                  className="min-w-[85%] snap-start sm:min-w-[62%] md:min-w-0"
                >
                  <article className="bg-[#242424] rounded-xl border border-white/5 border-t-2 border-t-yellow-400 p-6 flex flex-col justify-between shadow-sm transition hover:border-yellow-400 hover:shadow-md h-full">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm md:text-[15px] text-white/90 leading-relaxed mb-4">
                      &ldquo;{review.text}&rdquo;
                    </p>
                    <p className="text-xs text-white/70 mt-auto">
                      {review.author}
                    </p>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <div className="flex md:hidden justify-center gap-2 mt-4">
            {reviews.map((_, index) => (
              <span
                key={`review-dot-${index}`}
                className="h-1.5 w-1.5 rounded-full bg-slate-300"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#F5F3F0]">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="bg-yellow-50 border border-yellow-100 rounded-2xl p-8 md:p-10">
            <div className="md:flex md:flex-wrap md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
                  Need a dependable logistics partner for nationwide HGV
                  delivery?
                </h2>
                <p className="text-sm md:text-base text-slate-600 max-w-xl">
                  Tell us your route profile and delivery requirements. We will
                  design a practical transport plan aligned with your timelines
                  and operational standards.
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4 mt-6 md:mt-0 md:shrink-0">
                <ContactButton />
                <Button
                  asChild
                  variant="outline"
                  className="px-6 py-2.5 text-sm font-medium rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors duration-200 h-auto bg-transparent whitespace-nowrap"
                >
                  <Link href="/driver-application">Driver Application</Link>
                </Button>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
