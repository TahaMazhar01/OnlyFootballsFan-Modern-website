"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=72`;

// A neutral rotation of world-class football moments (no single player/club
// favoured). Swap any entry — or drop your own photos into /public/players and
// point `src` at them, e.g. src: "/players/messi.jpg".
const slides: { src: string; caption: string }[] = [
  { src: "/players/cr7-roar.jpg", caption: "THE ROAR" },
  { src: u("1543326727-cf6c39e8f84c"), caption: "MATCHDAY" },
  { src: u("1551958219-acbc608c6377"), caption: "FULL FOCUS" },
  { src: u("1577223625816-7546f13df25d"), caption: "GOAL!" },
  { src: u("1518091043644-c1d4457512c6"), caption: "KICKOFF" },
  { src: u("1571019613454-1cb2f99b2d8b"), caption: "DERBY DAY" },
];

/**
 * Continuously cross-fading hero image carousel. All slides are stacked and we
 * just animate opacity on the active index — no AnimatePresence, so it can
 * never get "stuck", and scrolling stays smooth.
 */
export function PlayerCarousel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = window.setInterval(
      () => setI((p) => (p + 1) % slides.length),
      3800,
    );
    return () => window.clearInterval(t);
  }, []);

  return (
    <>
      {/* angled frame with cross-fading slides */}
      <div
        className="relative h-[520px] w-full"
        style={{
          clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)",
          filter: "drop-shadow(0 28px 44px rgba(11,17,32,0.32))",
        }}
      >
        {slides.map((s, idx) => (
          <motion.div
            key={s.src}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: idx === i ? 1 : 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          >
            <Image
              src={s.src}
              alt="World-class football action"
              fill
              priority={idx === 0}
              sizes="(max-width: 480px) 100vw, 440px"
              className="object-cover"
              style={{ objectPosition: "center 18%" }}
            />
          </motion.div>
        ))}

        {/* progress dots */}
        <div className="absolute bottom-4 right-6 z-10 flex gap-1.5">
          {slides.map((s, d) => (
            <span
              key={s.src}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                d === i ? "w-5 bg-accent" : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* floating badge with rotating neutral caption */}
      <div className="absolute bottom-9 left-[-18px] z-[4] border-l-4 border-accent bg-surface px-5 py-3.5 shadow-lift">
        <motion.div
          key={slides[i].caption}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="font-display text-2xl font-extrabold leading-none text-accent-dark"
        >
          {slides[i].caption}
        </motion.div>
        <div className="mt-1 text-[10px] font-bold uppercase tracking-[2px] text-muted">
          Football&apos;s home
        </div>
      </div>
    </>
  );
}
