import { NextResponse } from "next/server";
import type { Match, MatchStatus, Team } from "@/lib/data/types";

// Live fixtures proxy. Keeps the API key server-side and dodges CORS.
//
// Uses Football-Data.org (free tier covers the World Cup + major leagues).
// Get a free token at https://www.football-data.org/client/register and put it
// in .env.local as FOOTBALL_DATA_TOKEN. With no token we return { live:false }
// and the client falls back to local mock fixtures.
//
// Re-fetched at most every 30s (cheap + within the free rate limit).
export const revalidate = 30;

const FD_BASE = "https://api.football-data.org/v4";

// Deterministic brand-ish colour per team name (FD doesn't provide one).
function colorFor(name: string): string {
  const palette = [
    "#16E07A", "#0A2540", "#C8102E", "#034694", "#DA291C",
    "#6CABDD", "#A50044", "#DC052D", "#004170", "#00529F",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

function mapStatus(fd: string): MatchStatus {
  if (["IN_PLAY", "PAUSED", "LIVE"].includes(fd)) return "live";
  if (["FINISHED", "AWARDED"].includes(fd)) return "finished";
  return "upcoming";
}

interface FdTeam {
  id?: number;
  name?: string;
  shortName?: string;
  tla?: string;
  crest?: string;
}
interface FdMatch {
  id: number;
  utcDate: string;
  status: string;
  minute?: number | null;
  venue?: string | null;
  competition?: { name?: string };
  homeTeam: FdTeam;
  awayTeam: FdTeam;
  score?: { fullTime?: { home?: number | null; away?: number | null } };
}

function toTeam(t: FdTeam): Team {
  const name = t.name ?? "TBD";
  const short = t.tla ?? t.shortName ?? name.slice(0, 3).toUpperCase();
  return {
    id: t.tla ?? String(t.id ?? name),
    name,
    shortName: short,
    badgeUrl: t.crest ?? "",
    primaryColor: colorFor(name),
  };
}

// Last successful upstream payload, kept in module memory (survives across
// requests on a warm serverless instance). When a 30s revalidation hits a
// transient upstream error (rate-limit / timeout), we serve this instead of an
// empty list — so the UI never flips back to demo data once real data loaded.
let lastGood: { matches: Match[]; ts: number } | null = null;

function toMatch(m: FdMatch): Match {
  const status = mapStatus(m.status);
  const ft = m.score?.fullTime;
  return {
    id: String(m.id),
    homeTeam: toTeam(m.homeTeam),
    awayTeam: toTeam(m.awayTeam),
    kickoff: m.utcDate,
    status,
    competition: m.competition?.name ?? "Football",
    venue: m.venue ?? "",
    score:
      status !== "upcoming"
        ? { home: ft?.home ?? 0, away: ft?.away ?? 0 }
        : undefined,
    minute: typeof m.minute === "number" ? m.minute : undefined,
  };
}

export async function GET() {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) {
    return NextResponse.json({ live: false, matches: [] });
  }

  try {
    // The World Cup competition endpoint returns the whole tournament —
    // finished, live AND upcoming fixtures — with no date-range limit (the
    // generic /matches range is capped on the free tier).
    const url = `${FD_BASE}/competitions/WC/matches`;
    const res = await fetch(url, {
      headers: { "X-Auth-Token": token },
      next: { revalidate: 30 },
    });
    if (!res.ok) {
      // Transient upstream error (e.g. 429 rate-limit). Serve the last known
      // good data so the UI stays on real scores instead of dropping to demo.
      if (lastGood) {
        return NextResponse.json({ live: true, matches: lastGood.matches, stale: true });
      }
      return NextResponse.json({ live: false, matches: [], error: res.status });
    }
    const data = (await res.json()) as { matches?: FdMatch[] };
    const matches = (data.matches ?? []).map(toMatch);
    if (matches.length > 0) {
      lastGood = { matches, ts: Date.now() };
      return NextResponse.json({ live: true, matches });
    }
    // Empty payload — prefer last good over nothing.
    if (lastGood) {
      return NextResponse.json({ live: true, matches: lastGood.matches, stale: true });
    }
    return NextResponse.json({ live: false, matches: [] });
  } catch {
    // Network failure — keep serving real data if we ever had it.
    if (lastGood) {
      return NextResponse.json({ live: true, matches: lastGood.matches, stale: true });
    }
    return NextResponse.json({ live: false, matches: [] });
  }
}
