"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getScores } from "@/lib/data";
import type { Match } from "@/lib/data/types";
import { useLiveData } from "@/hooks/useLiveData";
import { TeamBadge } from "@/components/ui/TeamBadge";
import { Reveal } from "@/components/ui/Reveal";
import { kickoffLabel } from "@/lib/format";

const EMPTY = { matches: [] as Match[], live: false };

/**
 * Prominent match strip on the home page: shows the matches in play right now,
 * or — when nothing is live — the next fixtures coming up. Each card links to
 * its match centre. Powered by getScores (real fixtures when the API key is set,
 * incl. the World Cup — else demo data).
 */
export function LiveNow() {
  const { matches } = useLiveData(() => getScores(), EMPTY, []);

  const liveMatches = matches.filter((m) => m.status === "live");
  const isLive = liveMatches.length > 0;
  const shown = (
    isLive ? liveMatches : matches.filter((m) => m.status === "upcoming")
  ).slice(0, 3);

  if (shown.length === 0) return null; // nothing to show → hide the section

  return (
    <section className="container-page py-10">
      <Reveal>
        <div className="mb-6 flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-sm font-extrabold uppercase tracking-wide text-white ${
              isLive ? "bg-live" : "bg-navy"
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse-live" />
            {isLive ? "Live Now" : "Up Next"}
          </span>
          <span className="text-base text-muted">
            {isLive
              ? `${shown.length} match${shown.length > 1 ? "es" : ""} in play`
              : "Upcoming fixtures"}
          </span>
          <Link
            href="/matches"
            className="ml-auto text-sm font-bold text-accent-dark hover:underline"
          >
            All scores →
          </Link>
        </div>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((m, i) => (
          <Reveal key={m.id} delay={i * 0.08}>
            <Link
              href={`/matches/${m.id}`}
              className="group block overflow-hidden rounded-3xl bg-navy bg-pitch-gradient p-6 text-white shadow-lift transition-transform hover:-translate-y-1"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="chip bg-white/10 text-white/90">
                  {m.competition}
                </span>
                {m.status === "live" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-live/90 px-2.5 py-1 text-xs font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-live" />
                    {m.minute ? `${m.minute}'` : "LIVE"}
                  </span>
                ) : (
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/80">
                    {kickoffLabel(m.kickoff)}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <TeamSide team={m.homeTeam} />
                <span className="font-display text-3xl font-extrabold tabular-nums">
                  {m.score ? `${m.score.home}–${m.score.away}` : "VS"}
                </span>
                <TeamSide team={m.awayTeam} reverse />
              </div>

              <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-accent transition-all group-hover:gap-2">
                Match centre <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function TeamSide({
  team,
  reverse = false,
}: {
  team: Match["homeTeam"];
  reverse?: boolean;
}) {
  return (
    <div
      className={`flex flex-1 items-center gap-2.5 ${
        reverse ? "flex-row-reverse text-right" : ""
      }`}
    >
      <TeamBadge team={team} size="md" />
      <span className="font-display text-sm font-bold leading-tight">
        {team.shortName}
      </span>
    </div>
  );
}
