"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useTransform,
  motion,
} from "framer-motion";

/** Animated number counter that runs once when scrolled into view. */
export function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 1.6,
  compact = false,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  compact?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => {
    const n = Math.round(v);
    const str = compact
      ? new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(n)
      : new Intl.NumberFormat("en-US").format(n);
    return `${prefix}${str}${suffix}`;
  });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, {
        duration,
        ease: [0.22, 1, 0.36, 1] as const,
      });
      return controls.stop;
    }
  }, [inView, to, count, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
