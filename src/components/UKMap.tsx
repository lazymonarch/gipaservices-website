"use client";

import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Geographic data:
 * Natural Earth — Admin 0 — Map units — 50m — Version 5.1.1
 * Source: https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-details/
 * Local asset: /geo/uk-nations.json (England, Scotland, Wales, Northern Ireland only)
 */
const GEO_URL = "/geo/uk-nations.json";

type NationId = "scotland" | "wales" | "northern-ireland" | "england";
type Phase = "entrance" | NationId | "nationwide";

const COLORS = {
  inactive: "#E8E2D9",
  active: "#F5C518",
  unified: "#E8D4A0",
  stroke: "#C8A96E",
} as const;

/** Restrained corporate easing — cubic-bezier(0.25, 0.8, 0.25, 1) */
const EASE_CSS = "cubic-bezier(0.25, 0.8, 0.25, 1)";
const EASE_MOTION: [number, number, number, number] = [0.25, 0.8, 0.25, 1];

const SEQUENCE: { phase: Phase; transitionMs: number; holdMs: number }[] = [
  { phase: "entrance", transitionMs: 600, holdMs: 700 },
  { phase: "scotland", transitionMs: 400, holdMs: 900 },
  { phase: "wales", transitionMs: 400, holdMs: 900 },
  { phase: "northern-ireland", transitionMs: 400, holdMs: 900 },
  { phase: "england", transitionMs: 400, holdMs: 900 },
  { phase: "nationwide", transitionMs: 600, holdMs: 1500 },
];

const MAP_WIDTH = 300;
const MAP_HEIGHT = 460;
const PROJECTION_CONFIG = {
  center: [-3.2, 55.8] as [number, number],
  scale: 1265,
};

function nationFill(nationId: string, phase: Phase): string {
  if (phase === "entrance" || phase === "nationwide") {
    return COLORS.unified;
  }

  return nationId === phase ? COLORS.active : COLORS.inactive;
}

export default function UKMap() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("nationwide");
  const [transitionMs, setTransitionMs] = useState(600);

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase("nationwide");
      return;
    }

    let cancelled = false;
    let timeoutId = 0;

    const runStep = (index: number) => {
      if (cancelled) return;

      const step = SEQUENCE[index];
      setPhase(step.phase);
      setTransitionMs(step.transitionMs);

      timeoutId = window.setTimeout(() => {
        if (cancelled) return;

        // After the first full pass, loop from Scotland (skip re-entrance fade).
        const nextIndex = index + 1;
        if (nextIndex >= SEQUENCE.length) {
          runStep(1);
        } else {
          runStep(nextIndex);
        }
      }, step.transitionMs + step.holdMs);
    };

    runStep(0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [prefersReducedMotion]);

  const ariaLabel =
    "Map of the United Kingdom showing nationwide delivery coverage across England, Scotland, Wales and Northern Ireland";

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[360px]"
      role="img"
      aria-label={ariaLabel}
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.6, ease: EASE_MOTION }
      }
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={PROJECTION_CONFIG}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <title>United Kingdom nationwide delivery coverage</title>
        <desc>
          Geographic map of England, Scotland, Wales and Northern Ireland
          illustrating UK-wide logistics coverage. Decorative illustration only.
        </desc>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const nationId = String(geo.properties.id);
              const fill = nationFill(nationId, phase);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke={COLORS.stroke}
                  strokeWidth={1.25}
                  style={{
                    default: {
                      outline: "none",
                      transition: prefersReducedMotion
                        ? "none"
                        : `fill ${transitionMs}ms ${EASE_CSS}`,
                    },
                    hover: {
                      outline: "none",
                      fill,
                    },
                    pressed: {
                      outline: "none",
                      fill,
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </motion.div>
  );
}
