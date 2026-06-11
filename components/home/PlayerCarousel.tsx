"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Provided football images (downloaded to /public/players). Swap any entry or
// drop a new photo into that folder and point `src` at it.
const slides: { src: string; caption: string }[] = [
  { src: "/players/p1.jpg", caption: "THE ROAR" },
  { src: "/players/p2.jpg", caption: "MATCHDAY" },
  { src: "/players/p3.webp", caption: "GOAL!" },
  { src: "/players/p4.jpg", caption: "THE STAGE" },
  { src: "/players/p5.jpg", caption: "FULL TIME" },
  { src: "/players/p6.jpg", caption: "KICKOFF" },
];

/**
 * Cinematic, continuously cross-fading hero carousel. Slides are stacked and we
 * animate opacity + a slow Ken Burns zoom on the active one (no AnimatePresence,
 * so it can never get "stuck" and scrolling stays smooth).
 */
export function PlayerCarousel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = window.setInterval(
      () => setI((p) => (p + 1) % slides.length),
      4200,
    );
    return () => window.clearInterval(t);
  }, []);

  return (
    <>
      {/* angled frame with cross-fading + slow-zoom slides */}
      <div
        className="relative h-[520px] w-full overflow-hidden"
        style={{
          clipPath: "polygon(14% 0, 100% 0, 86% 100%, 0 100%)",
          filter: "drop-shadow(0 28px 44px rgba(11,17,32,0.45))",
        }}
      >
        {slides.map((s, idx) => {
          const active = idx === i;
          return (
            <motion.div
              key={s.src}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: active ? 1 : 0, scale: active ? 1.12 : 1 }}
              transition={{
                opacity: { duration: 1.2, ease: "easeInOut" },
                scale: { duration: 5.2, ease: "linear" },
              }}
            >
              <Image
                src={s.src}
                alt="World-class football moment"
                fill
                priority={idx === 0}
                sizes="(max-width: 480px) 100vw, 460px"
                className="object-cover"
                style={{ objectPosition: "center 25%" }}
              />
            </motion.div>
          );
        })}

        {/* cinematic film overlay: dark grade at the bottom + top vignette */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,18,33,0.72) 0%, rgba(8,18,33,0.12) 38%, rgba(8,18,33,0) 60%), radial-gradient(120% 80% at 50% 0%, rgba(8,18,33,0.35), transparent 55%)",
          }}
        />
        {/* subtle diagonal sheen */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            background:
              "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
          }}
        />

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

      {/* floating badge with rotating caption */}
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
