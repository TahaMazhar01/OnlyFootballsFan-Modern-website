"use client";

import { motion } from "framer-motion";
import { getStandings } from "@/lib/data";
import type { GroupTable } from "@/lib/data/types";
import { useLiveData } from "@/hooks/useLiveData";
import { TeamBadge } from "@/components/ui/TeamBadge";

const EMPTY = { groups: [] as GroupTable[], live: false };

/**
 * World Cup group-stage tables. Real standings from the API when available,
 * else demo groups. `max` limits how many groups to show (for a home teaser).
 */
export function GroupStandings({ max }: { max?: number }) {
  const { groups } = useLiveData(() => getStandings(), EMPTY, []);
  const shown = max ? groups.slice(0, max) : groups;

  if (shown.length === 0) return null;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {shown.map((g, gi) => (
        <motion.div
          key={g.group}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: (gi % 3) * 0.06, duration: 0.45 }}
          className="card overflow-hidden p-4"
        >
          <h3 className="mb-3 font-display text-base font-extrabold uppercase tracking-wide text-ink">
            {g.group}
          </h3>

          {/* header */}
          <div className="grid grid-cols-[1.2rem_1fr_repeat(5,1.5rem)] items-center gap-1 px-1 pb-2 text-[10px] font-bold uppercase tracking-wide text-muted">
            <span>#</span>
            <span>Team</span>
            <span className="text-center">P</span>
            <span className="text-center">W</span>
            <span className="text-center">D</span>
            <span className="text-center">GD</span>
            <span className="text-center text-ink">Pts</span>
          </div>

          <div className="space-y-1">
            {g.table.map((r) => (
              <div
                key={r.team.id + r.position}
                className={`grid grid-cols-[1.2rem_1fr_repeat(5,1.5rem)] items-center gap-1 rounded-lg px-1 py-1.5 text-sm ${
                  r.position <= 2
                    ? "bg-accent-soft/60 ring-1 ring-accent/20"
                    : ""
                }`}
              >
                <span className="text-center text-xs font-bold tabular-nums text-muted">
                  {r.position}
                </span>
                <span className="flex min-w-0 items-center gap-2">
                  <TeamBadge team={r.team} size="sm" className="!h-6 !w-6 !rounded-md" />
                  <span className="truncate font-display text-[13px] font-bold text-ink">
                    {r.team.shortName}
                  </span>
                </span>
                <span className="text-center tabular-nums text-muted">{r.played}</span>
                <span className="text-center tabular-nums text-muted">{r.won}</span>
                <span className="text-center tabular-nums text-muted">{r.draw}</span>
                <span className="text-center tabular-nums text-muted">
                  {r.goalDifference > 0 ? `+${r.goalDifference}` : r.goalDifference}
                </span>
                <span className="text-center font-display font-extrabold tabular-nums text-ink">
                  {r.points}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
