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
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#F5C518] px-6 py-3 font-medium text-slate-900 transition duration-300 hover:bg-[#F5C518]/90"
          >
            Return to Home
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
