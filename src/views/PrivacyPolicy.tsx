import Layout from "@/components/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[760px] px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">
            Privacy Policy
          </h1>

          <div className="bg-muted/60 border border-border rounded-lg p-6 mb-12">
            <p className="text-sm md:text-[15px] leading-7 text-muted-foreground">
              GIPA Services Limited (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
              &ldquo;our&rdquo;) is a private limited company registered in
              England and Wales, with its registered office at 6 Glen Way,
              Oadby, Leicester, LE2 5YE, United Kingdom. We are committed to
              protecting personal data in accordance with the UK General Data
              Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
            <p className="text-sm md:text-[15px] leading-7 text-muted-foreground mt-4">
              This Privacy Policy explains how we collect, use, store, and
              safeguard personal information obtained through our website and
              recruitment processes. For the purposes of data protection
              legislation, GIPA Services Limited acts as the data controller in
              respect of personal data collected via this website.
            </p>
          </div>

          <div className="space-y-14">
            <section>
              <h2 className="text-xl md:text-2xl font-semibold mb-5">
                The Personal Data We Collect
              </h2>
              <p className="text-[15px] leading-7 text-muted-foreground mb-5">
                We collect professional and personal information directly from
                individuals who contact us or apply for employment
                opportunities. This information is voluntarily provided and may
                include:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-[15px] leading-7 text-muted-foreground">
                <li>Name and residential address</li>
                <li>Email address and telephone number</li>
                <li>Driving licence information and experience details</li>
                <li>Employment history contained within submitted CVs</li>
                <li>Availability and right to work confirmation</li>
                <li>Any additional information voluntarily provided</li>
              </ul>
              <p className="text-[15px] leading-7 text-muted-foreground mt-5">
                We do not intentionally collect special category data unless it
                is voluntarily included within recruitment documentation.
              </p>
            </section>

            <section className="border-t pt-10">
              <h2 className="text-xl md:text-2xl font-semibold mb-5">
                How Personal Data Is Collected
              </h2>
              <p className="text-[15px] leading-7 text-muted-foreground">
                Personal data is collected when you submit a contact enquiry,
                apply for employment through our driver application form, upload
                supporting documentation, or communicate with us via email.
                Where we are required to collect personal data by law or under
                the terms of a potential employment arrangement and you fail to
                provide that data, we may be unable to progress your enquiry or
                application.
              </p>
            </section>

            <section className="border-t pt-10">
              <h2 className="text-xl md:text-2xl font-semibold mb-5">
                Lawful Basis for Processing
              </h2>
              <p className="text-[15px] leading-7 text-muted-foreground">
                We process personal data in accordance with Article 6 of the UK
                GDPR.
              </p>
              <ul className="list-disc pl-6 space-y-3 text-[15px] leading-7 text-muted-foreground mt-5">
                <li>
                  Recruitment applications are processed on the basis of your
                  consent and our legitimate interest in assessing suitability
                  for employment.
                </li>
                <li>
                  Contact enquiries are processed on the basis of our legitimate
                  interest in responding to business communications.
                </li>
              </ul>
              <p className="text-[15px] leading-7 text-muted-foreground mt-5">
                Where processing is based on consent, you have the right to
                withdraw that consent at any time.
              </p>
            </section>

            <section className="border-t pt-10">
              <h2 className="text-xl md:text-2xl font-semibold mb-5">
                How We Use Personal Data
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-[15px] leading-7 text-muted-foreground">
                <li>Responding to enquiries</li>
                <li>Assessing and processing driver applications</li>
                <li>Communicating recruitment decisions</li>
                <li>Maintaining necessary administrative records</li>
                <li>
                  Protecting our website from misuse or malicious activity
                </li>
              </ul>
              <p className="text-[15px] leading-7 text-muted-foreground mt-5">
                We do not use personal data for marketing purposes.
              </p>
            </section>

            <section className="border-t pt-10">
              <h2 className="text-xl md:text-2xl font-semibold mb-5">
                Data Security
              </h2>
              <p className="text-[15px] leading-7 text-muted-foreground mb-5">
                We implement appropriate technical and organisational measures to
                safeguard personal data against unauthorised access, alteration,
                disclosure, or loss.
              </p>
              <ul className="list-disc pl-6 space-y-3 text-[15px] leading-7 text-muted-foreground">
                <li>Encrypted HTTPS data transmission</li>
                <li>Secure cloud-based database systems</li>
                <li>Access controls limited to authorised personnel</li>
                <li>Secure document storage solutions</li>
                <li>Rate limiting and automated abuse protection</li>
              </ul>
              <p className="text-[15px] leading-7 text-muted-foreground mt-5">
                We maintain internal procedures to manage suspected personal data
                breaches and will notify affected individuals and regulators
                where required by law.
              </p>
            </section>

            <section className="border-t pt-10">
              <h2 className="text-xl md:text-2xl font-semibold mb-5">
                Data Retention
              </h2>
              <p className="text-[15px] leading-7 text-muted-foreground">
                Personal data is retained only for as long as necessary to
                fulfil the purposes for which it was collected. Driver
                application data is retained for up to six months following
                submission unless employment is offered, after which relevant
                employment policies apply.
              </p>
            </section>

            <section className="border-t pt-10">
              <h2 className="text-xl md:text-2xl font-semibold mb-5">
                Your Rights
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-[15px] leading-7 text-muted-foreground">
                <li>Request access to your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request erasure of personal data</li>
                <li>Restrict or object to processing</li>
                <li>Withdraw consent</li>
                <li>Lodge a complaint with the ICO</li>
              </ul>
              <p className="text-[15px] leading-7 text-muted-foreground mt-5">
                Further information is available at{" "}
                <a
                  href="https://www.ico.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  www.ico.org.uk
                </a>
                .
              </p>
            </section>

            <section className="border-t pt-10">
              <h2 className="text-xl md:text-2xl font-semibold mb-5">
                Changes to This Policy
              </h2>
              <p className="text-[15px] leading-7 text-muted-foreground">
                We may update this Privacy Policy from time to time to reflect
                changes in legal, technical, or business developments. Any
                updates will be published on this page with an updated revision
                date.
              </p>
            </section>

            <section className="border-t pt-10">
              <h2 className="text-xl md:text-2xl font-semibold mb-5">
                Contact Us
              </h2>
              <p className="text-[15px] leading-7 text-muted-foreground">
                If you have any questions regarding this Privacy Policy or wish
                to exercise your data protection rights, please contact:
              </p>
              <p className="text-[15px] leading-7 text-muted-foreground mt-4">
                <a
                  href="mailto:info@gipaservices.com"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  info@gipaservices.com
                </a>
              </p>
            </section>
          </div>

          <p className="text-xs text-muted-foreground mt-16">
            Last updated: February 2026
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
