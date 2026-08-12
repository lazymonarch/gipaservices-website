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
  "w-full border border-slate-300 bg-white text-black placeholder:text-slate-400 rounded-[4px] px-5 py-[10px] text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F5C518]";

const labelClassName = "mb-1.5 block text-sm font-medium text-slate-700";

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
      duration: 0.7,
      ease: REVEAL_EASE,
      delay,
    },
  }),
};

const infoCardsStagger = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.15,
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
      <section className="bg-[#F5F3F0] pt-0 pb-2 px-4">
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
        className="bg-[#F5F3F0] pt-12 pb-12 md:pt-12 md:pb-12"
      >
        <div className="max-w-[1920px] mx-auto px-4">
          <motion.div
            id="contact-form-section"
            variants={formWrapperReveal}
            initial="hidden"
            whileInView="visible"
            viewport={formSectionViewport}
            className="relative z-10 scroll-mt-20 rounded-[4px] border border-slate-200 bg-white shadow-lg p-3 md:p-4 md:max-h-[calc(100svh-5.5rem)]"
          >
            <div className="grid h-full grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-4 items-stretch md:min-h-[min(calc(24rem+0.5*(100svh-34rem)),calc(100svh-7rem))] md:max-h-full">
              <motion.div
                variants={slowRevealVariant}
                custom={0.1}
                className="relative z-20 order-2 md:order-1 flex h-full flex-col bg-[#F5F3F0] rounded-[4px] border border-[#F5F3F0] p-5 md:p-6"
              >
                <h2 className="text-2xl md:text-3xl font-semibold text-black mb-4">
                  Send a Message
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-1 flex-col space-y-4">
                  <div>
                    <label htmlFor="fullName" className={labelClassName}>
                      Your Name *
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      required
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label htmlFor="companyName" className={labelClassName}>
                      Company
                    </label>
                    <input
                      id="companyName"
                      name="companyName"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClassName}>
                      Your Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClassName}>
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className={inputClassName}
                    />
                  </div>

                  <div className="flex min-h-[100px] flex-1 flex-col">
                    <label htmlFor="message" className={labelClassName}>
                      Type Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      className={`${inputClassName} min-h-[100px] flex-1 resize-none`}
                    />
                    <p className="text-xs text-black mt-2">
                      We will respond within 1–2 business days.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-auto self-start items-center gap-2 bg-[#F5C518] hover:bg-[#F5C518]/90 text-slate-900 font-medium px-6 py-3 rounded-[4px] transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </motion.div>

              <motion.div
                variants={slowRevealVariant}
                custom={0.25}
                className="relative z-20 order-3 md:order-2 h-full min-h-[280px] md:min-h-0"
              >
                <div className="relative h-full min-h-[280px] w-full overflow-hidden rounded-xl md:min-h-full">
                  <iframe
                    title="GIPA Services Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2422.2!2d-1.0756!3d52.6002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4877612!2sOadby%2C+Leicester!5e0!3m2!1sen!2suk!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "280px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full rounded-xl"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#F5F3F0] pt-2 md:pt-4 pb-8 md:pb-10">
        <div className="max-w-[1920px] mx-auto px-4">
          <motion.div
            variants={infoCardsStagger}
            initial="hidden"
            whileInView="visible"
            viewport={sectionViewport}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto"
          >
            <motion.div
              variants={slowCardReveal}
              className="h-full min-h-[220px] bg-white rounded-[4px] p-7 md:p-8 shadow-sm border border-slate-100 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl text-center flex flex-col items-center justify-center"
            >
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-3">
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
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-3">
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
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-3">
                Email Us
              </h3>
              <div className="space-y-0.5">
                <a
                  href="mailto:info@gipaservices.com"
                  className="block text-base text-slate-600 hover:text-[#F5C518] transition"
                >
                  info@gipaservices.com
                </a>
                <a
                  href="mailto:manvi@gipaservices.com"
                  className="block text-base text-slate-600 hover:text-[#F5C518] transition"
                >
                  manvi@gipaservices.com
                </a>
                <a
                  href="mailto:akam@gipaservices.com"
                  className="block text-base text-slate-600 hover:text-[#F5C518] transition"
                >
                  akam@gipaservices.com
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#F5F3F0] pt-2 md:pt-4 pb-12 md:pb-16">
        <div className="max-w-[1920px] mx-auto px-4">
          <motion.div
            variants={slowRevealVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0.05}
            className="relative z-10 rounded-[4px] border border-slate-200 bg-white shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-0 items-stretch"
          >
            <motion.div variants={slowRevealVariant} custom={0.1} className="p-6 md:p-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
                Ready to plan your next UK delivery movement?
              </h2>
              <p className="text-base text-slate-600 mt-4 max-w-lg">
                Share your route requirements with our team and we will provide a
                practical, compliance-focused logistics response.
              </p>

              <Link
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("contact-form-section")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="mt-8 inline-flex items-center gap-2 bg-[#F5C518] hover:bg-[#F5C518]/90 text-slate-900 font-medium px-6 py-3 rounded-[4px] transition duration-300"
              >
                Start Your Enquiry
              </Link>
            </motion.div>

            <motion.div
              variants={slowRevealVariant}
              custom={0.15}
              className="relative w-full h-[300px] md:h-full md:min-h-[400px] overflow-hidden"
            >
              <Image
                src="/assets/contact-truck-cta.jpg"
                alt="HGV truck"
                fill
                className="object-cover object-center"
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
