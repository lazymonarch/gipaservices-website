"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ContactButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

const ContactButton = ({
  href = "/contact",
  label = "Contact Us",
  className = "",
}: ContactButtonProps) => {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (!clicked) return;

    const timeoutId = window.setTimeout(() => setClicked(false), 250);
    return () => window.clearTimeout(timeoutId);
  }, [clicked]);

  return (
    <Link
      href={href}
      onClick={() => setClicked(true)}
      className={`group relative inline-flex items-center justify-center shrink-0 min-w-[10rem] whitespace-nowrap px-6 py-2.5 text-sm font-medium tracking-wide rounded-full text-slate-900 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 bg-[length:200%_100%] transition-all duration-300 ease-out hover:bg-[position:100%_0] shadow-sm hover:shadow-md hover:-translate-y-[1px] active:scale-[0.98] overflow-hidden ${className}`}
    >
      <span className="transition-all duration-300 group-hover:pr-5">
        {label}
      </span>

      <ArrowRight
        className={`absolute right-4 h-4 w-4 transition-all duration-300 ease-out ${
          clicked
            ? "translate-x-6 opacity-0" :"translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
        }`}
        strokeWidth={2}
      />
    </Link>
  );
};

export default ContactButton;
