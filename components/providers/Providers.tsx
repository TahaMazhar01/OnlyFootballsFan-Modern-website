"use client";

import { useEffect, type ReactNode } from "react";
import { startLiveVoteSimulation } from "@/lib/data";
import { ToastProvider } from "@/components/ui/Toast";

/**
 * Client-side app shell: toast notifications + the simulated realtime vote
 * feed that nudges poll counts so the live bars animate during the demo.
 * TODO: connect Supabase Realtime — drop the simulation, subscribe to channels.
 */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const stop = startLiveVoteSimulation();
    return stop;
  }, []);

  return <ToastProvider>{children}</ToastProvider>;
}
