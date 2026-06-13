"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Radio } from "lucide-react";
import { PlayerCarousel } from "@/components/home/PlayerCarousel";

const ease = [0.22, 1, 0.36, 1] as const;
const up = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.08 * i, duration: 0.6, ease },
});

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Full-bleed background gradient */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-navy via-[#0b1f3a] to-navy" />

      {/* Animated accent orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-accent/8 blur-[100px]" />
      </div>

      <div className="container-page relative z-10 grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        {/* ── Left: Hero copy ── */}
        <div className="text-center lg:text-left">
          {/* Live indicator badge */}
          <motion.div {...up(0)} className="mb-6 flex justify-center lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse-live" />
              Live matches now
            </span>
          </motion.div>

          <motion.h1
            {...up(1)}
            className="font-display text-5xl font-extrabold uppercase leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-[5.5rem]"
          >
            Your Game.
            <br />
            Your Voice.
            <br />
            <span className="bg-gradient-to-r from-accent to-emerald-300 bg-clip-text text-transparent">
              Your Home.
            </span>
          </motion.h1>

          <motion.p
            {...up(2)}
            className="mx-auto mt-6 max-w-xl text-lg text-white/60 lg:mx-0"
          >
            Vote in daily fan polls, follow live FIFA World Cup scores as they happen,
            and never miss a headline. Football&apos;s biggest community is waiting
            for you.
          </motion.p>

          <motion.div
            {...up(3)}
            className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start"
          >
            <Link href="/polls" className="group inline-flex items-center gap-2 rounded-full bg-accent-gradient px-8 py-3.5 font-display text-lg font-bold text-navy shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-lift">
              <Play className="h-5 w-5" fill="currentColor" /> Vote Now
            </Link>
            <Link href="/matches" className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 font-display text-lg font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:bg-white/10">
              <Radio className="h-5 w-5" /> Live Scores
            </Link>
          </motion.div>
        </div>

        {/* ── Right: Player carousel ── */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease }}
          className="relative mx-auto w-full max-w-[440px] lg:justify-self-end"
        >
          {/* Accent bars */}
          <span
            aria-hidden
            className="absolute -left-5 -top-6 bottom-[-24px] z-[3] w-[5px] bg-white"
            style={{ transform: "skewX(-8deg)" }}
          />
          <span
            aria-hidden
            className="absolute -right-2 -top-6 bottom-[-24px] z-[3] w-[5px] bg-accent"
            style={{ transform: "skewX(-8deg)" }}
          />

          {/* Cross-fading carousel of football moments */}
          <PlayerCarousel />
        </motion.div>
      </div>
    </section>
  );
}
