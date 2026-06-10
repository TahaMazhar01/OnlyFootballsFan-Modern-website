"use client";

import { motion } from "framer-motion";

const dots = [
  { x: "12%", y: "22%", d: 0 },
  { x: "82%", y: "16%", d: 1.2 },
  { x: "68%", y: "60%", d: 0.6 },
  { x: "24%", y: "72%", d: 1.8 },
  { x: "90%", y: "78%", d: 0.9 },
  { x: "44%", y: "34%", d: 1.5 },
];

/**
 * Site-wide backdrop, fixed behind all content.
 *
 * Performance: the aurora is a STATIC blurred gradient promoted to its own
 * compositor layer (`translateZ(0)`), so it paints exactly once and never
 * repaints on scroll. We deliberately do NOT animate a full-screen `blur()`
 * layer (or run a blurred WebGL canvas) — re-blurring the whole viewport every
 * frame is what made scrolling janky. Subtle life comes from the small,
 * cheap floating dots instead.
 */
export function BackgroundFX() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* base wash */}
      <div className="absolute inset-0 bg-canvas" />

      {/* static aurora — painted once, isolated on its own layer */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          filter: "blur(70px) saturate(125%)",
          transform: "translateZ(0)",
          backgroundImage:
            "radial-gradient(40vmax 40vmax at 12% 8%, rgba(22,224,122,0.45), transparent 60%), radial-gradient(42vmax 42vmax at 92% 6%, rgba(10,37,64,0.26), transparent 60%), radial-gradient(38vmax 38vmax at 50% 108%, rgba(52,216,255,0.24), transparent 60%)",
        }}
      />

      {/* floating accent dots (small + cheap — the only animated bg motion) */}
      {dots.map((dot, i) => (
        <motion.span
          key={i}
          className="absolute h-2 w-2 rounded-full bg-accent/40"
          style={{ left: dot.x, top: dot.y, willChange: "transform" }}
          animate={{ y: [0, -22, 0], opacity: [0.25, 0.7, 0.25] }}
          transition={{
            duration: 5 + dot.d,
            repeat: Infinity,
            ease: "easeInOut",
            delay: dot.d,
          }}
        />
      ))}

      {/* top + bottom fade so content edges stay clean */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-canvas to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-canvas to-transparent" />
    </div>
  );
}
