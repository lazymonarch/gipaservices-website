"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlowEffect } from "@/components/core/glow-effect";
import { TextMorph } from "@/components/core/text-morph";

const GIPA_GLOW_COLORS = ["#F5C518", "#E0B400", "#1C1C1C", "#C48A00"];

export type GlowSubmitButtonProps = {
  submitting: boolean;
  disabled?: boolean;
  /** Default submit label (morph source text). */
  children: string;
  submittingLabel: string;
  icon?: React.ReactNode;
  className?: string;
  type?: "submit";
};

export function GlowSubmitButton({
  submitting,
  disabled,
  children,
  submittingLabel,
  icon,
  className,
  type = "submit",
}: GlowSubmitButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const showGlow = submitting && !prefersReducedMotion;
  const label = submitting ? submittingLabel : children;

  return (
    <div className={cn("relative inline-flex", className)}>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-300",
          showGlow ? "opacity-100" : "opacity-0",
        )}
        aria-hidden="true"
      >
        {showGlow ? (
          <GlowEffect
            mode="colorShift"
            blur="medium"
            duration={4}
            colors={GIPA_GLOW_COLORS}
          />
        ) : null}
      </div>

      <button
        type={type}
        disabled={disabled ?? submitting}
        className="gipa-btn-primary relative z-10 w-full disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:shadow-none"
      >
        {prefersReducedMotion ? (
          <span>{label}</span>
        ) : (
          <TextMorph as="span">{label}</TextMorph>
        )}
        {!submitting && icon ? icon : null}
      </button>
    </div>
  );
}
