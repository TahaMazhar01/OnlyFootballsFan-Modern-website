"use client";

import { getMatches, getPolls, pollState } from "@/lib/data";
import type { Match, Poll } from "@/lib/data/types";
import { useLiveData } from "@/hooks/useLiveData";
import { LivePoll } from "@/components/match/LivePoll";
import { PageHeader } from "@/components/ui/PageHeader";
import { staggerContainer, staggerItem } from "@/components/ui/Reveal";
import { motion } from "framer-motion";
import { kickoffLabel } from "@/lib/format";
import { Lock, Radio, Clock } from "lucide-react";

export default function PollsPage() {
  const matches = useLiveData(() => getMatches(), [] as Match[], []);
  const polls = useLiveData(() => getPolls(), [] as Poll[], []);

  const pollByMatch = new Map(polls.map((p) => [p.matchId, p]));
  const withPoll = matches
    .map((m) => ({ match: m, poll: pollByMatch.get(m.id) }))
    .filter((x): x is { match: Match; poll: Poll } => Boolean(x.poll))
    .sort(
      (a, b) =>
        new Date(a.match.kickoff).getTime() -
        new Date(b.match.kickoff).getTime(),
    );

  const open = withPoll.filter((x) => pollState(x.poll) === "open");
  const upcoming = withPoll.filter((x) => pollState(x.poll) === "upcoming");
  const closed = withPoll.filter((x) => pollState(x.poll) === "closed");

  return (
    <>
      <PageHeader
        eyebrow="Have your say"
        title="Fan Polls"
        subtitle="Back your team before kickoff. Each poll opens early and closes 24 hours before the match — get your prediction in on time."
      />

      <section className="container-page space-y-12 py-12">
        <PollGroup
          icon={<Radio className="h-4 w-4 animate-pulse-live" />}
          label="Open for voting"
          tone="bg-accent-soft text-accent-dark ring-accent/30"
          items={open}
          empty="No open polls right now — check the upcoming ones below."
        />
        {upcoming.length > 0 && (
          <PollGroup
            icon={<Clock className="h-4 w-4" />}
            label="Upcoming polls"
            tone="bg-navy/10 text-navy ring-navy/20"
            items={upcoming}
          />
        )}
        {closed.length > 0 && (
          <PollGroup
            icon={<Lock className="h-4 w-4" />}
            label="Closed — results"
            tone="bg-line text-muted ring-line"
            items={closed}
          />
        )}
      </section>
    </>
  );
}

function PollGroup({
  icon,
  label,
  tone,
  items,
  empty,
}: {
  icon: React.ReactNode;
  label: string;
  tone: string;
  items: { match: Match; poll: Poll }[];
  empty?: string;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <span className={`chip ring-1 ${tone}`}>
          {icon} {label}
        </span>
        <span className="text-sm font-semibold text-muted">{items.length}</span>
      </div>

      {items.length === 0 ? (
        empty ? (
          <div className="rounded-3xl border border-dashed border-line bg-surface p-12 text-center text-lg text-muted">
            {empty}
          </div>
        ) : null
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-6 lg:grid-cols-2"
        >
          {items.map(({ match }) => (
            <motion.div key={match.id} variants={staggerItem} className="card p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="chip bg-navy/10 text-navy">
                  {match.competition}
                </span>
                <span className="text-sm font-semibold text-muted">
                  {kickoffLabel(match.kickoff)}
                </span>
              </div>
              <h3 className="mb-4 font-display text-xl font-bold">
                {match.homeTeam.name}{" "}
                <span className="text-muted">vs</span> {match.awayTeam.name}
              </h3>
              <LivePoll match={match} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
