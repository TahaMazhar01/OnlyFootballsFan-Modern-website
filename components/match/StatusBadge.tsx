import type { MatchStatus } from "@/lib/data/types";

export function StatusBadge({
  status,
  minute,
}: {
  status: MatchStatus;
  minute?: number;
}) {
  if (status === "live") {
    return (
      <span className="chip bg-live/10 text-live ring-1 ring-live/30">
        <span className="live-dot" />
        LIVE {minute ? `${minute}'` : ""}
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <span className="chip bg-navy/10 text-navy">Upcoming</span>
    );
  }
  return <span className="chip bg-line text-muted">Full time</span>;
}
