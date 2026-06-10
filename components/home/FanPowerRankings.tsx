"use client";

import { motion } from "framer-motion";
import { Trophy, Radio } from "lucide-react";
import { getClubRankings, type ClubRanking } from "@/lib/data";
import { useLiveData } from "@/hooks/useLiveData";
import { TeamBadge } from "@/components/ui/TeamBadge";
import { compactNumber } from "@/lib/format";

const spring = { type: "spring", stiffness: 120, damping: 20 } as const;

export function FanPowerRankings() {
  const rankings = useLiveData(
    () => getClubRankings(6),
    [] as ClubRanking[],
    [],
  );
  const max = rankings[0]?.votes ?? 1;

  if (!rankings.length) {
    return <div className="card h-80 animate-pulse bg-line/40" />;
  }

  return (
    <div className="card overflow-hidden p-5 sm:p-7">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-gradient text-navy shadow-glow">
            <Trophy className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl leading-tight">Fan Power Rankings</h3>
            <p className="text-sm text-muted">
              Total votes backing each club, all polls combined
            </p>
          </div>
        </div>
        <span className="chip hidden bg-accent-soft text-accent-dark sm:inline-flex">
          <Radio className="h-3.5 w-3.5 animate-pulse-live" /> Live
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {rankings.map((r) => {
          const isTop = r.rank === 1;
          return (
            <motion.div
              key={r.team.id}
              layout
              transition={spring}
              className={`relative flex items-center gap-3 rounded-2xl border p-3 transition-shadow hover:shadow-soft sm:gap-4 sm:p-4 ${
                isTop
                  ? "border-accent/50 bg-accent-soft/50 ring-1 ring-accent/30"
                  : "border-line bg-canvas/60"
              }`}
            >
              {/* rank */}
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-display text-sm font-extrabold tabular-nums ${
                  isTop
                    ? "bg-accent-gradient text-navy shadow-glow"
                    : "bg-surface text-muted ring-1 ring-line"
                }`}
              >
                {r.rank}
              </span>

              <TeamBadge team={r.team} size="md" />

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <span className="truncate font-display text-[15px] font-bold text-ink sm:text-base">
                    {r.team.name}
                  </span>
                  <span className="shrink-0 font-display text-sm font-extrabold tabular-nums text-ink sm:text-base">
                    {compactNumber(r.votes)}
                    <span className="ml-1 text-xs font-semibold text-muted">
                      votes
                    </span>
                  </span>
                </div>
                {/* animated bar */}
                <div className="h-2.5 overflow-hidden rounded-full bg-line">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${r.team.primaryColor}, ${r.team.primaryColor}cc)`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((r.votes / max) * 100)}%` }}
                    transition={spring}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-5 text-center text-sm text-muted">
        Every vote counts — the more your club is backed, the higher it climbs.
      </p>
    </div>
  );
}
