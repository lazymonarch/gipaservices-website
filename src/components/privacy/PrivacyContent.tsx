const PrivacyContent = () => {
  const SectionHeading = ({ title }: { title: string }) => (
    <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-6">
      {title}
    </h2>
  );

  return (
    <div className="space-y-14 md:space-y-16">
      <section id="introduction" className="scroll-mt-32">
        <SectionHeading title="Introduction" />
        <div className="rounded-xl bg-white/60 border border-slate-200 p-6 space-y-4 text-sm md:text-[15px] leading-relaxed text-slate-600 font-body">
          <p>
            GIPA Services Limited (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
            &ldquo;our&rdquo;) is a private limited company registered in
            England and Wales, with its registered office at 6 Glen Way,
            Oadby, Leicester, LE2 5YE, United Kingdom. We are committed to
            collecting personal data in accordance with the UK General Data
            Protection Regulation (UK GDPR) and the Data Protection Act 2018.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, store, and
            safeguard personal information obtained through our website and
            recruitment processes. For the purposes of data protection
            legislation, GIPA Services Limited acts as the data controller in
            respect of personal data collected via this website.
          </p>
        </div>
      </section>

      <section id="data-we-collect" className="scroll-mt-32">
        <SectionHeading title="The Personal Data We Collect" />
        <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed mb-4 font-body">
          We collect professional and personal information directly from
          individuals who contact us or apply for employment opportunities.
          This information is voluntarily provided and may include:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm md:text-[15px] text-slate-600 font-body">
          {[
            "Name and residential address",
            "Email address and telephone number",
            "Driving licence information and experience details",
            "Employment history contained within submitted CVs",
            "Availability and right to work confirmation",
            "Any additional information voluntarily provided",
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed mt-4 font-body">
          We do not intentionally collect special category data unless it is
          voluntarily included within recruitment documentation.
        </p>
      </section>

      <section id="how-collected" className="scroll-mt-32">
        <SectionHeading title="How Personal Data is Collected" />
        <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed font-body">
          Personal data is collected when you submit a contact enquiry, apply
          for employment through our driver application form, upload supporting
          documentation, or communicate with us via email. Where we are
          required to collect personal data by law or under the terms of a
          potential employment arrangement and you fail to provide that data, we
          may be unable to progress your enquiry or application.
        </p>
      </section>

      <section id="lawful-basis" className="scroll-mt-32">
        <SectionHeading title="Lawful Basis for Processing" />
        <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed mb-4 font-body">
          We process personal data in accordance with Article 6 of the UK GDPR:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm md:text-[15px] text-slate-600 font-body">
          <li>
            Recruitment applications are processed on the basis of your consent
            and our legitimate interest in assessing suitability for employment.
          </li>
          <li>
            Contact enquiries are processed on the basis of our legitimate
            interest in responding to business communications.
          </li>
        </ul>
        <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed mt-4 font-body">
          Where processing is based on consent, you have the right to withdraw
          that consent at any time.
        </p>
      </section>

      <section id="how-we-use" className="scroll-mt-32">
        <SectionHeading title="How We Use Personal Data" />
        <ul className="list-disc space-y-2 pl-5 text-sm md:text-[15px] text-slate-600 font-body">
          {[
            "Responding to enquiries",
            "Assessing and processing driver applications",
            "Communicating recruitment decisions",
            "Maintaining necessary administrative records",
            "Protecting our website from misuse or malicious activity",
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed mt-4 font-body">
          We do not use personal data for marketing purposes.
        </p>
      </section>

      <section id="data-security" className="scroll-mt-32">
        <SectionHeading title="Data Security" />
        <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed mb-4 font-body">
          We implement appropriate technical and organisational measures to
          safeguard personal data against unauthorised access, alteration,
          disclosure, or loss.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm md:text-[15px] text-slate-600 font-body">
          {[
            "Encrypted HTTPS data transmission",
            "Secure cloud-based database systems",
            "Access controls limited to authorised personnel",
            "Secure document storage solutions",
            "Rate limiting and automated abuse protection",
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed mt-4 font-body">
          We maintain internal procedures to manage suspected personal data
          breaches and will notify affected individuals and regulators where
          required by law.
        </p>
      </section>

      <section id="data-retention" className="scroll-mt-32">
        <SectionHeading title="Data Retention" />
        <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed font-body">
          Personal data is retained only for as long as necessary to fulfil the
          purposes for which it was collected. Driver application data is
          retained for up to six months following submission unless employment
          is offered, after which relevant employment policies apply.
        </p>
      </section>

      <section id="your-rights" className="scroll-mt-32">
        <SectionHeading title="Your Rights" />
        <ul className="list-disc space-y-2 pl-5 text-sm md:text-[15px] text-slate-600 font-body">
          {[
            "Request access to your personal data",
            "Request correction of inaccurate data",
            "Request erasure of personal data",
            "Restrict or object to processing",
            "Withdraw consent",
            "Lodge a complaint with the ICO",
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed mt-4 font-body">
          Further information is available at{" "}
          <a
            href="https://www.ico.org.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F5C518] underline underline-offset-2 hover:text-[#F5C518]/90 transition-colors"
          >
            www.ico.org.uk
          </a>
          .
        </p>
      </section>

      <section id="changes" className="scroll-mt-32">
        <SectionHeading title="Changes to This Policy" />
        <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed font-body">
          We may update this Privacy Policy from time to time to reflect changes
          in legal, technical, or business developments. Any updates will be
          published on this page with an updated revision date.
        </p>
      </section>

      <section id="contact" className="scroll-mt-32">
        <SectionHeading title="Contact Us" />
        <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed mb-4 font-body">
          If you have any questions regarding this Privacy Policy or wish to
          exercise your data protection rights, please contact:
        </p>
        <div className="rounded-xl bg-white/60 border border-slate-200 p-6 text-sm md:text-[15px] text-slate-600 space-y-1 font-body">
          <p className="font-medium text-slate-900">GIPA Services Limited</p>
          <p>6 Glen Way, Oadby</p>
          <p>Leicester, LE2 5YE</p>
          <p>United Kingdom</p>
          <p className="mt-3">
            <a
              href="mailto:info@gipaservices.com"
              className="text-[#F5C518] underline underline-offset-2 hover:text-[#F5C518]/90 transition-colors"
            >
              info@gipaservices.com
            </a>
          </p>
        </div>
      </section>

      <p className="text-xs text-slate-500 pt-8 border-t border-slate-200 font-body">
        Last updated: 4 September 2026
      </p>
    </div>
  );
};

export default PrivacyContent;
