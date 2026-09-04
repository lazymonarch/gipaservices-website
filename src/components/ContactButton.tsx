import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <Link href={href} className={cn("gipa-btn-primary", className)}>
      {label}
      <ArrowRight className="gipa-btn-icon" strokeWidth={2} aria-hidden="true" />
    </Link>
  );
};

export default ContactButton;
