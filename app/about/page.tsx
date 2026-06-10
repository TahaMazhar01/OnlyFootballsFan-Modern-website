"use client";

import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import FlowArt, { FlowSection } from "@/components/visual/StoryScroll";

type Tone = "navy" | "light" | "green";

interface Story {
  kicker: string;
  index: string;
  heading: string;
  sub: string;
  image: string;
  tone: Tone;
  cta?: boolean;
}

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=70`;

const stories: Story[] = [
  {
    kicker: "OnlyFootballsFan",
    index: "Scroll ↓",
    heading: "Where Every Fan Has a Voice",
    sub: "Scroll the story of the home built for the football faithful.",
    image: img("1551958219-acbc608c6377"),
    tone: "navy",
  },
  {
    kicker: "01: Who we are",
    index: "01 / 05",
    heading: "A Home for the Faithful",
    sub: "One place for every supporter to gather, vote, read and celebrate the game they love, live and every single day.",
    image: img("1606925797300-0b35e9d1794e"),
    tone: "light",
  },
  {
    kicker: "02: Your voice",
    index: "02 / 05",
    heading: "Vote in Real Time",
    sub: "Back your team in live polls and watch the crowd shift, second by second, as thousands of fans cast their vote.",
    image: img("1522778119026-d647f0596c20"),
    tone: "navy",
  },
  {
    kicker: "03: Every day",
    index: "03 / 05",
    heading: "Fresh Content, Daily",
    sub: "New matches, posters and stories, published in minutes, straight from matchday to your feed.",
    image: img("1543326727-cf6c39e8f84c"),
    tone: "green",
  },
  {
    kicker: "04: Join us",
    index: "04 / 05",
    heading: "Add Your Voice",
    sub: "Jump into a live match and back your team. The bars move with every fan who shows up, including you.",
    image: img("1574629810360-7efbbe195018"),
    tone: "navy",
    cta: true,
  },
];

// Theme tokens per tone — keeps the story on-brand (navy ink, off-white, green).
const tones: Record<
  Tone,
  {
    base: string;
    fg: string;
    kicker: string;
    divider: string;
    scrim: string;
    mobile: string;
  }
> = {
  navy: {
    base: "#0A2540",
    fg: "#F8FAFC",
    kicker: "#16E07A",
    divider: "rgba(248,250,252,0.25)",
    scrim:
      "linear-gradient(100deg, rgba(10,37,64,0.92) 0%, rgba(10,37,64,0.8) 36%, rgba(10,37,64,0.34) 64%, rgba(10,37,64,0) 88%)",
    mobile: "rgba(10,37,64,0.58)",
  },
  light: {
    base: "#EAF0F7",
    fg: "#0B1120",
    kicker: "#0FB863",
    divider: "rgba(11,17,32,0.15)",
    scrim:
      "linear-gradient(100deg, rgba(234,240,247,0.95) 0%, rgba(234,240,247,0.86) 36%, rgba(234,240,247,0.4) 64%, rgba(234,240,247,0) 88%)",
    mobile: "rgba(234,240,247,0.6)",
  },
  green: {
    base: "#16E07A",
    fg: "#06251A",
    kicker: "#06251A",
    divider: "rgba(6,37,26,0.3)",
    scrim:
      "linear-gradient(100deg, rgba(22,224,122,0.93) 0%, rgba(22,224,122,0.82) 36%, rgba(22,224,122,0.34) 64%, rgba(22,224,122,0) 88%)",
    mobile: "rgba(22,224,122,0.55)",
  },
};

export default function AboutPage() {
  return (
    // Break out of the global nav padding so each section is truly full-screen.
    <div className="-mt-20 sm:-mt-28">
      <FlowArt aria-label="The OnlyFootballsFan story">
        {stories.map((s) => {
          const t = tones[s.tone];
          return (
            <FlowSection
              key={s.heading}
              aria-label={s.heading}
              style={{ color: t.fg, backgroundColor: t.base }}
            >
              {/* ---- background layers (rotate with the panel) ---- */}
              {/* full-bleed player image, anchored right, slow cinematic zoom */}
              <div
                className="kenburns absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${s.image}')`,
                  backgroundPosition: "right center",
                }}
                aria-hidden
              />
              {/* directional scrim — solid on the left, clear on the right so
                  text never sits on top of the player */}
              <div
                className="absolute inset-0"
                style={{ background: t.scrim }}
                aria-hidden
              />
              {/* extra readability wash on small screens only */}
              <div
                className="absolute inset-0 sm:hidden"
                style={{ background: t.mobile }}
                aria-hidden
              />

              {/* ---- top meta row ---- */}
              <div
                className="relative z-10 flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] sm:text-sm"
                style={{ color: t.fg }}
              >
                <span style={{ color: t.kicker }}>{s.kicker}</span>
                <span className="tabular-nums opacity-70">{s.index}</span>
              </div>

              {/* ---- bottom statement (left-aligned, constrained off the player) ---- */}
              <div className="relative z-10 max-w-3xl">
                <div
                  className="mb-6 h-[3px] w-24 sm:w-40"
                  style={{ background: s.tone === "green" ? "#06251A" : "#16E07A" }}
                />
                <h2
                  className="font-display font-extrabold uppercase leading-[0.9] tracking-tight"
                  style={{ fontSize: "clamp(2.75rem, 8vw, 10rem)" }}
                >
                  {s.heading}
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-relaxed opacity-90 sm:text-2xl">
                  {s.sub}
                </p>

                {s.cta ? (
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/matches"
                      className="inline-flex items-center gap-2 rounded-full bg-accent-gradient px-7 py-3.5 font-display text-lg font-semibold text-navy shadow-glow transition-transform hover:-translate-y-0.5"
                    >
                      Vote on live matches <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-7 py-3.5 font-display text-lg font-semibold text-white transition-colors hover:border-white"
                    >
                      Read the blog
                    </Link>
                  </div>
                ) : (
                  s.index === "Scroll ↓" && (
                    <div className="mt-8 inline-flex items-center gap-2 text-base font-semibold opacity-80">
                      <ArrowDown className="h-5 w-5 animate-bounce" /> Keep
                      scrolling
                    </div>
                  )
                )}
              </div>
            </FlowSection>
          );
        })}
      </FlowArt>
    </div>
  );
}
