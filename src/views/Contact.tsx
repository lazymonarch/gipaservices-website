"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { REVEAL_EASE } from "@/lib/animations";

const inputClassName =
  "w-full border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-[4px] px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F5C518]";

const labelClassName = "mb-1.5 block text-sm font-medium text-slate-700";

const revealUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: REVEAL_EASE, delay },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { delayChildren: 0.1, staggerChildren: 0.12 } },
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
      {/* ── Hero ── */}
      <section className="relative h-[260px] md:h-[320px] overflow-hidden">
        <Image
          src="/assets/contact-hero-containers.jpg"
          alt="Shipping containers at port"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center pt-8">
          <motion.p
            variants={revealUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="text-xs font-semibold tracking-widest text-[#F5C518] uppercase mb-3"
          >
            Contact Us
          </motion.p>
          <motion.h1
            variants={revealUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-4xl md:text-5xl font-bold text-white leading-tight"
          >
            Get in Touch
            <span className="block">With Our Team</span>
          </motion.h1>
          <motion.p
            variants={revealUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-3 text-slate-300 text-base max-w-md"
          >
            We&apos;re ready to discuss your logistics requirements.
          </motion.p>
        </div>
      </section>

      {/* ── How to Reach Us + Form ── */}
      <section className="bg-[#F5F3F0] py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-10 md:gap-14 items-start">

            {/* Left: info cards */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.h2
                variants={revealUp}
                custom={0}
                className="text-2xl md:text-3xl font-bold text-slate-900 mb-7"
              >
                How to Reach Us
              </motion.h2>

              <div className="flex flex-col gap-4">
                {/* Call Us */}
                <motion.div
                  variants={revealUp}
                  custom={0.05}
                  className="bg-white border border-slate-200 rounded-[4px] p-5 flex gap-4 items-start"
                >
                  <span className="mt-0.5 shrink-0 text-[#F5C518]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.08 6.08l.99-.99a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm mb-1">Call Us</p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Our team is available Monday to Friday,<br />
                      8am–6pm. We aim to respond to all calls promptly.
                    </p>
                  </div>
                </motion.div>

                {/* Email Us */}
                <motion.div
                  variants={revealUp}
                  custom={0.1}
                  className="bg-white border border-slate-200 rounded-[4px] p-5 flex gap-4 items-start"
                >
                  <span className="mt-0.5 shrink-0 text-[#F5C518]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm mb-1">Email Us</p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Send us your enquiry and we&apos;ll respond<br />
                      within 24 hours on business days.
                    </p>
                  </div>
                </motion.div>

                {/* Our Location */}
                <motion.div
                  variants={revealUp}
                  custom={0.15}
                  className="bg-white border border-slate-200 rounded-[4px] p-5 flex gap-4 items-start"
                >
                  <span className="mt-0.5 shrink-0 text-[#F5C518]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm mb-1">Our Location</p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Registered in England &amp; Wales. Operating<br />
                      nationwide across the United Kingdom.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div
              variants={revealUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              custom={0.1}
              className="bg-white border border-slate-200 rounded-[4px] shadow-sm p-7 md:p-8"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-1">Send Us an Enquiry</h2>
              <p className="text-sm text-slate-500 mb-6">
                Complete the form below and we&apos;ll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className={labelClassName}>Full Name</label>
                    <input
                      id="fullName"
                      name="fullName"
                      required
                      placeholder="Your full name"
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label htmlFor="companyName" className={labelClassName}>Company Name</label>
                    <input
                      id="companyName"
                      name="companyName"
                      placeholder="Your company"
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className={labelClassName}>Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClassName}>Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+44 ..."
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className={labelClassName}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us about your logistics requirements..."
                    className={`${inputClassName} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-[#e6b800] text-slate-900 font-semibold text-sm tracking-widest uppercase px-6 py-3 rounded-[4px] transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending..." : (
                    <>
                      Send Enquiry
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Map / Location Section ── */}
      <section className="bg-[#ECEAE6] py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0}
            className="flex flex-col items-center text-center mb-8"
          >
            <span className="text-[#F5C518] mb-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </span>
            <h2 className="text-2xl font-bold text-slate-900">Our Location</h2>
            <p className="text-slate-500 text-sm mt-1">United Kingdom</p>
          </motion.div>

          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            custom={0.1}
            className="rounded-[4px] overflow-hidden border border-slate-200 shadow-sm h-[360px] md:h-[440px]"
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
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="bg-[#3A3A3A] py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <motion.h2
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0}
            className="text-3xl md:text-5xl font-bold text-white leading-tight"
          >
            Need Urgent Logistics Support?
          </motion.h2>
          <motion.p
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0.1}
            className="mt-4 text-slate-300 text-base"
          >
            Our team is ready to respond quickly to your transport requirements.
          </motion.p>
          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0.2}
            className="mt-8"
          >
            <a
              href="tel:+44"
              className="inline-flex items-center gap-2 border-2 border-[#F5C518] text-white hover:bg-[#F5C518] hover:text-slate-900 font-semibold text-sm tracking-widest uppercase px-8 py-3.5 rounded-[4px] transition duration-200"
            >
              Call Us Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.08 6.08l.99-.99a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
