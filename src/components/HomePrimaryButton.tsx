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
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-[4px] bg-[#F5C518] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.05em] text-[#1C1C1C] transition duration-200 hover:bg-[#E0B400] hover:shadow-[0_6px_20px_rgba(245,197,24,0.35)]",
        className,
      )}
    >
      {children}
      <ChevronRight className="h-4 w-4" />
    </Link>
  );
}
