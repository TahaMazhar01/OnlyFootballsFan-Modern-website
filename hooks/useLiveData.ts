"use client";

import { useEffect, useRef, useState } from "react";
import { subscribe } from "@/lib/data";

/**
 * Fetches data from the data layer and re-fetches whenever the store changes
 * (votes, admin edits, the realtime simulation / scores heartbeat).
 *
 * The fetcher is held in a ref so we always call the LATEST one (no stale
 * closure) WITHOUT re-running the effect on every render — re-running would
 * cancel slower in-flight fetches (e.g. the live-scores API) before they commit,
 * leaving those sections empty. The effect only re-runs when `deps` change.
 */
export function useLiveData<T>(
  fetcher: () => Promise<T>,
  initial: T,
  deps: ReadonlyArray<unknown> = [],
): T {
  const [data, setData] = useState<T>(initial);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let active = true;

    const run = () => {
      fetcherRef
        .current()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return data;
}
