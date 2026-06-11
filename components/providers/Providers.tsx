"use client";

import { useEffect, type ReactNode } from "react";
import { startLiveVoteSimulation, startScoresRefresh } from "@/lib/data";
import { ToastProvider } from "@/components/ui/Toast";

/**
 * Client-side app shell: toast notifications, the simulated realtime vote feed
 * (animates poll bars), and a dedicated live-scores heartbeat that keeps real
 * scores refreshing during matches.
 * TODO: connect Supabase Realtime — drop the simulation, subscribe to channels.
 */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const stopVotes = startLiveVoteSimulation();
    const stopScores = startScoresRefresh();
    return () => {
      stopVotes();
      stopScores();
    };
  }, []);

  return <ToastProvider>{children}</ToastProvider>;
}
