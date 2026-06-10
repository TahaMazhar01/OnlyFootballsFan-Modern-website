"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Runs GSAP setup inside a `gsap.context()` so every tween/ScrollTrigger it
 * creates is automatically reverted on unmount — the clean way to use GSAP in
 * React. Uses a layout effect on the client to avoid a flash before animating.
 */
export function useGsap(
  setup: () => void,
  deps: ReadonlyArray<unknown> = [],
) {
  const ran = useRef(false);
  useEffect(() => {
    // gsap.context scopes + collects animations for easy cleanup.
    const ctx = gsap.context(() => setup());
    ran.current = true;
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
