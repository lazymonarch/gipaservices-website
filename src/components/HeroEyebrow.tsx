import { cn } from "@/lib/utils";

interface HeroEyebrowProps {
  text: string;
  className?: string;
}

export default function HeroEyebrow({ text, className }: HeroEyebrowProps) {
  return (
    <div className={cn("mb-4 flex items-center gap-3", className)}>
      <span className="gipa-rule" aria-hidden="true" />
      <span className="gipa-eyebrow">{text}</span>
    </div>
  );
}
