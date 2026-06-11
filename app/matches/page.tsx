"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import { getScores } from "@/lib/data";
import type { Match, MatchStatus } from "@/lib/data/types";
import { useLiveData } from "@/hooks/useLiveData";
import { MatchCard } from "@/components/match/MatchCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { staggerContainer, staggerItem } from "@/components/ui/Reveal";

type Filter = "all" | MatchStatus;
const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "upcoming", label: "Upcoming" },
  { key: "finished", label: "Finished" },
];

const EMPTY = { matches: [] as Match[], live: false };

export default function ScoresPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const data = useLiveData(() => getScores(), EMPTY, []);
  const { matches, live } = data;

  const liveCount = matches.filter((m) => m.status === "live").length;
  const shown =
    filter === "all" ? matches : matches.filter((m) => m.status === filter);

  return (
    <>
      <PageHeader
        eyebrow="Matchday Centre"
        title="Live Scores"
        subtitle="Real-time scores and upcoming fixtures, updated as the action happens."
      >
        <div className="mb-5">
          <span
            className={`chip ring-1 ${
              live
                ? "bg-live/10 text-live ring-live/30"
                : "bg-accent-soft text-accent-dark ring-accent/30"
            }`}
          >
            <Radio className="h-3.5 w-3.5 animate-pulse-live" />
            {live ? "Live data" : "Demo data — connect API for live scores"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`relative rounded-full px-5 py-2.5 text-base font-bold transition-colors ${
                filter === f.key
                  ? "text-white"
                  : "border border-line bg-surface text-ink hover:border-accent"
              }`}
            >
              {filter === f.key && (
                <motion.span
                  layoutId="score-filter"
                  className="absolute inset-0 -z-10 rounded-full bg-navy"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {f.label}
              {f.key === "live" && liveCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-live/15 px-2 py-0.5 text-xs text-live">
                  <span className="live-dot" /> {liveCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </PageHeader>

      <section className="container-page py-14">
        {shown.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line bg-surface p-16 text-center">
            <p className="font-display text-2xl font-bold">No matches here yet</p>
            <p className="mt-2 text-lg text-muted">
              Try another filter — new fixtures appear as they&apos;re scheduled.
            </p>
          </div>
        ) : (
          <motion.div
            key={filter}
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {shown.map((m) => (
              <motion.div key={m.id} variants={staggerItem}>
                <MatchCard match={m} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </>
  );
}
