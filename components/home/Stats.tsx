"use client";

import { Activity, Trophy, Users, Vote } from "lucide-react";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";

const stats = [
  { icon: Vote, to: 2_412_900, suffix: "+", label: "Votes cast by fans", compact: true },
  { icon: Users, to: 50_300, suffix: "+", label: "Daily active fans", compact: true },
  { icon: Trophy, to: 180, suffix: "+", label: "Clubs represented", compact: false },
  { icon: Activity, to: 1_240, suffix: "", label: "Matches covered", compact: false },
];

export function Stats() {
  return (
    <section className="container-page py-16">
      <Reveal>
        <div className="overflow-hidden rounded-4xl bg-navy bg-pitch-gradient p-8 sm:p-12">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center sm:text-left">
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-accent">
                  <s.icon className="h-6 w-6" />
                </span>
                <p className="font-display text-4xl font-extrabold text-white sm:text-5xl">
                  <Counter to={s.to} suffix={s.suffix} compact={s.compact} />
                </p>
                <p className="mt-1 text-base text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
