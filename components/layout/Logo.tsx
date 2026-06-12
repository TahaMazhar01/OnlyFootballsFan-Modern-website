"use client";

import { useState } from "react";
import { Flame } from "lucide-react";

/**
 * Brand logo. Drop your transparent PNG at /public/logo.png and it shows
 * everywhere. Until then (or if it fails to load) it falls back to the
 * flame + wordmark mark — so the header never shows a broken image.
 */
export function Logo({ height = 36 }: { height?: number }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <span className="flex items-center">
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
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
