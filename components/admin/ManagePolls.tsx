"use client";

import { getPolls, getMatches, setPollOpen } from "@/lib/data";
import type { Poll, Match } from "@/lib/data/types";
import { useLiveData } from "@/hooks/useLiveData";
import { compactNumber, pct } from "@/lib/format";
import { useToast } from "@/components/ui/Toast";
import { Lock, Unlock } from "lucide-react";

export function ManagePolls() {
  const toast = useToast();
  const polls = useLiveData(() => getPolls(), [] as Poll[], []);
  const matches = useLiveData(() => getMatches(), [] as Match[], []);

  const matchOf = (id: string) => matches.find((m) => m.id === id);

  async function toggle(p: Poll) {
    await setPollOpen(p.id, !p.isOpen);
    toast(p.isOpen ? "Poll closed" : "Poll re-opened", "info");
  }

  if (!polls.length) {
    return <p className="text-lg text-muted">No polls yet. Add a match to create one.</p>;
  }

  return (
    <div className="space-y-4">
      {polls.map((p) => {
        const m = matchOf(p.matchId);
        const total = p.options.reduce((s, o) => s + o.votes, 0);
        return (
          <div key={p.id} className="card p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-lg font-bold">
                  {m ? `${m.homeTeam.name} vs ${m.awayTeam.name}` : p.matchId}
                </p>
                <p className="text-sm text-muted">
                  {compactNumber(total)} votes · {m?.competition ?? "—"}
                </p>
              </div>
              <button
                onClick={() => toggle(p)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                  p.isOpen
                    ? "bg-accent-soft text-accent-dark hover:bg-accent/20"
                    : "bg-line text-muted hover:bg-line/70"
                }`}
              >
                {p.isOpen ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                {p.isOpen ? "Open: click to close" : "Closed: click to open"}
              </button>
            </div>
            <div className="space-y-2.5">
              {p.options.map((o) => {
                const percent = pct(o.votes, total);
                const color =
                  o.teamId === m?.homeTeam.id
                    ? m?.homeTeam.primaryColor
                    : m?.awayTeam.primaryColor;
                return (
                  <div key={o.teamId}>
                    <div className="mb-1 flex justify-between text-sm font-semibold">
                      <span>{o.label}</span>
                      <span className="tabular-nums">
                        {compactNumber(o.votes)} · {percent}%
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-canvas">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, background: color ?? "#16E07A" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
