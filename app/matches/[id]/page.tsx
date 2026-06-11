"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarClock, MapPin, Trophy } from "lucide-react";
import { getMatch, getScores, getPoll, getNews } from "@/lib/data";
import type { Match, NewsItem, Poll } from "@/lib/data/types";
import { useLiveData } from "@/hooks/useLiveData";
import { TeamBadge } from "@/components/ui/TeamBadge";
import { StatusBadge } from "@/components/match/StatusBadge";
import { LivePoll } from "@/components/match/LivePoll";
import { FanSupport } from "@/components/match/FanSupport";
import { kickoffLabel } from "@/lib/format";

export default function MatchDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  // Resolve from live scores first (real fixtures), then the local store.
  const match = useLiveData(
    async () => {
      const { matches } = await getScores();
      return matches.find((m) => m.id === id) ?? (await getMatch(id));
    },
    undefined,
    [id],
  );
  // A poll only exists for our own (store) matches, not live-API fixtures.
  const poll = useLiveData<Poll | undefined>(() => getPoll(id), undefined, [id]);
  const news = useLiveData(async () => (await getNews(3)), [] as NewsItem[], []);

  if (match === undefined) {
    return (
      <div className="container-page py-24">
        <div className="h-72 animate-pulse rounded-3xl bg-line/60" />
      </div>
    );
  }
  if (match === null || !match) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-3xl">Match not found</h1>
        <Link href="/matches" className="btn-ghost mt-6">
          Back to matches
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {match.posterUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={match.posterUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/90 to-navy/70" />
        </div>
        <div className="container-page relative py-12 text-white">
          <Link
            href="/matches"
            className="inline-flex items-center gap-1.5 text-base font-semibold text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All matches
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="chip bg-white/15 text-white">{match.competition}</span>
            <StatusBadge status={match.status} minute={match.minute} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 grid grid-cols-3 items-center gap-4"
          >
            <TeamSide team={match.homeTeam} align="left" />
            <div className="text-center">
              {match.score ? (
                <p className="font-display text-5xl font-extrabold tabular-nums sm:text-6xl">
                  {match.score.home}
                  <span className="mx-2 text-white/40">–</span>
                  {match.score.away}
                </p>
              ) : (
                <p className="font-display text-4xl font-extrabold text-white/70">
                  VS
                </p>
              )}
              <p className="mt-2 text-base text-white/70">
                {kickoffLabel(match.kickoff)}
              </p>
            </div>
            <TeamSide team={match.awayTeam} align="right" />
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section className="container-page grid gap-8 py-12 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-8">
          {poll ? (
            <div className="card p-6">
              <h2 className="mb-4 text-2xl">Fan poll</h2>
              <LivePoll match={match} size="lg" />
              <p className="mt-3 text-sm text-muted">
                Voting closes 24 hours before kickoff.{" "}
                <Link href="/polls" className="font-semibold text-accent-dark">
                  See all polls →
                </Link>
              </p>
            </div>
          ) : (
            <div className="card p-6">
              <h2 className="mb-2 text-2xl">Want to predict this one?</h2>
              <p className="text-lg text-muted">
                Head to{" "}
                <Link href="/polls" className="font-semibold text-accent-dark">
                  Fan Polls
                </Link>{" "}
                to back your team before kickoff.
              </p>
            </div>
          )}

          <div>
            <h2 className="mb-4 text-2xl">Fan support</h2>
            <FanSupport />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card p-6">
            <h3 className="mb-4 text-xl">Match info</h3>
            <ul className="space-y-4 text-base">
              <InfoRow icon={Trophy} label="Competition" value={match.competition} />
              <InfoRow icon={MapPin} label="Venue" value={match.venue} />
              <InfoRow
                icon={CalendarClock}
                label="Kickoff"
                value={kickoffLabel(match.kickoff)}
              />
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="mb-4 text-xl">Latest news</h3>
            <div className="space-y-3">
              {news.map((n) => (
                <Link
                  key={n.id}
                  href="/news"
                  className="group flex items-center gap-3 rounded-2xl border border-line p-2 transition-colors hover:border-accent/60"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={n.imageUrl}
                    alt={n.title}
                    className="h-14 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <span className="line-clamp-2 text-sm font-semibold text-ink group-hover:text-accent-dark">
                    {n.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}

function TeamSide({
  team,
  align,
}: {
  team: Match["homeTeam"];
  align: "left" | "right";
}) {
  return (
    <div
      className={`flex flex-col items-center gap-3 ${
        align === "left" ? "sm:items-start" : "sm:items-end"
      }`}
    >
      <TeamBadge team={team} size="xl" />
      <div className={align === "left" ? "sm:text-left text-center" : "sm:text-right text-center"}>
        <p className="font-display text-xl font-extrabold sm:text-2xl">
          {team.name}
        </p>
        <p className="text-base text-white/60">{team.shortName}</p>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent-dark">
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm text-muted">{label}</span>
        <span className="font-bold text-ink">{value}</span>
      </span>
    </li>
  );
}
