import Layout from "@/components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/Reveal";
import { ClipboardCheck, MapPin, Shield } from "lucide-react";

const OurStory = () => {
  return (
    <Layout>
      <section className="pt-4 pb-0 bg-[#F5F3F0]">
        <FadeUp mode="mount">
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-sm uppercase tracking-widest text-amber-500 mb-6">
              Our Story
            </p>

            <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight mb-6">
              Built on real operations, real drivers, and structured logistics
              discipline.
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              GIPA Services Limited was founded with a clear mission: to
              provide dependable, professional nationwide HGV transport services
              across the United Kingdom. Our foundation is built on operational
              clarity, regulatory compliance, and disciplined execution at every
              stage of the logistics process.
            </p>
          </div>
        </FadeUp>
      </section>

      <section className="pt-0 pb-16 mt-0 bg-[#F5F3F0]">
        <FadeUp>
          <div className="w-full max-w-5xl mx-auto px-4 mt-8 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative h-[240px] md:h-[380px] w-full rounded-xl overflow-hidden">
                <Image
                  src="/assets/warehouse-real-1.jpeg"
                  alt="Warehouse operations at GIPA Services"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="relative h-[240px] md:h-[380px] w-full rounded-xl overflow-hidden">
                <Image
                  src="/assets/forklift-operator.jpeg"
                  alt="Forklift crane operating inside a structured warehouse environment"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-3 text-center">
              Our operational environment — structured dispatch and fleet
              coordination.
            </p>
          </div>
        </FadeUp>
      </section>

      <section className="py-20 mt-4 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#2D2D2D] mb-3">
                What We Stand For
              </h2>
            </div>
          </FadeUp>

          <div className="grid gap-6 md:grid-cols-3">
            <FadeUp>
              <article className="h-full rounded-xl border-l-4 border-[#F5C518] bg-white p-6 shadow-sm">
                <Shield className="h-6 w-6 text-[#F5C518] mb-4" />
                <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">
                  Safety First
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Every route is planned with compliance, driver welfare, and
                  cargo security at the centre.
                </p>
              </article>
            </FadeUp>

            <FadeUp delay={0.1}>
              <article className="h-full rounded-xl border-l-4 border-[#F5C518] bg-white p-6 shadow-sm">
                <ClipboardCheck className="h-6 w-6 text-[#F5C518] mb-4" />
                <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">
                  Compliance-Led Operations
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  We operate in full alignment with UK transport regulations
                  and DVSA standards.
                </p>
              </article>
            </FadeUp>

            <FadeUp delay={0.2}>
              <article className="h-full rounded-xl border-l-4 border-[#F5C518] bg-white p-6 shadow-sm">
                <MapPin className="h-6 w-6 text-[#F5C518] mb-4" />
                <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">
                  Nationwide Reach
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Covering England, Scotland, Wales, and Northern Ireland with
                  structured HGV logistics.
                </p>
              </article>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="py-20 mt-4 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6 grid gap-10 lg:grid-cols-2 items-center">
          <FadeUp>
            <Image
              src="/assets/fleet-lineup.jpg"
              alt="Fleet of GIPA Services HGV trucks ready for nationwide UK deployment"
              width={1600}
              height={900}
              className="rounded-2xl w-full h-[300px] sm:h-[380px] lg:h-[420px] object-cover"
            />
          </FadeUp>

          <FadeUp delay={0.1}>
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#2D2D2D] mb-6">
                How We Operate
              </h2>
              <p className="text-slate-600 leading-relaxed">
                From the moment a route is confirmed, GIPA Services applies a
                structured approach to every delivery. Our drivers are
                experienced, compliance-checked, and supported by clear
                dispatch coordination. We do not cut corners on safety, timing,
                or communication. Every client receives the same standard:
                professional, punctual, and accountable.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#2D2D2D] py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-6 text-center md:text-left">
          <h2 className="text-3xl font-semibold leading-tight text-white">
            Ready to work with a logistics team that delivers?
          </h2>
          <p className="mt-3 text-white/75">
            Contact our team to discuss your UK transport requirements.
          </p>

          <div className="mt-7 flex flex-col items-center gap-4 md:flex-row md:items-center">
            <Button
              asChild
              className="bg-[#F5C518] hover:bg-yellow-400 text-[#2D2D2D] px-6 py-3 rounded-lg font-semibold h-auto"
            >
              <Link href="/contact">Get In Touch</Link>
            </Button>
            <Link
              href="/driver-application"
              className="text-sm font-medium text-white underline underline-offset-4 transition-colors duration-200 hover:text-[#C8A96E]"
            >
              Apply as a Driver
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OurStory;
