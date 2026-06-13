"use client";

import { useEffect, useRef, useState } from "react";
import { Flame } from "lucide-react";

/**
 * Brand logo. Uses /public/logo.png; falls back to the flame + wordmark mark if
 * it's missing, so the header never shows a broken image.
 */
export function Logo({ height = 36 }: { height?: number }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If the image was already cached (loaded before hydration), the onLoad event
  // never fires — detect that here so it still shows.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete) {
      if (el.naturalWidth > 0) setLoaded(true);
      else setFailed(true);
    }
  }, []);

  return (
    <span className="flex items-center">
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src="/logo.png"
          alt="OnlyFootballsFan"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{ height, display: loaded ? "block" : "none" }}
          className="w-auto object-contain"
        />
      )}

      {!loaded && (
        <span className="flex items-center gap-2.5">
          <span
            className="flex items-center justify-center rounded-xl bg-accent-gradient shadow-glow"
            style={{ height, width: height }}
          >
            <Flame className="h-5 w-5 text-navy" strokeWidth={2.5} />
          </span>
          <span className="hidden font-display text-lg font-extrabold tracking-tight text-ink lg:inline">
            OnlyFootballs<span className="text-accent-dark">Fan</span>
          </span>
        </span>
      )}
    </span>
  );
}
