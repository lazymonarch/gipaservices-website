"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Annotation,
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
} from "react-simple-maps";
import { motion, useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Geographic data:
 * Natural Earth — Admin 0 — Map units — 50m — Version 5.1.1
 * Source: https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-details/
 * Local asset: /geo/uk-nations.json (England, Scotland, Wales, Northern Ireland only)
 *
 * Capital coordinates are representative coverage anchors only — not company locations.
 */
const GEO_URL = "/geo/uk-nations.json";

type NationId = "england" | "scotland" | "wales" | "northern-ireland";

type Phase =
  | "settle"
  | NationId
  | "network"
  | "complete"
  | "reset";

const EASE: [number, number, number, number] = [0.25, 0.8, 0.25, 1];

const COLORS = {
  land: "#E8E2D9",
  landStroke: "#C8A96E",
  cityDot: "#C4B8A8",
  marker: "#F5C518",
  markerRing: "#C8A96E",
  leader: "#C8A96E",
  label: "#2C2C2C",
  network: "#F5C518",
} as const;

const MAP_WIDTH = 640;
const MAP_HEIGHT = 520;
const DESKTOP_PROJECTION = {
  center: [-3.2, 55.5] as [number, number],
  scale: 1290,
};
/** Tighter fit for mobile — callouts render outside the SVG. */
const MOBILE_PROJECTION = {
  center: [-3.2, 55.8] as [number, number],
  scale: 1340,
};
const MOBILE_MAP_WIDTH = 360;
const MOBILE_MAP_HEIGHT = 480;

const NATIONS: {
  id: NationId;
  name: string;
  coordinates: [number, number];
  dx: number;
  dy: number;
  textAnchor: "start" | "end";
}[] = [
  {
    id: "england",
    name: "England",
    coordinates: [-0.1278, 51.5074],
    dx: 52,
    dy: 8,
    textAnchor: "start",
  },
  {
    id: "scotland",
    name: "Scotland",
    coordinates: [-3.1883, 55.9533],
    dx: 48,
    dy: -28,
    textAnchor: "start",
  },
  {
    id: "wales",
    name: "Wales",
    coordinates: [-3.1791, 51.4816],
    dx: -52,
    dy: 10,
    textAnchor: "end",
  },
  {
    id: "northern-ireland",
    name: "Northern Ireland",
    coordinates: [-5.9301, 54.5973],
    dx: -58,
    dy: -18,
    textAnchor: "end",
  },
];

const MARKER_ORDER: NationId[] = [
  "england",
  "scotland",
  "wales",
  "northern-ireland",
];

/** Abstract coverage mesh — not real delivery routes. */
const NETWORK_LINKS: { from: NationId; to: NationId }[] = [
  { from: "england", to: "scotland" },
  { from: "scotland", to: "northern-ireland" },
  { from: "northern-ireland", to: "wales" },
  { from: "wales", to: "england" },
];

/** Unlabelled major-city context dots only. */
const CONTEXT_CITIES: [number, number][] = [
  [-1.8904, 52.4862], // Birmingham
  [-2.2426, 53.4808], // Manchester
  [-4.2518, 55.8642], // Glasgow
  [-1.5491, 53.8008], // Leeds
  [-2.5879, 51.4545], // Bristol
  [-1.6178, 54.9783], // Newcastle
];

const TIMING = {
  settle: 800,
  markerEntrance: 700,
  markerHold: 2200,
  northernIrelandHold: 2500,
  network: 3500,
  complete: 42900,
  reset: 1200,
} as const;

const MotionLine = motion.create(Line);

function nationById(id: NationId) {
  return NATIONS.find((n) => n.id === id)!;
}

function visibleNationIds(phase: Phase): NationId[] {
  switch (phase) {
    case "settle":
    case "reset":
      return [];
    case "england":
      return ["england"];
    case "scotland":
      return ["england", "scotland"];
    case "wales":
      return ["england", "scotland", "wales"];
    case "northern-ireland":
    case "network":
    case "complete":
      return MARKER_ORDER;
    default:
      return [];
  }
}

function networkVisible(phase: Phase) {
  return phase === "network" || phase === "complete";
}

export default function UKMap() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [phase, setPhase] = useState<Phase>(
    prefersReducedMotion ? "complete" : "settle",
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase("complete");
      return;
    }

    let cancelled = false;
    let timeoutId = 0;

    const schedule = (next: Phase, delay: number) => {
      timeoutId = window.setTimeout(() => {
        if (!cancelled) setPhase(next);
      }, delay);
    };

    if (phase === "settle") {
      schedule("england", TIMING.settle);
    } else if (phase === "england") {
      schedule("scotland", TIMING.markerEntrance + TIMING.markerHold);
    } else if (phase === "scotland") {
      schedule("wales", TIMING.markerEntrance + TIMING.markerHold);
    } else if (phase === "wales") {
      schedule(
        "northern-ireland",
        TIMING.markerEntrance + TIMING.markerHold,
      );
    } else if (phase === "northern-ireland") {
      schedule(
        "network",
        TIMING.markerEntrance + TIMING.northernIrelandHold,
      );
    } else if (phase === "network") {
      schedule("complete", TIMING.network);
    } else if (phase === "complete") {
      schedule("reset", TIMING.complete);
    } else if (phase === "reset") {
      schedule("settle", TIMING.reset);
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [phase, prefersReducedMotion]);

  const shown = useMemo(() => new Set(visibleNationIds(phase)), [phase]);
  const showNetwork = networkVisible(phase) || !!prefersReducedMotion;
  const isResetting = phase === "reset";
  const shouldPulse =
    !prefersReducedMotion && phase === "complete" && showNetwork;

  const mapWidth = isMobile ? MOBILE_MAP_WIDTH : MAP_WIDTH;
  const mapHeight = isMobile ? MOBILE_MAP_HEIGHT : MAP_HEIGHT;
  const projectionConfig = isMobile ? MOBILE_PROJECTION : DESKTOP_PROJECTION;

  const ariaLabel =
    "Map of the United Kingdom showing nationwide delivery coverage across England, Scotland, Wales and Northern Ireland";

  const overlayOpacity = isResetting ? 0 : 1;

  return (
    <div className="relative mx-auto w-full max-w-[720px]">
      <motion.div
        role="img"
        aria-label={ariaLabel}
        className="w-full"
        animate={{ opacity: prefersReducedMotion || !isResetting ? 1 : 1 }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={projectionConfig}
          width={mapWidth}
          height={mapHeight}
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          <title>United Kingdom nationwide delivery coverage</title>
          <desc>
            Geographic coverage illustration of England, Scotland, Wales and
            Northern Ireland. Markers indicate national coverage areas only and
            do not represent company offices, depots or delivery routes.
          </desc>

          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={COLORS.land}
                  stroke={COLORS.landStroke}
                  strokeWidth={1.1}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: COLORS.land },
                    pressed: { outline: "none", fill: COLORS.land },
                  }}
                />
              ))
            }
          </Geographies>

          {CONTEXT_CITIES.map((coordinates) => (
            <Marker key={coordinates.join(",")} coordinates={coordinates}>
              <circle r={1.75} fill={COLORS.cityDot} opacity={0.55} />
            </Marker>
          ))}

          <motion.g
            animate={{ opacity: overlayOpacity }}
            transition={{
              duration: prefersReducedMotion ? 0 : TIMING.reset / 1000,
              ease: EASE,
            }}
          >
            <motion.g
              animate={
                prefersReducedMotion
                  ? { opacity: 0.7 }
                  : shouldPulse
                    ? { opacity: [0.5, 0.82, 0.5] }
                    : { opacity: showNetwork ? 1 : 0 }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : shouldPulse
                    ? {
                        duration: 3.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : { duration: 0.4, ease: EASE }
              }
            >
              {NETWORK_LINKS.map((link, index) => {
                const from = nationById(link.from).coordinates;
                const to = nationById(link.to).coordinates;
                const linkDelay = prefersReducedMotion
                  ? 0
                  : (TIMING.network / 1000 / NETWORK_LINKS.length) * index;

                return (
                  <MotionLine
                    key={`${link.from}-${link.to}`}
                    from={from}
                    to={to}
                    stroke={COLORS.network}
                    strokeWidth={1.35}
                    strokeLinecap="round"
                    fill="transparent"
                    initial={
                      prefersReducedMotion
                        ? { pathLength: 1, opacity: 0.85 }
                        : { pathLength: 0, opacity: 0 }
                    }
                    animate={
                      prefersReducedMotion || showNetwork
                        ? { pathLength: 1, opacity: 0.85 }
                        : { pathLength: 0, opacity: 0 }
                    }
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : {
                            pathLength: {
                              duration:
                                TIMING.network / 1000 / NETWORK_LINKS.length,
                              delay: showNetwork ? linkDelay : 0,
                              ease: EASE,
                            },
                            opacity: {
                              duration: 0.35,
                              delay: showNetwork ? linkDelay : 0,
                              ease: EASE,
                            },
                          }
                    }
                  />
                );
              })}
            </motion.g>

            {NATIONS.map((nation) => {
              const isShown =
                prefersReducedMotion || shown.has(nation.id);
              const entrance = prefersReducedMotion
                ? { duration: 0 }
                : { duration: TIMING.markerEntrance / 1000, ease: EASE };

              return (
                <g key={nation.id}>
                  <Marker coordinates={nation.coordinates}>
                    <motion.g
                      initial={false}
                      animate={
                        isShown
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0.72 }
                      }
                      transition={entrance}
                      style={{ transformOrigin: "0px 0px" }}
                    >
                      <circle
                        r={9}
                        fill={COLORS.marker}
                        fillOpacity={0.18}
                      />
                      <circle
                        r={4.5}
                        fill={COLORS.marker}
                        stroke={COLORS.markerRing}
                        strokeWidth={1}
                      />
                    </motion.g>
                  </Marker>

                  {!isMobile && (
                    <Annotation
                      subject={nation.coordinates}
                      dx={nation.dx}
                      dy={nation.dy}
                      curve={0.15}
                      connectorProps={{
                        stroke: COLORS.leader,
                        strokeWidth: 1,
                        strokeOpacity: isShown ? 0.9 : 0,
                      }}
                    >
                      <motion.text
                        x={nation.textAnchor === "start" ? 4 : -4}
                        y={4}
                        textAnchor={nation.textAnchor}
                        fill={COLORS.label}
                        fontSize={13}
                        fontWeight={600}
                        initial={false}
                        animate={{ opacity: isShown ? 1 : 0 }}
                        transition={entrance}
                      >
                        {nation.name}
                      </motion.text>
                    </Annotation>
                  )}
                </g>
              );
            })}
          </motion.g>
        </ComposableMap>
      </motion.div>

      {isMobile && (
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 px-1 sm:px-2">
          {NATIONS.map((nation) => {
            const isShown =
              prefersReducedMotion || shown.has(nation.id);

            return (
              <li key={nation.id}>
                <motion.div
                  className="flex items-center gap-2 text-sm font-semibold text-[#2C2C2C]"
                  initial={false}
                  animate={{ opacity: isShown ? 1 : 0.2 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          duration: TIMING.markerEntrance / 1000,
                          ease: EASE,
                        }
                  }
                >
                  <span
                    className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#F5C518] ring-1 ring-[#C8A96E]"
                    aria-hidden="true"
                  />
                  {nation.name}
                </motion.div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
