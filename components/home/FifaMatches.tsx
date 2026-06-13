"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, ArrowUpRight, Radio, MapPin } from "lucide-react";
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

const byKickoffAsc = (a: Match, b: Match) =>
  new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime();

/**
 * Hero-level FIFA World Cup section. Pulls the World Cup fixtures out of the
 * live scores feed (real data when the API key is set, else demo) and gives
 * them their own premium, dark "world stage" treatment.
 *
 * The single most important fixture is promoted to a big "featured" card:
 *  - a LIVE match if one is in play, else
 *  - the next match about to kick off, else
 *  - the most recent result.
 * As soon as a live match ends, the next upcoming fixture automatically takes
 * its place in the spotlight.
 */
export function FifaMatches() {
  const { matches } = useLiveData(() => getScores(), EMPTY, []);
  const fifa = matches.filter(isFifa);

  // Pick the spotlight fixture: live > next upcoming > most recent finished.
  const live = fifa.filter((m) => m.status === "live").sort(byKickoffAsc);
  const upcoming = fifa
    .filter((m) => m.status === "upcoming")
    .sort(byKickoffAsc);
  const finished = fifa
    .filter((m) => m.status === "finished")
    .sort((a, b) => byKickoffAsc(b, a)); // most recent first
  const featured = live[0] ?? upcoming[0] ?? finished[0] ?? null;

  // The grid below shows everything else, live first, then results, then next up.
  const order = { live: 0, finished: 1, upcoming: 2 } as const;
  const rest = [...fifa]
    .filter((m) => m.id !== featured?.id)
    .sort((a, b) => order[a.status] - order[b.status])
    .slice(0, 6);

  if (!featured) return null;

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

        {/* ── The spotlight fixture ── */}
        <FeaturedMatch match={featured} />

        {/* ── Everything else ── */}
        {rest.length > 0 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((m, i) => (
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
        )}
      </div>
    </section>
  );
}

/* ───────────────────────── Featured (king) card ───────────────────────── */

function FeaturedMatch({ match: m }: { match: Match }) {
  const isLive = m.status === "live";
  const isFinished = m.status === "finished";
  const stage =
    m.competition.replace(/^FIFA World Cup\s*·?\s*/i, "").trim() ||
    "World Cup";

  const cta = isLive
    ? "Watch it live"
    : isFinished
      ? "See the result"
      : "Preview & vote";

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55 }}
    >
      <Link
        href={`/matches/${m.id}`}
        className={`group relative block overflow-hidden rounded-[2rem] border p-6 transition-all sm:p-9 lg:p-10 ${
          isLive
            ? "border-live/40 bg-gradient-to-br from-live/[0.12] via-white/[0.04] to-white/[0.02]"
            : "border-accent/30 bg-gradient-to-br from-accent/[0.10] via-white/[0.04] to-white/[0.02]"
        }`}
        style={{
          boxShadow: isLive
            ? "0 0 70px -18px rgba(239,68,68,0.55)"
            : "0 0 70px -20px rgba(22,224,122,0.45)",
        }}
      >
        {/* glow accents */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background: isLive
              ? "radial-gradient(600px 240px at 50% -20%, rgba(239,68,68,0.22), transparent 65%)"
              : "radial-gradient(600px 240px at 50% -20%, rgba(22,224,122,0.20), transparent 65%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full blur-3xl"
          style={{
            background: isLive
              ? "rgba(239,68,68,0.18)"
              : "rgba(22,224,122,0.16)",
          }}
        />

        <div className="relative">
          {/* Top bar: status + stage */}
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <StatusBadge match={m} />
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/55">
              <Trophy className="h-3.5 w-3.5 text-accent" /> {stage}
            </span>
          </div>

          {/* Teams + score */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-6">
            <TeamPole team={m.homeTeam} />

            <div className="flex min-w-0 flex-col items-center gap-2 px-0.5">
              {m.score && (isLive || isFinished) ? (
                <div className="flex items-center gap-3 font-display text-4xl font-extrabold tabular-nums text-white sm:gap-5 sm:text-6xl">
                  <span>{m.score.home}</span>
                  <span className="text-white/30">:</span>
                  <span>{m.score.away}</span>
                </div>
              ) : (
                <span className="font-display text-3xl font-extrabold uppercase tracking-wide text-white/35 sm:text-5xl">
                  vs
                </span>
              )}

              {m.status === "upcoming" ? (
                <Countdown iso={m.kickoff} />
              ) : (
                <span
                  className={`mt-1 text-xs font-bold uppercase tracking-wide ${
                    isLive ? "text-live" : "text-white/50"
                  }`}
                >
                  {isLive
                    ? m.minute
                      ? `${m.minute}' in play`
                      : "In play"
                    : "Full time"}
                </span>
              )}
            </div>

            <TeamPole team={m.awayTeam} align="right" />
          </div>

          {/* Footer: kickoff / venue + CTA */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/55">
              <span className="font-semibold text-white/70">
                {kickoffLabel(m.kickoff)}
              </span>
              {m.venue && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {m.venue}
                </span>
              )}
            </div>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-sm font-bold transition-all group-hover:gap-3 ${
                isLive
                  ? "bg-live text-white"
                  : "bg-accent-gradient text-navy shadow-glow"
              }`}
            >
              {isLive && <Radio className="h-4 w-4" />}
              {cta} <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function StatusBadge({ match: m }: { match: Match }) {
  if (m.status === "live") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-live px-4 py-1.5 font-display text-sm font-extrabold uppercase tracking-wide text-white shadow-[0_0_20px_-2px_rgba(239,68,68,0.7)]">
        <span className="h-2 w-2 rounded-full bg-white animate-pulse-live" />
        Live now
      </span>
    );
  }
  if (m.status === "finished") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-display text-sm font-extrabold uppercase tracking-wide text-white/75">
        Full time
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 font-display text-sm font-extrabold uppercase tracking-wide text-accent">
      <span className="h-2 w-2 rounded-full bg-accent animate-pulse-live" />
      Up next
    </span>
  );
}

function TeamPole({
  team,
  align = "left",
}: {
  team: Match["homeTeam"];
  align?: "left" | "right";
}) {
  return (
    <div
      className={`flex min-w-0 flex-col items-center gap-2 sm:gap-4 ${
        align === "right" ? "sm:flex-row-reverse" : "sm:flex-row"
      }`}
    >
      <TeamBadge
        team={team}
        size="md"
        className="!h-14 !w-14 sm:!h-24 sm:!w-24"
      />
      <span
        className={`min-w-0 break-words text-center font-display text-sm font-extrabold leading-tight text-white sm:text-2xl ${
          align === "right" ? "sm:text-right" : "sm:text-left"
        }`}
      >
        {team.name}
      </span>
    </div>
  );
}

/** Live ticking countdown to kickoff. Shows a static label until mounted to
 *  avoid a server/client hydration mismatch. */
function Countdown({ iso }: { iso: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  if (now === null) {
    return (
      <span className="mt-1 text-xs font-bold uppercase tracking-wide text-accent">
        Kicks off soon
      </span>
    );
  }

  const diff = new Date(iso).getTime() - now;
  if (diff <= 0) {
    return (
      <span className="mt-1 text-xs font-bold uppercase tracking-wide text-live">
        Kicking off…
      </span>
    );
  }

  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const min = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  const parts: [number, string][] =
    d > 0
      ? [
          [d, "d"],
          [h, "h"],
          [min, "m"],
        ]
      : [
          [h, "h"],
          [min, "m"],
          [s, "s"],
        ];

  return (
    <div className="mt-1 flex items-center gap-1.5">
      {parts.map(([v, label]) => (
        <span
          key={label}
          className="inline-flex min-w-[2rem] flex-col items-center rounded-lg border border-accent/25 bg-accent/10 px-1.5 py-1 sm:min-w-[2.4rem] sm:px-2"
        >
          <span className="font-display text-base font-extrabold tabular-nums leading-none text-white sm:text-lg">
            {String(v).padStart(2, "0")}
          </span>
          <span className="text-[0.6rem] font-bold uppercase text-accent">
            {label}
          </span>
        </span>
      ))}
    </div>
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
