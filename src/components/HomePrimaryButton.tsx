import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type HomePrimaryButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function HomePrimaryButton({
  href,
  children,
  className,
}: HomePrimaryButtonProps) {
  return (
    <Link href={href} className={cn("gipa-btn-primary", className)}>
      {children}
      <ChevronRight className="gipa-btn-icon" aria-hidden="true" />
    </Link>
  );
}
