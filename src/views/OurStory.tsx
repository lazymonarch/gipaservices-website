import Layout from "@/components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/Reveal";

const OurStory = () => {
  return (
    <Layout>
      <section className="pt-32 pb-20 bg-[#F5F3F0]">
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

      <section className="py-16 bg-[#F5F3F0]">
        <FadeUp>
          <div className="max-w-6xl mx-auto px-6">
            <Image
              src="/assets/warehouse-real-1.jpeg"
              alt="Warehouse operations at GIPA Services"
              width={1600}
              height={900}
              className="rounded-2xl w-full h-[500px] object-cover"
            />
            <p className="text-sm text-slate-500 mt-4">
              Our operational environment supporting structured dispatch and
              fleet coordination.
            </p>
          </div>
        </FadeUp>
      </section>

      <section className="py-24 bg-[#F5F3F0]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 mb-6">
                Operational clarity at every stage.
              </h2>

              <p className="text-slate-600 leading-relaxed mb-6">
                Every delivery reflects our commitment to structured planning,
                compliance with UK transport regulations, and professional fleet
                coordination.
              </p>

              <p className="text-slate-600 leading-relaxed">
                From route allocation to final delivery confirmation, our
                approach ensures predictable performance, safe handling, and
                consistent service standards.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div>
              <Image
                src="/assets/forklift-operator.jpeg"
                alt="Forklift operator within GIPA warehouse"
                width={1200}
                height={900}
                className="rounded-2xl w-full object-cover"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-24 bg-[#F5F3F0]">
        <FadeUp>
          <div className="max-w-6xl mx-auto px-6">
            <Image
              src="/assets/workers-loading.jpg"
              alt="Logistics team loading goods into vehicle"
              width={1600}
              height={900}
              className="rounded-2xl w-full h-[450px] object-cover mb-12"
            />

            <h2 className="text-3xl font-semibold text-slate-900 mb-6">
              From warehouse floor to nationwide delivery.
            </h2>

            <p className="text-slate-600 leading-relaxed mb-6">
              Our logistics process begins within structured warehouse
              environments, where goods are handled with care, accuracy, and
              safety controls.
            </p>

            <p className="text-slate-600 leading-relaxed">
              Through coordinated dispatch systems and experienced drivers, we
              extend this structured approach across transport routes
              nationwide.
            </p>
          </div>
        </FadeUp>
      </section>

      <section className="py-24 bg-[#F5F3F0]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 mb-6">
                Expanding capability across the United Kingdom.
              </h2>

              <p className="text-slate-600 leading-relaxed mb-6">
                Our long-term objective is to strengthen our logistics
                capacity, expand service coverage, and build enduring
                partnerships with businesses across the UK.
              </p>

              <p className="text-slate-600 leading-relaxed">
                With professional drivers, structured fleet operations, and
                compliance-first systems, we continue to scale responsibly.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div>
              <Image
                src="/assets/fleet-lineup.jpg"
                alt="Fleet lineup representing GIPA logistics capability"
                width={1200}
                height={900}
                className="rounded-2xl w-full object-cover"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="relative py-24">
        <Image
          src="/assets/aerial-yard.jpg"
          alt="Aerial view of logistics yard operations"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-semibold mb-6">
            Committed to dependable nationwide logistics.
          </h2>

          <p className="text-slate-200 mb-8">
            Built on operational discipline, professional drivers, and
            structured logistics planning across every transport route.
          </p>

          <Button
            asChild
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium h-auto"
          >
            <Link href="/contact">Contact Our Team</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default OurStory;
