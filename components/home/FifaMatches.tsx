"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, ArrowUpRight } from "lucide-react";
import { getScores } from "@/lib/data";
import type { Match } from "@/lib/data/types";
import { useLiveData } from "@/hooks/useLiveData";
import { TeamBadge } from "@/components/ui/TeamBadge";
import { kickoffLabel } from "@/lib/format";

const EMPTY = { matches: [] as Match[], live: false };

const isFifa = (m: Match) => {
  const c = m.competition.toLowerCase();
  return c.includes("fifa") || c.includes("world cup");
};

/**
 * Hero-level FIFA World Cup section. Pulls the World Cup fixtures out of the
 * live scores feed (real data when the API key is set, else demo) and gives
 * them their own premium, dark "world stage" treatment.
 */
export function FifaMatches() {
  const { matches } = useLiveData(() => getScores(), EMPTY, []);
  const fifa = matches.filter(isFifa);
  // Live first, then latest results, then what's coming up.
  const order = { live: 0, finished: 1, upcoming: 2 } as const;
  const shown = [...fifa]
    .sort((a, b) => order[a.status] - order[b.status])
    .slice(0, 8);

  if (shown.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-navy py-16">
      {/* decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 400px at 85% -10%, rgba(22,224,122,0.18), transparent 60%), radial-gradient(700px 400px at 0% 110%, rgba(22,224,122,0.10), transparent 60%)",
        }}
      />

      <div className="container-page relative">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 font-display text-sm font-extrabold uppercase tracking-wide text-accent">
              <Trophy className="h-4 w-4" /> FIFA World Cup
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
              The world&apos;s stage
            </h2>
            <p className="mt-2 max-w-xl text-lg text-white/60">
              Every World Cup fixture, live as it happens — back your nation in
              the polls.
            </p>
          </div>
          <Link
            href="/matches"
            className="inline-flex items-center gap-1 font-bold text-accent transition-all hover:gap-2"
          >
            All scores <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
            >
              <Link
                href={`/matches/${m.id}`}
                className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition-all hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[0.07]"
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-bold uppercase tracking-wide text-white/50">
                    {m.competition.replace(/^FIFA World Cup\s*·?\s*/i, "") ||
                      "World Cup"}
                  </span>
                  {m.status === "live" ? (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-live px-2.5 py-1 text-xs font-bold text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-live" />
                      {m.minute ? `${m.minute}'` : "LIVE"}
                    </span>
                  ) : m.status === "finished" ? (
                    <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/70">
                      FT
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/70">
                      Upcoming
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-center gap-3">
                  <TeamRow team={m.homeTeam} score={m.score?.home} />
                  <TeamRow team={m.awayTeam} score={m.score?.away} />
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/50">
                  <span>{kickoffLabel(m.kickoff)}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-accent">
                    Details <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamRow({
  team,
  score,
}: {
  team: Match["homeTeam"];
  score?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <TeamBadge team={team} size="sm" />
      <span className="flex-1 truncate font-display text-base font-bold text-white">
        {team.name}
      </span>
      {typeof score === "number" && (
        <span className="font-display text-2xl font-extrabold tabular-nums text-white">
          {score}
        </span>
      )}
    </div>
  );
}
