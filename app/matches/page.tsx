"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getMatches } from "@/lib/data";
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

export default function MatchesPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const matches = useLiveData(() => getMatches(), [] as Match[], []);

  const liveCount = matches.filter((m) => m.status === "live").length;
  const shown =
    filter === "all" ? matches : matches.filter((m) => m.status === filter);

  return (
    <>
      <PageHeader
        eyebrow="Fixtures"
        title="Every match. Every vote."
        subtitle="Follow live and upcoming games, see results, and back your team in real-time fan polls."
      >
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
                  layoutId="match-filter"
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
              Try another filter — new fixtures are added daily.
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
