"use client";

import { useMemo } from "react";
import Layout from "@/components/Layout";
import PrivacySidebar from "@/components/privacy/PrivacySidebar";
import PrivacyContent from "@/components/privacy/PrivacyContent";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "data-we-collect", label: "Data We Collect" },
  { id: "how-collected", label: "How Data is Collected" },
  { id: "lawful-basis", label: "Lawful Basis" },
  { id: "how-we-use", label: "How We Use Data" },
  { id: "data-security", label: "Data Security" },
  { id: "data-retention", label: "Data Retention" },
  { id: "your-rights", label: "Your Rights" },
  { id: "changes", label: "Changes to Policy" },
  { id: "contact", label: "Contact Us" },
];

const PrivacyPolicy = () => {
  const sectionIds = useMemo(() => sections.map((section) => section.id), []);
  const activeId = useScrollSpy(sectionIds);

  return (
    <Layout>
      <section className="bg-[#F5F3F0] border-b border-slate-200 pt-4 pb-10 md:pt-6 md:pb-12">
        <div className="max-w-[1920px] mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-[#F5C518] font-semibold">
              Legal
            </p>
            <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
              Privacy Policy
            </h1>
            <p className="mt-5 text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed font-body">
              How GIPA Services Limited collects, uses, and protects your
              personal information in accordance with UK data protection law.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F3F0] py-10 md:py-12">
        <div className="max-w-[1920px] mx-auto px-4 md:px-6">
          <div className="flex gap-12 lg:gap-16">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-28">
                <PrivacySidebar sections={sections} activeId={activeId} />
              </div>
            </aside>

            <main className="flex-1 min-w-0 max-w-4xl">
              <PrivacyContent />
            </main>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
