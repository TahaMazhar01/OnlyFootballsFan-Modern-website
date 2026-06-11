import type { MatchStatus } from "@/lib/data/types";

export function StatusBadge({
  status,
  minute,
}: {
  status: MatchStatus;
  minute?: number;
}) {
  // These sit on dark match banners, so use light/solid fills for contrast.
  if (status === "live") {
    return (
      <span className="chip bg-live text-white shadow-soft">
        <span className="h-2 w-2 rounded-full bg-white animate-pulse-live" />
        LIVE {minute ? `${minute}'` : ""}
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <span className="chip bg-accent text-navy shadow-soft">Upcoming</span>
    );
  }
  return (
    <span className="chip bg-white/90 text-navy shadow-soft">Full time</span>
  );
}
