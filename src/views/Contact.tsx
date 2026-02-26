"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import {
  revealVariant,
  REVEAL_EASE,
} from "@/lib/animations";

const inputClassName =
  "w-full border border-white bg-white text-black placeholder:text-black rounded-[4px] px-5 py-[10px] text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400";

const formWrapperReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: REVEAL_EASE,
      delayChildren: 0.2,
      staggerChildren: 0.22,
    },
  },
};

const sectionViewport = { once: true, amount: 0.72 } as const;
const formSectionViewport = { once: true, amount: 0.05 } as const;

const slowRevealVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: REVEAL_EASE,
      delay,
    },
  }),
};

const slowCardReveal = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.15,
      ease: REVEAL_EASE,
      delay,
    },
  }),
};

const infoCardsStagger = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.7,
      staggerChildren: 0.7,
    },
  },
};

const Contact = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const fullName = String(formData.get("fullName") ?? "");
    const companyName = String(formData.get("companyName") ?? "").trim();
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "");

    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          companyName: companyName || undefined,
          email,
          phone: phone || undefined,
          message,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(payload?.message || "Request failed");
      }

      toast({
        title: "Message Sent",
        description: "We will respond within 1–2 business days.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error ? error.message : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="bg-[#F5F3F0] pt-[4.5rem] md:pt-[4.75rem] pb-2 px-4">
        <div className="mx-0">
          <div className="relative h-[320px] md:h-[380px] overflow-hidden rounded-[4px]">
            <Image
              src="/assets/contact-hero-containers.jpg"
              alt="Shipping containers"
              fill
              className="object-cover object-[right_center]"
              priority
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-slate-900/82 to-transparent" />

            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center">
              <div className="text-white max-w-xl">
                <motion.h1
                  variants={revealVariant}
                  initial="hidden"
                  animate="visible"
                  custom={0.1}
                  className="ml-2 text-5xl md:text-6xl font-bold leading-tight"
                >
                  Talk to Our Logistics
                  <span className="block">Experts</span>
                </motion.h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact-form-section"
        className="bg-[#F5F3F0] pt-12 pb-16 md:pt-[5.4rem] md:pb-24 scroll-mt-24 md:scroll-mt-28"
      >
        <div className="max-w-[1920px] mx-auto px-4">
          <motion.div
            variants={formWrapperReveal}
            initial="hidden"
            whileInView="visible"
            viewport={formSectionViewport}
            className="relative z-10 rounded-[4px] border border-slate-200 bg-white shadow-lg p-4 md:p-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-4 items-stretch">
              <motion.div
                variants={slowRevealVariant}
                custom={0.1}
                className="relative z-20 order-2 md:order-1 bg-[#F5F3F0] rounded-[4px] border border-[#F5F3F0] p-6 md:p-8"
              >
                <h2 className="text-2xl md:text-3xl font-semibold text-black mb-6">
                  Send a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <input
                      id="fullName"
                      name="fullName"
                      required
                      placeholder="Your Name *"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <input
                      id="companyName"
                      name="companyName"
                      placeholder="Company"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Your Email *"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Phone"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <textarea
                      id="message"
                      name="message"
                      required
                      placeholder="Type Your Message *"
                      className={`${inputClassName} min-h-[120px] resize-none`}
                    />
                    <p className="text-xs text-black mt-2">
                      We will respond within 1–2 business days.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-medium px-6 py-3 rounded-[4px] transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </motion.div>

              <motion.div
                variants={slowRevealVariant}
                custom={0.25}
                className="relative z-20 order-1 md:order-2"
              >
                <div className="relative h-full min-h-[420px] md:min-h-[620px] rounded-[4px] overflow-hidden isolate border border-slate-200/70">
                  <Image
                    src="/assets/contact-professional.jpg?v=20260225-1513"
                    alt="GIPA logistics professional"
                    width={6377}
                    height={5326}
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="w-full h-full object-cover object-[25%_center]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/35 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <h3 className="text-[1.625rem] md:text-[1.95rem] font-semibold text-white leading-tight">
                      Get in Touch with GIPA
                    </h3>
                    <p className="text-[1.15rem] font-semibold text-slate-200 mt-2 max-w-md leading-snug">
                      Reach our team for route planning, delivery support, and
                      transport coordination across the UK.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#F5F3F0]">
        <div className="max-w-[1920px] mx-auto px-4">
          <motion.div
            variants={infoCardsStagger}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            className="grid grid-cols-2 md:grid-cols-3 gap-6 items-stretch"
          >
            <motion.div
              variants={slowCardReveal}
              className="h-full min-h-[220px] bg-white rounded-[4px] p-7 md:p-8 shadow-sm border border-slate-100 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl text-center flex flex-col items-center justify-center"
            >
              <h3 className="text-base font-semibold text-slate-900 mb-3">
                Office Address
              </h3>
              <div className="text-base text-slate-600 leading-relaxed space-y-0.5">
                <p>GIPA Services Limited</p>
                <p>6 Glen Way, Oadby</p>
                <p>Leicester, LE2 5YE</p>
                <p>United Kingdom</p>
              </div>
            </motion.div>

            <motion.div
              variants={slowCardReveal}
              className="h-full min-h-[220px] bg-white rounded-[4px] p-7 md:p-8 shadow-sm border border-slate-100 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl text-center flex flex-col items-center justify-center"
            >
              <h3 className="text-base font-semibold text-slate-900 mb-3">
                Phone Number
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Phone number available upon request
              </p>
            </motion.div>

            <motion.div
              variants={slowCardReveal}
              className="h-full min-h-[220px] bg-white rounded-[4px] p-7 md:p-8 shadow-sm border border-slate-100 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl text-center flex flex-col items-center justify-center"
            >
              <h3 className="text-base font-semibold text-slate-900 mb-3">
                Email Us
              </h3>
              <div className="space-y-0.5">
                <a
                  href="mailto:info@gipaservices.com"
                  className="block text-base text-slate-600 hover:text-yellow-500 transition"
                >
                  info@gipaservices.com
                </a>
                <a
                  href="mailto:manvi@gipaservices.com"
                  className="block text-base text-slate-600 hover:text-yellow-500 transition"
                >
                  manvi@gipaservices.com
                </a>
                <a
                  href="mailto:akam@gipaservices.com"
                  className="block text-base text-slate-600 hover:text-yellow-500 transition"
                >
                  akam@gipaservices.com
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#F5F3F0] pt-[5.4rem] pb-12 md:pb-24">
        <div className="max-w-[1920px] mx-auto px-4">
          <motion.div
            variants={slowRevealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            custom={0.15}
            className="rounded-[4px] overflow-hidden shadow-lg border border-slate-200 h-[350px] md:h-[450px]"
          >
            <iframe
              title="GIPA Services Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2422.2!2d-1.0756!3d52.6002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4877612!2sOadby%2C+Leicester!5e0!3m2!1sen!2suk!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>

      <section className="bg-[#F5F3F0] pt-0 pb-12 md:pb-24">
        <div className="max-w-[1920px] mx-auto px-4">
          <motion.div
            variants={slowRevealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            custom={0.15}
            className="relative z-10 rounded-[4px] border border-slate-200 bg-white shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-0 items-stretch"
          >
            <motion.div variants={slowRevealVariant} custom={0.25} className="p-6 md:p-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
                Ready to plan your next UK delivery movement?
              </h2>
              <p className="text-base text-slate-600 mt-4 max-w-lg">
                Share your route requirements with our team and we will provide a
                practical, compliance-focused logistics response.
              </p>

              <Link
                href="#contact-form-section"
                className="mt-8 inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-medium px-6 py-3 rounded-[4px] transition duration-300"
              >
                Start Your Enquiry
              </Link>
            </motion.div>

            <motion.div
              variants={slowRevealVariant}
              custom={0.35}
              className="relative w-full h-[300px] md:h-full md:min-h-[400px] overflow-hidden"
            >
              <Image
                src="/assets/contact-truck-cta.jpg"
                alt="HGV truck"
                fill
                className="object-cover object-[center_40%]"
              />
              <div className="hidden md:block absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
