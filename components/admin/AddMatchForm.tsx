"use client";

import { useState } from "react";
import { Sparkles, Save } from "lucide-react";
import { createMatch } from "@/lib/data";
import { teams } from "@/lib/data/mock";
import type { MatchStatus } from "@/lib/data/types";
import { Field, inputClass } from "./Field";
import { ImageDropzone } from "./ImageDropzone";
import { useToast } from "@/components/ui/Toast";

const teamList = Object.values(teams);

export function AddMatchForm({ onDone }: { onDone?: () => void }) {
  const toast = useToast();
  const [home, setHome] = useState("arg");
  const [away, setAway] = useState("bra");
  const [competition, setCompetition] = useState("FIFA World Cup");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<MatchStatus>("upcoming");
  const [poster, setPoster] = useState("");
  // Poll scheduling (optional — defaults: opens now, closes 24h before kickoff)
  const [pollQuestion, setPollQuestion] = useState("Who will win?");
  const [pollOpens, setPollOpens] = useState("");
  const [pollCloses, setPollCloses] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (home === away) {
      toast("Home and away teams must be different", "info");
      return;
    }
    setSaving(true);
    const kickoff =
      date && time
        ? new Date(`${date}T${time}`).toISOString()
        : new Date(Date.now() + 3 * 3600_000).toISOString();
    await createMatch(
      {
        homeTeam: teams[home],
        awayTeam: teams[away],
        kickoff,
        status,
        competition,
        venue: venue || "TBD",
        posterUrl: poster || undefined,
        ...(status !== "upcoming" ? { score: { home: 0, away: 0 } } : {}),
      },
      {
        question: pollQuestion,
        opensAt: pollOpens ? new Date(pollOpens).toISOString() : undefined,
        closesAt: pollCloses ? new Date(pollCloses).toISOString() : undefined,
      },
    );
    setSaving(false);
    toast("Match added and its poll is scheduled! ⚽");
    onDone?.();
    setVenue("");
    setDate("");
    setTime("");
    setPoster("");
    setPollOpens("");
    setPollCloses("");
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Home team">
          <select className={inputClass} value={home} onChange={(e) => setHome(e.target.value)}>
            {teamList.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Away team">
          <select className={inputClass} value={away} onChange={(e) => setAway(e.target.value)}>
            {teamList.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Competition">
          <input className={inputClass} value={competition} onChange={(e) => setCompetition(e.target.value)} placeholder="e.g. Premier League" />
        </Field>
        <Field label="Venue">
          <input className={inputClass} value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="e.g. Old Trafford" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date">
            <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Kickoff time">
            <input type="time" className={inputClass} value={time} onChange={(e) => setTime(e.target.value)} />
          </Field>
        </div>
        <Field label="Status">
          <div className="flex gap-2">
            {(["upcoming", "live", "finished"] as MatchStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-base font-bold capitalize transition-colors ${
                  status === s
                    ? "border-accent bg-accent-soft text-accent-dark"
                    : "border-line text-muted hover:border-accent/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="space-y-5">
        <Field label="Match poster" hint="A bold image shown on the match card.">
          <ImageDropzone value={poster} onChange={setPoster} label="Upload poster" />
        </Field>
        {/* Poll settings */}
        <div className="space-y-4 rounded-2xl border border-line bg-canvas p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent-dark">
              <Sparkles className="h-4 w-4" />
            </span>
            <p className="font-display text-base font-bold text-ink">
              Fan poll for this match
            </p>
          </div>
          <Field label="Poll question">
            <input
              className={inputClass}
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="Who will win?"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Voting opens" hint="Blank = right away">
              <input
                type="datetime-local"
                className={inputClass}
                value={pollOpens}
                onChange={(e) => setPollOpens(e.target.value)}
              />
            </Field>
            <Field label="Voting closes" hint="Blank = 24h before kickoff">
              <input
                type="datetime-local"
                className={inputClass}
                value={pollCloses}
                onChange={(e) => setPollCloses(e.target.value)}
              />
            </Field>
          </div>
          <p className="text-xs text-muted">
            Before it opens the poll shows as <b>Upcoming</b>, then <b>Open</b>{" "}
            for voting, then <b>Closed</b> with results.
          </p>
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full text-lg">
          <Save className="h-5 w-5" /> {saving ? "Saving…" : "Add match & schedule poll"}
        </button>
      </div>
    </form>
  );
}
