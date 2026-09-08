import { mediaUrl } from "@/lib/media";

const VIEW_W = 511;
const VIEW_H = 781;

const POINTS = {
  england: { x: 330, y: 510 },
  scotland: { x: 248, y: 228 },
  wales: { x: 210, y: 575 },
  "northern-ireland": { x: 72, y: 378 },
} as const;

type NationId = keyof typeof POINTS;

const LABELS: {
  id: NationId;
  name: string;
  x: number;
  y: number;
  textAnchor: "start" | "end";
}[] = [
  { id: "england", name: "England", x: 452, y: 498, textAnchor: "start" },
  { id: "scotland", name: "Scotland", x: 334, y: 148, textAnchor: "start" },
  { id: "wales", name: "Wales", x: 138, y: 652, textAnchor: "end" },
  {
    id: "northern-ireland",
    name: "Northern Ireland",
    x: 18,
    y: 368,
    textAnchor: "end",
  },
];

/** Hub-and-spoke from England. Paths run England → destination so dashes travel outward. */
const SPOKES: { id: string; d: string }[] = [
  {
    id: "scotland",
    d: `M ${POINTS.england.x} ${POINTS.england.y} Q 392 355 ${POINTS.scotland.x} ${POINTS.scotland.y}`,
  },
  {
    id: "wales",
    d: `M ${POINTS.england.x} ${POINTS.england.y} Q 236 500 ${POINTS.wales.x} ${POINTS.wales.y}`,
  },
  {
    id: "northern-ireland",
    d: `M ${POINTS.england.x} ${POINTS.england.y} Q 148 432 ${POINTS["northern-ireland"].x} ${POINTS["northern-ireland"].y}`,
  },
];

const MARKER = "#F5C518";
const MARKER_RING = "#C8A96E";
const LABEL = "#1C1C1C";
const SPOKE = "#C48A00";

export default function UKMap() {
  return (
    <div
      className="relative mx-auto w-full min-w-0 max-w-[16.75rem] sm:max-w-[18rem] lg:mx-0 lg:ml-auto lg:mr-16 lg:h-[40rem] lg:w-auto lg:max-w-full"
      style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
    >
      <div className="relative h-full w-full">
        <img
          src={mediaUrl("ukMap")}
          alt=""
          width={VIEW_W}
          height={VIEW_H}
          className="absolute inset-0 h-full w-full object-contain object-center"
          decoding="async"
        />
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          role="img"
          aria-label="Map of the United Kingdom showing nationwide delivery coverage across England, Scotland, Wales and Northern Ireland"
        >
          <title>United Kingdom nationwide delivery coverage</title>
          <desc>
            Geographic coverage illustration of England, Scotland, Wales and
            Northern Ireland. Markers indicate national coverage areas only and
            do not represent company offices, depots or delivery routes.
          </desc>

          <g
            fill="none"
            stroke={SPOKE}
            strokeWidth={2.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {SPOKES.map((spoke) => (
              <path
                key={spoke.id}
                d={spoke.d}
                className="coverage-spoke"
                strokeDasharray="8 11"
              />
            ))}
          </g>

          {LABELS.map((label) => {
            const origin = POINTS[label.id];
            const leaderX =
              label.textAnchor === "start" ? label.x - 8 : label.x + 8;
            const leaderY = label.y - 5;
            return (
              <g key={label.id}>
                <line
                  x1={origin.x}
                  y1={origin.y}
                  x2={leaderX}
                  y2={leaderY}
                  stroke={LABEL}
                  strokeWidth={1}
                  strokeOpacity={0.4}
                  strokeLinecap="round"
                />
                <circle
                  cx={origin.x}
                  cy={origin.y}
                  r={9}
                  fill={MARKER}
                  fillOpacity={0.18}
                />
                <circle
                  cx={origin.x}
                  cy={origin.y}
                  r={4.5}
                  fill={MARKER}
                  stroke={MARKER_RING}
                  strokeWidth={1}
                />
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor={label.textAnchor}
                  fill={LABEL}
                  fontSize={16}
                  fontWeight={600}
                  fontFamily="DM Sans, sans-serif"
                >
                  {label.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
