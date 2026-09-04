"use client";

import { FormEvent, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { REVEAL_EASE } from "@/lib/animations";
import HeroEyebrow from "@/components/HeroEyebrow";
import { cn } from "@/lib/utils";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

const inputClassName =
  "w-full rounded-gipa border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-none outline-none ring-0 ring-offset-0 transition-colors duration-200 placeholder:text-slate-400 focus:border-gipa-yellow focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:border-gipa-yellow focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

const labelClassName = "mb-1.5 block text-sm font-medium text-slate-700";

const errorTextClassName = "mt-1.5 text-xs text-red-500";

const requiredMark = <span className="text-red-500">*</span>;

type EnquiryFields = {
  fullName: string;
  email: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof EnquiryFields, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateFullName(value: string) {
  if (value.trim().length < 2) return "Please enter your full name.";
  return "";
}

function validateEmail(value: string) {
  if (!EMAIL_PATTERN.test(value.trim())) return "Please enter a valid email.";
  return "";
}

function validateMessage(value: string) {
  if (value.trim().length < 5) return "Please enter a message.";
  return "";
}

function validateEnquiry(fields: EnquiryFields): FieldErrors {
  const next: FieldErrors = {};
  const fullName = validateFullName(fields.fullName);
  const email = validateEmail(fields.email);
  const message = validateMessage(fields.message);
  if (fullName) next.fullName = fullName;
  if (email) next.email = email;
  if (message) next.message = message;
  return next;
}

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
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const fieldClassName = (hasError: boolean) =>
    cn(inputClassName, hasError && "border-red-500");

  const handleBlur = (field: keyof EnquiryFields, value: string) => {
    const message =
      field === "fullName"
        ? validateFullName(value)
        : field === "email"
          ? validateEmail(value)
          : validateMessage(value);

    setErrors((current) => {
      const next = { ...current };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  };

  const submitEnquiry = async () => {
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const fullName = String(formData.get("fullName") ?? "");
    const companyName = String(formData.get("companyName") ?? "").trim();
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "").trim();
    const message = String(formData.get("message") ?? "");

    const nextErrors = validateEnquiry({ fullName, email, message });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitError(null);
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

      setSubmitted(true);
    } catch (error) {
      const raw = error instanceof Error ? error.message : "";
      setSubmitError(
        !raw || raw === "Failed to fetch" || raw === "Request failed" || raw === "Load failed"
          ? "Something went wrong. Please try again."
          : raw,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void submitEnquiry();
  };

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative min-h-[450px] md:min-h-[470px] flex items-center overflow-hidden">
        <Image
          src="/assets/contact-hero-port.jpg"
          alt="Shipping containers at port"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-6 md:px-12 lg:px-16">
          <motion.div
            variants={revealUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <HeroEyebrow text="CONTACT US" />
          </motion.div>
          <motion.h1
            variants={revealUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="font-display text-white max-w-[720px] text-[clamp(3.5rem,5.5vw,4.5rem)] font-bold leading-[0.94] tracking-[-0.03em]"
          >
            Get in <span className="font-display italic text-[#F5C518]">Touch</span>
            <br />
            With Our Team
          </motion.h1>
          <motion.p
            variants={revealUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-6 max-w-xl text-base leading-relaxed text-slate-200 lg:text-lg"
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
                  className="bg-white border border-slate-200 rounded-gipa p-5 flex gap-4 items-start"
                >
                  <span className="mt-0.5 shrink-0 text-[#F5C518]" aria-hidden="true">
                    <Phone className="h-5 w-5" strokeWidth={1.8} />
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
                  className="bg-white border border-slate-200 rounded-gipa p-5 flex gap-4 items-start"
                >
                  <span className="mt-0.5 shrink-0 text-[#F5C518]" aria-hidden="true">
                    <Mail className="h-5 w-5" strokeWidth={1.8} />
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
                  className="bg-white border border-slate-200 rounded-gipa p-5 flex gap-4 items-start"
                >
                  <span className="mt-0.5 shrink-0 text-[#F5C518]" aria-hidden="true">
                    <MapPin className="h-5 w-5" strokeWidth={1.8} />
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
              className="bg-white border border-slate-200 rounded-gipa shadow-sm p-7 md:p-8"
            >
              {submitted ? (
                <div role="status">
                  <HeroEyebrow text="ENQUIRY RECEIVED" />
                  <h2 className="font-display text-xl font-bold leading-tight tracking-[-0.025em] text-slate-900">
                    We&apos;ve received your enquiry
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    Thanks — we&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
              <>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Send Us an Enquiry</h2>
              <p className="text-sm text-slate-500 mb-6">
                Complete the form below and we&apos;ll get back to you within 24 hours.
              </p>
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-4"
                autoComplete="off"
                noValidate
              >
                {submitError ? (
                  <div
                    role="alert"
                    className="flex flex-col gap-3 rounded-gipa border border-red-200 bg-red-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="text-sm text-red-700">
                      {submitError === "Request failed"
                        ? "Something went wrong. Please try again."
                        : submitError}
                    </p>
                    <button
                      type="button"
                      onClick={() => void submitEnquiry()}
                      disabled={submitting}
                      className="shrink-0 text-sm font-semibold text-red-800 underline underline-offset-2 hover:text-red-900 disabled:opacity-70"
                    >
                      Try again
                    </button>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className={labelClassName}>
                      Full Name {requiredMark}
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      required
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="words"
                      placeholder="Your full name"
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? "fullName-error" : undefined}
                      onBlur={(event) => handleBlur("fullName", event.target.value)}
                      className={fieldClassName(Boolean(errors.fullName))}
                    />
                    {errors.fullName ? (
                      <p id="fullName-error" className={errorTextClassName}>
                        {errors.fullName}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="companyName" className={labelClassName}>Company Name</label>
                    <input
                      id="companyName"
                      name="companyName"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="words"
                      placeholder="Your company"
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className={labelClassName}>
                      Email Address {requiredMark}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      placeholder="your@email.com"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      onBlur={(event) => handleBlur("email", event.target.value)}
                      className={fieldClassName(Boolean(errors.email))}
                    />
                    {errors.email ? (
                      <p id="email-error" className={errorTextClassName}>
                        {errors.email}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClassName}>Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="off"
                      placeholder="+44 ..."
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className={labelClassName}>
                    Message {requiredMark}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    autoComplete="off"
                    placeholder="Tell us about your logistics requirements..."
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    onBlur={(event) => handleBlur("message", event.target.value)}
                    className={cn(fieldClassName(Boolean(errors.message)), "resize-none")}
                  />
                  {errors.message ? (
                    <p id="message-error" className={errorTextClassName}>
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="gipa-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:shadow-none"
                >
                  {submitting ? "Sending..." : (
                    <>
                      Send Enquiry
                      <ArrowRight className="gipa-btn-icon" strokeWidth={2.2} aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
              </>
              )}
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
            <span className="mb-3 text-[#F5C518]" aria-hidden="true">
              <MapPin className="h-8 w-8" strokeWidth={1.6} />
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
            className="rounded-gipa overflow-hidden border border-slate-200 shadow-sm h-[360px] md:h-[440px]"
          >
            <iframe
              title="GIPA Services Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2422.2!2d-1.0756!3d52.6002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4877612!2sOadby%2C+Leicester!5e0!3m2!1sen!2suk!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </motion.div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="bg-[#1C1C1C] pt-8 pb-12 md:pt-12 md:pb-16">
        <div className="mx-auto max-w-2xl px-6 text-center md:max-w-4xl md:px-12">
          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={0}
            className="mb-5 flex justify-center"
            aria-hidden="true"
          >
            <span className="h-[2px] w-10 bg-[#F5C518]" />
          </motion.div>
          <motion.h2
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={0.05}
            className="font-display text-[clamp(1.85rem,3.4vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#F5F3F0] lg:whitespace-nowrap"
          >
            Need Urgent Logistics Support?
          </motion.h2>
          <motion.p
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={0.12}
            className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[#F5F3F0]/60 md:text-base"
          >
            Our team is ready to respond quickly to your transport requirements.
          </motion.p>
          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={0.2}
            className="mt-7"
          >
            <a
              href="tel:+44"
              className="gipa-btn-primary"
            >
              Call Us Now
              <Phone className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
