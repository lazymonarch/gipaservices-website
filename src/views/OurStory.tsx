import Layout from "@/components/Layout";
import Image from "next/image";
import { Target, Eye, Heart, Shield, Award, Users, Handshake } from "lucide-react";

const values = [
  { icon: Heart, label: "Reliability" },
  { icon: Shield, label: "Safety" },
  { icon: Award, label: "Professionalism" },
  { icon: Handshake, label: "Long-term Partnerships" },
  { icon: Users, label: "Operational Excellence" },
];

const OurStory = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/warehouse-logistics.jpg"
            alt="Warehouse logistics operations"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-accent/80" />
        </div>
        <div className="relative container-narrow section-padding py-20 md:py-28 px-4 md:px-8">
          <h1 className="text-3xl md:text-5xl font-bold text-accent-foreground mb-4">Our Story</h1>
          <p className="text-lg text-accent-foreground/80 max-w-xl">
            Building a trusted name in UK logistics, one delivery at a time.
          </p>
        </div>
      </section>

      {/* Company Background */}
      <section className="section-padding">
        <div className="container-narrow max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">Company Background</h2>
          <p className="text-muted-foreground leading-relaxed">
            GIPA Services Limited is a UK-registered logistics company established in October 2025, providing professional HGV delivery services nationwide. Founded with a commitment to reliability and safety, we serve businesses across England, Scotland, Wales, and Northern Ireland with dedicated transport solutions.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-muted">
        <div className="container-narrow grid gap-10 md:grid-cols-2">
          <div className="p-8 rounded-lg border bg-card">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 mb-4">
              <Target className="h-5 w-5 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Deliver reliable, efficient, and professional nationwide transport solutions that meet the highest standards of safety and service excellence.
            </p>
          </div>
          <div className="p-8 rounded-lg border bg-card">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 mb-4">
              <Eye className="h-5 w-5 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              Become a trusted and recognised logistics partner across the United Kingdom, known for dependability, compliance, and long-term business relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding">
        <div className="container-narrow">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Core Values</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((v) => (
              <div key={v.label} className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
                <v.icon className="h-6 w-6 text-secondary mb-3" />
                <span className="text-sm font-semibold text-foreground">{v.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="section-padding bg-accent">
        <div className="container-narrow max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-accent-foreground mb-4">Our Commitment</h2>
          <p className="text-accent-foreground/80 leading-relaxed">
            At GIPA Services Limited, we are committed to full compliance with UK transport regulations, maintaining the highest safety standards, and building long-term partnerships with our clients. Every delivery reflects our dedication to professionalism and operational excellence.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default OurStory;
