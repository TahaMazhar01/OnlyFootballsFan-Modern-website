"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Radio, Vote as VoteIcon, Lock } from "lucide-react";
import type { Match, Team } from "@/lib/data/types";
import { getPoll, submitVote } from "@/lib/data";
import { useLiveData } from "@/hooks/useLiveData";
import { useToast } from "@/components/ui/Toast";
import { compactNumber, pct } from "@/lib/format";

const votedKey = (pollId: string) => `off:voted:${pollId}`;

export function LivePoll({
  match,
  size = "md",
}: {
  match: Match;
  size?: "sm" | "md" | "lg";
}) {
  const toast = useToast();
  const poll = useLiveData(() => getPoll(match.id), undefined, [match.id]);
  const [votedTeamId, setVotedTeamId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Restore prior vote from localStorage so refreshes remember the choice.
  useEffect(() => {
    if (!poll || typeof window === "undefined") return;
    setVotedTeamId(window.localStorage.getItem(votedKey(poll.id)));
  }, [poll?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const total = useMemo(
    () => poll?.options.reduce((s, o) => s + o.votes, 0) ?? 0,
    [poll?.options],
  );

  const teamFor = (teamId: string): Team =>
    teamId === match.homeTeam.id ? match.homeTeam : match.awayTeam;

  async function handleVote(teamId: string) {
    if (!poll || !poll.isOpen || votedTeamId || submitting) return;
    setSubmitting(true);
    setVotedTeamId(teamId); // optimistic
    window.localStorage.setItem(votedKey(poll.id), teamId);
    await submitVote(poll.id, teamId);
    setSubmitting(false);
    toast(`Vote counted for ${teamFor(teamId).shortName}! 🟢`);
  }

  if (!poll) {
    return (
      <div className="h-28 animate-pulse rounded-2xl bg-line/60" aria-hidden />
    );
  }

  const revealed = Boolean(votedTeamId) || !poll.isOpen;
  const pad = size === "lg" ? "p-6" : size === "sm" ? "p-4" : "p-5";

  return (
    <div className={`rounded-2xl bg-canvas ${pad}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-base font-bold text-ink">
            {poll.question}
          </span>
        </div>
        {poll.isOpen ? (
          <span className="chip bg-accent-soft text-accent-dark">
            <Radio className="h-3.5 w-3.5 animate-pulse-live" /> Live poll
          </span>
        ) : (
          <span className="chip bg-line text-muted">
            <Lock className="h-3.5 w-3.5" /> Closed
          </span>
        )}
      </div>

      <div className="space-y-3">
        {poll.options.map((opt) => {
          const team = teamFor(opt.teamId);
          const percent = pct(opt.votes, total);
          const chosen = votedTeamId === opt.teamId;
          const clickable = poll.isOpen && !votedTeamId && !submitting;
          return (
            <button
              key={opt.teamId}
              type="button"
              disabled={!clickable}
              onClick={() => handleVote(opt.teamId)}
              className={`group relative block w-full overflow-hidden rounded-xl border-2 text-left transition-all ${
                chosen
                  ? "border-accent shadow-glow"
                  : clickable
                    ? "border-line hover:border-accent/70 hover:-translate-y-0.5"
                    : "border-line"
              }`}
            >
              {/* animated fill bar */}
              <motion.span
                className="absolute inset-y-0 left-0 -z-0"
                style={{
                  background: `linear-gradient(90deg, ${hexA(
                    team.primaryColor,
                    0.28,
                  )}, ${hexA(team.primaryColor, 0.1)})`,
                }}
                initial={false}
                animate={{ width: revealed ? `${percent}%` : "0%" }}
                transition={{ type: "spring", stiffness: 120, damping: 22 }}
              />
              <span className="relative z-10 flex items-center justify-between gap-3 px-4 py-3">
                <span className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg font-display text-xs font-extrabold text-white"
                    style={{ background: team.primaryColor }}
                  >
                    {team.shortName.slice(0, 3)}
                  </span>
                  <span className="font-display text-[15px] font-bold text-ink">
                    {team.name}
                  </span>
                  {chosen && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-navy">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-3">
                  <AnimatePresence mode="wait">
                    {revealed ? (
                      <motion.span
                        key="pct"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-display text-lg font-extrabold tabular-nums text-ink"
                      >
                        {percent}%
                      </motion.span>
                    ) : (
                      <motion.span
                        key="cta"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="chip bg-navy text-white group-hover:bg-accent-dark"
                      >
                        <VoteIcon className="h-3.5 w-3.5" /> Vote
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted">
        <span className="tabular-nums">
          <span className="font-bold text-ink">{compactNumber(total)}</span>{" "}
          votes
        </span>
        {revealed ? (
          <span>{poll.isOpen ? "Live results — updating" : "Final result"}</span>
        ) : (
          <span>Tap your team to vote</span>
        )}
      </div>
    </div>
  );
}

// hex -> rgba string with alpha
function hexA(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.replace(/(.)/g, "$1$1") : h;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
