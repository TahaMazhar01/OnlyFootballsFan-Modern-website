"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Radio } from "lucide-react";

// Hero design adapted from the "lionsfc" concept (angled player frame + diagonal
// brand slab + floating badge), re-skinned to the OnlyFootballsFan theme:
// green accent + navy slab + Sora display type.

const ease = [0.22, 1, 0.36, 1] as const;
const up = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.08 * i, duration: 0.6, ease },
});

const stats: [string, string][] = [
  ["2.4M+", "Votes Cast"],
  ["350+", "Matches Covered"],
  ["24/7", "Football News"],
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* diagonal navy slab behind the player (desktop) */}
      <div
        aria-hidden
        className="absolute right-0 top-0 hidden h-full w-[46%] lg:block"
        style={{
          background: "linear-gradient(160deg, #0A2540 0%, #06182c 100%)",
          clipPath: "polygon(58% 0, 100% 0, 100% 100%, 22% 100%)",
        }}
      />


      <div className="container-page relative z-10 grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        {/* ---- left copy ---- */}
        <div className="text-center lg:text-left">
          <motion.p
            {...up(0)}
            className="mb-5 font-display text-xs font-bold uppercase tracking-[0.25em] text-accent-dark"
          >
            <span className="text-muted">/</span> For the fans, by the fans{" "}
            <span className="text-muted">/</span>
          </motion.p>

          <motion.h1
            {...up(1)}
            className="font-display text-5xl font-extrabold uppercase leading-[1.04] tracking-tight sm:text-6xl lg:text-[5rem]"
          >
            Your Game.
            <br />
            Your Voice.
            <br />
            <span className="bg-accent-gradient bg-clip-text text-transparent">
              Your Home.
            </span>
          </motion.h1>

          <motion.p
            {...up(2)}
            className="mx-auto mt-6 max-w-xl text-lg text-muted lg:mx-0"
          >
            Vote in daily fan polls, follow live match scores as they happen, and
            never miss a headline. Football&apos;s biggest community is waiting
            for you.
          </motion.p>

          <motion.div
            {...up(3)}
            className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start"
          >
            <Link href="/matches" className="btn-primary text-lg">
              <Play className="h-5 w-5" fill="currentColor" /> Vote Now
            </Link>
            <Link href="/matches" className="btn-ghost text-lg">
              <Radio className="h-5 w-5" /> Live Scores
            </Link>
          </motion.div>

          <motion.div
            {...up(4)}
            className="mt-10 flex justify-center gap-10 lg:justify-start"
          >
            {stats.map(([num, label]) => (
              <div key={label}>
                <p className="font-display text-3xl font-extrabold text-accent-dark">
                  {num}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[2px] text-muted">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ---- player visual ---- */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease }}
          className="relative mx-auto w-full max-w-[440px] lg:justify-self-end"
        >
          {/* skewed accent bars */}
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

          {/* angled photo frame */}
          <div
            className="relative h-[520px] w-full"
            style={{
              clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)",
              filter: "drop-shadow(0 28px 44px rgba(11,17,32,0.32))",
            }}
          >
            <Image
              src="/players/cr7-roar.jpg"
              alt="Footballer roaring in celebration, fist clenched"
              fill
              priority
              sizes="(max-width: 480px) 100vw, 440px"
              className="object-cover"
              style={{ objectPosition: "center 18%" }}
            />
          </div>

          {/* floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5, ease }}
            className="absolute bottom-9 left-[-18px] z-[4] border-l-4 border-accent bg-surface px-5 py-3.5 shadow-lift"
          >
            <div className="font-display text-2xl font-extrabold leading-none text-accent-dark">
              SIUUU!
            </div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[2px] text-muted">
              Join the roar
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
