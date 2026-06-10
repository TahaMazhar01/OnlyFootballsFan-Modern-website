"use client";

import Link from "next/link";
import { getMatches } from "@/lib/data";
import { useLiveData } from "@/hooks/useLiveData";
import type { Match } from "@/lib/data/types";

export function LiveStrip() {
  // Show live first, then upcoming, so the strip is always populated.
  const matches = useLiveData(
    async () => {
      const all = await getMatches();
      return [
        ...all.filter((m) => m.status === "live"),
        ...all.filter((m) => m.status === "upcoming"),
      ];
    },
    [] as Match[],
    [],
  );

  if (!matches.length) return null;
  const loop = [...matches, ...matches];

  return (
    <div className="border-y border-line bg-navy text-white">
      <div className="container-page flex items-center gap-4 py-2.5">
        <span className="flex shrink-0 items-center gap-2 rounded-full bg-live/20 px-3 py-1 text-sm font-extrabold uppercase tracking-wide text-white ring-1 ring-live/40">
          <span className="live-dot" /> Live now
        </span>
        <div className="relative flex-1 overflow-hidden no-scrollbar">
          <div className="flex w-max gap-3 animate-marquee hover:[animation-play-state:paused]">
            {loop.map((m, i) => (
              <Link
                key={`${m.id}-${i}`}
                href={`/matches/${m.id}`}
                className="flex shrink-0 items-center gap-2 rounded-full bg-white/5 px-3.5 py-1.5 text-sm transition-colors hover:bg-white/15"
              >
                {m.status === "live" && (
                  <span className="h-2 w-2 rounded-full bg-live animate-pulse-live" />
                )}
                <span className="font-bold">{m.homeTeam.shortName}</span>
                {m.score ? (
                  <span className="tabular-nums font-extrabold text-accent">
                    {m.score.home}–{m.score.away}
                  </span>
                ) : (
                  <span className="text-white/50">vs</span>
                )}
                <span className="font-bold">{m.awayTeam.shortName}</span>
                <span className="text-white/40">·</span>
                <span className="text-white/60">{m.competition}</span>
              </Link>
            ))}
          </div>
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-navy to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-navy to-transparent" />
        </div>
      </div>
    </div>
  );
}
