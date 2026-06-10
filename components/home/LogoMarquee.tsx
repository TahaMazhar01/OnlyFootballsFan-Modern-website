"use client";

import { teams } from "@/lib/data/mock";
import { TeamBadge } from "@/components/ui/TeamBadge";

// Continuously scrolling strip of clubs (à la "70+ teams. 1 app.").
// Uses brand-crest badges so nothing ever renders broken; structured so real
// club logo images can be dropped into TeamBadge later.
export function LogoMarquee() {
  const list = Object.values(teams);
  const row = [...list, ...list]; // doubled for a seamless -50% loop

  return (
    <section className="border-y border-line bg-surface/70 py-9">
      <p className="container-page mb-7 text-center font-display text-sm font-bold uppercase tracking-[0.22em] text-muted">
        Backed by fans of the world&apos;s biggest clubs
      </p>
      <div
        className="group relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 7%, black 93%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 7%, black 93%, transparent)",
        }}
      >
        <div className="flex w-max gap-12 animate-marquee group-hover:[animation-play-state:paused]">
          {row.map((t, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-3 opacity-80 transition-opacity hover:opacity-100"
            >
              <TeamBadge team={t} size="md" />
              <span className="whitespace-nowrap font-display text-lg font-bold text-ink">
                {t.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
