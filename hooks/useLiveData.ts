"use client";

import { useEffect, useState } from "react";
import { subscribe } from "@/lib/data";

/**
 * Fetches data from the data layer and re-fetches whenever the store changes
 * (votes, admin edits, the realtime simulation). This is what makes the live
 * poll bars feel real-time in the prototype.
 *
 * `fetcher` is included in deps so the hook never runs with a stale fetcher.
 */
export function useLiveData<T>(
  fetcher: () => Promise<T>,
  initial: T,
  deps: ReadonlyArray<unknown> = [],
): T {
  const [data, setData] = useState<T>(initial);

  useEffect(() => {
    let active = true;

    const run = () => {
      fetcher()
        .then((d) => {
          if (active) setData(d);
        })
        .catch((e) => console.error("[useLiveData] fetch failed:", e));
    };

    run();
    const unsub = subscribe(run);

    return () => {
      active = false;
      unsub();
    };
  }, [fetcher, subscribe, ...deps]);

  return data;
}

