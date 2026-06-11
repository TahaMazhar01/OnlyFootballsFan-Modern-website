"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Match } from "@/lib/data/types";
import { TeamBadge } from "@/components/ui/TeamBadge";
import { StatusBadge } from "./StatusBadge";
import { kickoffLabel } from "@/lib/format";

export function MatchCard({ match }: { match: Match }) {
  const { homeTeam, awayTeam, status, score } = match;
  const showScore = status === "live" || status === "finished";

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="card group flex flex-col overflow-hidden"
    >
      {/* Banner */}
      <div className="relative h-36 overflow-hidden">
        {match.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={match.posterUrl}
            alt={`${homeTeam.name} vs ${awayTeam.name}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-navy" />
        )}
        {/* team-coloured diagonal tint (home → away) */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(125deg, ${homeTeam.primaryColor}66 0%, transparent 42%, ${awayTeam.primaryColor}66 100%)`,
          }}
        />
        {/* cinematic navy grade so badges + score pop */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/10" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span className="chip bg-white/90 text-navy">{match.competition}</span>
          <StatusBadge status={status} minute={match.minute} />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4">
          <Team align="left" badge={<TeamBadge team={homeTeam} size="md" />} name={homeTeam.shortName} />
          {showScore && score ? (
            <span className="rounded-xl bg-white/95 px-3 py-1 font-display text-2xl font-extrabold tabular-nums text-navy shadow-soft">
              {score.home}–{score.away}
            </span>
          ) : (
            <span className="font-display text-lg font-extrabold text-white/90">VS</span>
          )}
          <Team align="right" badge={<TeamBadge team={awayTeam} size="md" />} name={awayTeam.shortName} />
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between gap-2 px-5 pt-4 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4" /> {match.venue}
        </span>
        <span className="font-semibold text-ink">{kickoffLabel(match.kickoff)}</span>
      </div>

      {/* Footer link */}
      <div className="flex items-center justify-between px-5 pb-5 pt-3">
        <Link
          href={`/matches/${match.id}`}
          className="inline-flex items-center gap-1 text-[15px] font-bold text-accent-dark hover:gap-2 transition-all"
        >
          Match centre <ArrowUpRight className="h-4 w-4" />
        </Link>
        {status === "upcoming" && (
          <Link
            href="/polls"
            className="text-sm font-semibold text-muted hover:text-accent-dark"
          >
            Vote in poll →
          </Link>
        )}
      </div>
    </motion.article>
  );
}

function Team({
  badge,
  name,
  align,
}: {
  badge: React.ReactNode;
  name: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={`flex flex-1 items-center gap-2 ${
        align === "right" ? "flex-row-reverse text-right" : ""
      }`}
    >
      {badge}
      <span className="font-display text-sm font-extrabold text-white drop-shadow">
        {name}
      </span>
    </div>
  );
}
