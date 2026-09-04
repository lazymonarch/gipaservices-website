"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Layout from "@/components/Layout";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <Layout>
      <section className="flex items-center justify-center px-4 py-20 md:py-28">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="font-display text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
            404
          </h1>
          <p className="mt-4 font-body text-base leading-relaxed text-slate-600 md:text-lg">
            Oops! Page not found
          </p>
          <Link
            href="/"
            className="gipa-btn-primary mt-8"
          >
            Return to Home
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
