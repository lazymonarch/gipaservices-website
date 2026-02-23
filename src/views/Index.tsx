import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Truck, Shield, Clock, Users, MapPin, Star, ArrowRight, Package, Handshake } from "lucide-react";
import Layout from "@/components/Layout";

const services = [
  { icon: Truck, title: "Nationwide HGV Delivery", desc: "Full-load and part-load transport services across the entire United Kingdom." },
  { icon: Shield, title: "Secure Goods Transportation", desc: "Safe handling and secure transit of your freight with full compliance." },
  { icon: Clock, title: "Timely Scheduled Deliveries", desc: "Punctual and reliable delivery schedules tailored to your requirements." },
  { icon: Handshake, title: "Long-term Logistics Partnerships", desc: "Dedicated transport solutions for ongoing business relationships." },
];

const reasons = [
  { icon: MapPin, title: "Nationwide Coverage", desc: "Operating across England, Scotland, Wales, and Northern Ireland." },
  { icon: Shield, title: "Safety & Compliance Focus", desc: "Strict adherence to UK transport regulations and safety standards." },
  { icon: Users, title: "Professional Drivers", desc: "Experienced, fully licensed HGV drivers committed to excellence." },
  { icon: Clock, title: "Reliable Scheduling", desc: "On-time performance you can depend on for every delivery." },
];

const reviews = [
  { text: "Reliable and timely delivery support. GIPA has been instrumental in keeping our supply chain running smoothly.", author: "Transport Manager, Midlands" },
  { text: "Highly dependable transport company. Their professionalism and consistency set them apart.", author: "Logistics Coordinator, London" },
  { text: "Excellent safety and coordination standards. We trust GIPA with our most critical shipments.", author: "Operations Director, Scotland" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/hero-truck.jpg"
            alt="HGV truck on UK motorway"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-accent/75" />
        </div>
        <div className="relative container-narrow section-padding py-24 md:py-36 px-4 md:px-8">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold text-accent-foreground leading-tight mb-4">
              Reliable Nationwide HGV Logistics Across the United Kingdom
            </h1>
            <p className="text-lg md:text-xl text-accent-foreground/80 mb-8 leading-relaxed">
              Delivering safe, efficient, and professional transport services UK-wide.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  Contact Us
                </Button>
              </Link>
              <Link href="/driver-application">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-accent-foreground/30 bg-transparent text-accent-foreground hover:bg-accent-foreground/10 hover:text-accent-foreground"
                >
                  Apply as Driver
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Our Services</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Comprehensive HGV logistics solutions designed to meet the demands of UK businesses.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <div key={s.title} className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <s.icon className="h-8 w-8 text-secondary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose GIPA */}
      <section className="section-padding bg-muted">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Why Choose GIPA</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title} className="text-center p-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 mb-4">
                  <r.icon className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{r.title}</h3>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UK Coverage */}
      <section className="section-padding">
        <div className="container-narrow text-center">
          <Package className="h-10 w-10 text-secondary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">UK-Wide Coverage</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            We provide reliable HGV transport services across England, Scotland, Wales, and Northern Ireland — delivering wherever your business needs us.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {["England", "Scotland", "Wales", "Northern Ireland"].map((region) => (
              <span key={region} className="px-4 py-2 bg-card border rounded-full text-foreground font-medium">
                {region}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Client Statement */}
      <section className="section-padding bg-accent">
        <div className="container-narrow text-center">
          <blockquote className="text-lg md:text-xl text-accent-foreground/90 leading-relaxed max-w-3xl mx-auto italic">
            "GIPA Services Limited provides nationwide HGV logistics and transport services across the United Kingdom. Clients may contact us directly to discuss their delivery and logistics requirements."
          </blockquote>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">What Our Clients Say</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((review, i) => (
              <div key={i} className="p-6 rounded-lg border bg-card">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{review.text}"</p>
                <p className="text-xs font-medium text-foreground">— {review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-secondary">
        <div className="container-narrow text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-foreground mb-4">
            Looking for a Reliable UK Logistics Partner?
          </h2>
          <p className="text-secondary-foreground/80 mb-8 max-w-xl mx-auto">
            Get in touch to discuss your transport and delivery requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/driver-application">
              <Button
                size="lg"
                variant="outline"
                className="border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
              >
                Driver Application
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
