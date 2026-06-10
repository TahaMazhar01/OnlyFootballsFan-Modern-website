"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsap } from "@/hooks/useGsap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * GSAP ScrollTrigger parallax: translates its child as the element scrolls
 * through the viewport. `speed` > 0 moves slower than scroll (depth),
 * negative moves against it.
 */
export function Parallax({
  children,
  speed = 0.2,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(() => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, {
      yPercent: -speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * GSAP reveal: fades + lifts + slightly scales children into view on scroll,
 * with optional stagger across direct children.
 */
export function GsapReveal({
  children,
  stagger = 0,
  y = 40,
  className = "",
}: {
  children: ReactNode;
  stagger?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(() => {
    const el = ref.current;
    if (!el) return;
    const targets = stagger ? Array.from(el.children) : [el];
    gsap.from(targets, {
      opacity: 0,
      y,
      scale: 0.98,
      duration: 0.9,
      ease: "power3.out",
      stagger,
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
