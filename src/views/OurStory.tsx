import Layout from "@/components/Layout";
import Image from "next/image";
import Link from "next/link";
import { FadeUp } from "@/components/motion/Reveal";
import { ChevronRight, ClipboardCheck, MapPin, Shield } from "lucide-react";
import HeroEyebrow from "@/components/HeroEyebrow";
import { mediaUrl } from "@/lib/media";

const valueCards = [
{
  title: "Safety First",
  description:
  "Every route is planned with compliance, driver welfare, and cargo security at the centre.",
  icon: Shield
},
{
  title: "Compliance-Led Operations",
  description:
  "We operate in full alignment with UK transport regulations and DVSA standards.",
  icon: ClipboardCheck
},
{
  title: "Nationwide Reach",
  description:
  "Covering England, Scotland, Wales, and Northern Ireland with structured HGV logistics.",
  icon: MapPin
}];


const OurStory = () => {
  return (
    <Layout>
      <section
        className="relative -mt-16 flex min-h-[clamp(34rem,70vw,45rem)] items-center overflow-hidden bg-[color:var(--gipa-charcoal)] pt-16"
        aria-label="Our Story hero">
        
        <Image
          src="https://images.unsplash.com/photo-1596475522275-4c86d9dd84d3"
          alt="Professional HGV truck travelling on a UK motorway at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center" />
        
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/86 via-black/62 to-black/36" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/16 to-black/34" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <FadeUp mode="mount">
            <div className="max-w-[46rem]">
              <HeroEyebrow text="OUR STORY" />

              <h1 className="gipa-hero-title text-white text-[clamp(3.25rem,5.4vw,5.4rem)]">
                A Commitment to
                <br />
                <span className="gipa-hero-accent">Professional</span> Logistics
              </h1>

              <p className="mt-7 max-w-[41rem] text-base leading-[1.75] text-white md:text-lg">
                Trusted HGV transport across England, Scotland, Wales and
                Northern Ireland — built on experience, compliance and
                professional pride.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>
      <section className="overflow-hidden bg-[color:var(--gipa-cream)] gipa-section-y">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
            <FadeUp className="lg:col-span-5">
              <div className="mb-5 flex items-center gap-3">
                <span className="gipa-rule" aria-hidden="true" />
                <p className="gipa-eyebrow">
                  WHO WE ARE
                </p>
              </div>
              <h2 className="font-display text-[clamp(2rem,3.4vw,3.2rem)] font-bold leading-[1.02] tracking-[-0.025em] text-[#1C1C1C]">
                Built on Experience.
                <br />
                <span className="italic text-[#F5C518]">Driven</span> by Reliability.
              </h2>
              <p className="gipa-text-body mt-6 max-w-xl text-gipa-charcoal/65 md:text-lg">
                GIPA Services Limited is a UK-based HGV logistics and transport company dedicated to delivering professional, reliable, and compliant transport solutions. Founded on the principles of operational excellence and driver professionalism, we have built a reputation for dependable service across England, Scotland, Wales, and Northern Ireland.
              </p>
              <p className="gipa-text-body mt-5 max-w-xl text-gipa-charcoal/65 md:text-lg">
                Our team of experienced HGV drivers and logistics professionals work tirelessly to ensure your goods reach their destination safely, on time, and in perfect condition.
              </p>
            </FadeUp>

            <FadeUp className="lg:col-span-7" delay={0.1}>
              <div className="relative min-h-[300px] overflow-hidden rounded-gipa bg-white shadow-[0_12px_40px_rgba(28,28,28,0.10)] sm:min-h-[390px] lg:min-h-[460px]">
                <Image
                  src={mediaUrl("warehouseReal")}
                  alt="Warehouse operations at GIPA Services"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-center" />
                
                <span className="absolute bottom-0 left-0 h-1 w-20 bg-[#F5C518]" aria-hidden="true" />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
      <section className="bg-[color:var(--gipa-charcoal)] gipa-section-y">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeUp>
            <div className="mb-12 text-center lg:mb-14">
              <div className="mb-5 flex items-center justify-center gap-3">
                <span className="gipa-rule" aria-hidden="true" />
                <p className="gipa-eyebrow">
                  OUR VALUES
                </p>
                <span className="gipa-rule" aria-hidden="true" />
              </div>
              <h2 className="gipa-heading-h2 text-white">
                What We Stand For
              </h2>
            </div>
          </FadeUp>

          <div className="grid gap-5 md:grid-cols-3">
            {valueCards?.map((card, index) => {
              const Icon = card?.icon;

              return (
                <FadeUp key={card?.title} delay={index * 0.1}>
                  <article className="gipa-card-dark h-full border-t-[3px] border-t-gipa-yellow bg-[#242424] p-7 transition duration-300 hover:-translate-y-1 hover:bg-[#2E2E2E] lg:p-8">
                    <Icon className="mb-6 h-7 w-7 text-gipa-yellow" strokeWidth={1.8} />
                    <h3 className="gipa-heading-h3 mb-3 text-white">
                      {card?.title}
                    </h3>
                    <p className="gipa-text-body text-white/70">
                      {card?.description}
                    </p>
                  </article>
                </FadeUp>);

            })}
          </div>
        </div>
      </section>
      <section className="overflow-hidden bg-[color:var(--gipa-cream)] gipa-section-y">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12 lg:gap-20 lg:px-8">
          <FadeUp className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-gipa shadow-[0_12px_40px_rgba(28,28,28,0.10)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://img.rocket.new/generatedImages/rocket_gen_img_145accce3-1772852165930.png"
                alt="Forklift operator working efficiently in a professional UK warehouse distribution centre"
                className="h-[300px] w-full object-cover sm:h-[380px] lg:h-[460px]"
                loading="lazy" />
              
              <span className="absolute left-0 top-0 h-1 w-20 bg-[#F5C518]" />
            </div>
          </FadeUp>

          <FadeUp className="lg:col-span-6" delay={0.1}>
            <div className="max-w-xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="gipa-rule" aria-hidden="true" />
                <p className="gipa-eyebrow">
                  HOW WE WORK
                </p>
              </div>
              <h2 className="gipa-heading-h2 text-gipa-charcoal">
                How We Operate
              </h2>
              <p className="mt-6 gipa-text-body text-lg text-gipa-charcoal/65">
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
      <section className="relative overflow-hidden bg-[color:var(--gipa-charcoal)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://img.rocket.new/generatedImages/rocket_gen_img_10b00c406-1767774070711.png"
          alt="Fleet of professional HGV trucks lined up in a UK logistics yard"
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy" />
        
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/86 via-black/62 to-black/36" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/16 to-black/34" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 text-center lg:px-8 lg:py-28">
          <FadeUp>
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="gipa-rule" aria-hidden="true" />
              <p className="gipa-eyebrow">
                Get In Touch
              </p>
              <span className="gipa-rule" aria-hidden="true" />
            </div>
            <h2 className="font-display text-[clamp(2.1rem,4vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.025em] text-white">
              Ready to work with a logistics team that delivers?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              Contact our team to discuss your UK transport requirements.
            </p>

            <div className="mt-9 flex justify-center">
              <Link
                href="/contact"
                className="gipa-btn-primary w-full sm:w-auto">
                
                Get In Touch
                <ChevronRight className="gipa-btn-icon" aria-hidden="true" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </Layout>);

};

export default OurStory;