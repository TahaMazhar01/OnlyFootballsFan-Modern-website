import type { Team } from "@/lib/data/types";

const sizes = {
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-base",
  xl: "h-24 w-24 text-2xl",
} as const;

/**
 * Crest-style team badge. Renders the club initials on its brand color so the
 * prototype never shows a broken image. When badgeUrl is later populated (or
 * sourced from API-Football) swap to an <img>.
 */
export function TeamBadge({
  team,
  size = "md",
  className = "",
}: {
  team: Team;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const initials = team.shortName.slice(0, 3).toUpperCase();
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl font-display font-extrabold text-white shadow-soft ring-2 ring-white/40 ${sizes[size]} ${className}`}
      style={{
        background: `linear-gradient(140deg, ${team.primaryColor}, ${shade(
          team.primaryColor,
          -28,
        )})`,
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

// Darken a hex color by `amt` percent for the gradient base.
function shade(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  const num = parseInt(h.length === 3 ? h.replace(/(.)/g, "$1$1") : h, 16);
  let r = (num >> 16) + Math.round((amt / 100) * 255);
  let g = ((num >> 8) & 0xff) + Math.round((amt / 100) * 255);
  let b = (num & 0xff) + Math.round((amt / 100) * 255);
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
