import { cn } from "@/lib/utils";

interface HeroEyebrowProps {
  text: string;
  className?: string;
}

export default function HeroEyebrow({ text, className }: HeroEyebrowProps) {
  return (
    <div className={cn("mb-4 flex items-center gap-3", className)}>
      <span className="h-[2px] w-8 bg-[#F5C518]" aria-hidden="true" />
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5C518]">
        {text}
      </span>
    </div>
  );
}
