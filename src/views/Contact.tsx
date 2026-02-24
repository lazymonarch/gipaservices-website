"use client";

import { useState, FormEvent } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

      toast({ title: "Message Sent", description: "We will respond within 1–2 business days." });
      form.reset();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-accent">
        <div className="container-narrow px-4 md:px-8">
          <h1 className="text-3xl md:text-5xl font-bold text-accent-foreground mb-3">Contact Us</h1>
          <p className="text-accent-foreground/80 text-lg">We'd love to hear from you. Get in touch today.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow grid gap-12 lg:grid-cols-2">
          {/* Form */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" name="fullName" required className="mt-1.5" placeholder="Your full name" />
              </div>
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" name="companyName" className="mt-1.5" placeholder="Your company" />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required className="mt-1.5" placeholder="you@company.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" className="mt-1.5" placeholder="+44" />
              </div>
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" name="message" required className="mt-1.5 min-h-[120px]" placeholder="How can we help?" />
              </div>
              <p className="text-xs text-muted-foreground">We will respond within 1–2 business days.</p>
              <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-6">Company Details</h2>
              <div className="space-y-5">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    <p className="font-medium text-foreground">GIPA Services Limited</p>
                    <p>6 Glen Way, Oadby</p>
                    <p>Leicester, LE2 5YE</p>
                    <p>United Kingdom</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                  <div className="text-sm space-y-1">
                    <a href="mailto:info@gipaservices.com" className="block text-muted-foreground hover:text-foreground transition-colors">info@gipaservices.com</a>
                    <a href="mailto:hr@gipaservices.com" className="block text-muted-foreground hover:text-foreground transition-colors">hr@gipaservices.com</a>
                    <a href="mailto:manvi@gipaservices.com" className="block text-muted-foreground hover:text-foreground transition-colors">manvi@gipaservices.com</a>
                    <a href="mailto:akam@gipaservices.com" className="block text-muted-foreground hover:text-foreground transition-colors">akam@gipaservices.com</a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">Phone number available upon request</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Our Location</h3>
              <div className="rounded-lg overflow-hidden border aspect-video">
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
