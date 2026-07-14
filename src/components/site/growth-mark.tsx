interface GrowthMarkProps {
  className?: string;
  animate?: boolean;
}

/**
 * The page's signature element: a single continuous line forming a sprouting
 * leaf/tendril (echoing "Verdant" — lush, growing, alive), crossed by one
 * precise straight diagonal line (the laser). Organic curve + clinical
 * precision in one mark — literal to both the name and the specialty,
 * rather than a generic decorative flourish.
 */
export function GrowthMark({ className = "", animate = true }: GrowthMarkProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`${className} ${animate ? "grow-in" : ""}`}
      fill="none"
      aria-hidden="true"
    >
      {/* stem */}
      <path
        d="M100 180 C100 140, 96 100, 100 60"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* left leaf */}
      <path
        d="M100 130 C70 125, 50 105, 45 75 C80 78, 98 100, 100 130 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* right leaf */}
      <path
        d="M100 95 C130 90, 150 68, 154 40 C120 44, 102 66, 100 95 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* bud */}
      <circle cx="100" cy="58" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
      {/* laser line — precise, straight, crossing the organic form */}
      <line
        x1="20"
        y1="150"
        x2="180"
        y2="50"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.35"
        strokeDasharray="1 4"
      />
    </svg>
  );
}
