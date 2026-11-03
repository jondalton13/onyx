"use client";

import "@opal/components/progress-ring/styles.css";
import { cn } from "@opal/utils";
import { useOpalStrings } from "@opal/strings";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProgressRingColor = "blue" | "neutral" | "warning" | "error";

const STROKE_COLORS = {
  blue: "stroke-theme-blue-05",
  neutral: "stroke-text-04",
  warning: "stroke-status-warning-05",
  error: "stroke-status-error-05",
} as const satisfies Record<ProgressRingColor, string>;

// Figma Icon/Progress: a 15px ring with a 1.5px stroke in an 18px box.
const VIEWBOX = 18;
const STROKE_WIDTH = 1.5;
const RADIUS = 7.5;
const CENTER = VIEWBOX / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ProgressRingProps {
  value: number;
  /** @default 100 */
  max?: number;
  /** Arc colour; the track is the same colour, faded. @default "blue" */
  color?: ProgressRingColor;
  /** Width and height in px. The stroke scales with it. @default 18 */
  size?: number;
  /** Accessible label. Defaults to the Opal progress label. */
  "aria-label"?: string;
  /** Hide the ring from assistive technology, when visible text beside it already gives the value. */
  "aria-hidden"?: boolean;
}

// ---------------------------------------------------------------------------
// ProgressRing
// ---------------------------------------------------------------------------

/** Determinate progress ring, clockwise from the top; arc = value / max, clamped to [0, 1]. */
function ProgressRing({
  value,
  max = 100,
  color = "blue",
  size = VIEWBOX,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
}: ProgressRingProps) {
  const strings = useOpalStrings();
  const fraction = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const stroke = STROKE_COLORS[color];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      className="opal-progress-ring"
      // Report the drawn fraction as a percent, so the value stays in range.
      {...(ariaHidden
        ? { "aria-hidden": true }
        : {
            role: "progressbar",
            "aria-label": ariaLabel ?? strings.progress,
            "aria-valuenow": Math.round(fraction * 100),
            "aria-valuemin": 0,
            "aria-valuemax": 100,
          })}
    >
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="none"
        strokeWidth={STROKE_WIDTH}
        className={cn("opal-progress-ring-track", stroke)}
      />
      {/* A zero-length arc with round caps would still draw a dot. */}
      {fraction > 0 && (
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
          className={cn("opal-progress-ring-arc", stroke)}
        />
      )}
    </svg>
  );
}

export { ProgressRing, type ProgressRingProps, type ProgressRingColor };
