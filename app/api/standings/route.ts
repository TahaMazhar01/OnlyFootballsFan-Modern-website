import { NextResponse } from "next/server";
import type { GroupTable, StandingRow, Team } from "@/lib/data/types";

// World Cup group standings proxy (Football-Data.org /v4/competitions/WC/standings).
// Keeps the key server-side. Falls back to { live:false } so the client can use
// local demo groups. Re-fetched at most every 5 min (standings change slowly).
export const revalidate = 300;

const FD_BASE = "https://api.football-data.org/v4";

function colorFor(name: string): string {
  const palette = [
    "#16E07A", "#0A2540", "#C8102E", "#034694", "#DA291C",
    "#6CABDD", "#A50044", "#DC052D", "#004170", "#00529F",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

interface FdTeam {
  id?: number;
  name?: string;
  shortName?: string;
  tla?: string;
  crest?: string;
}
interface FdRow {
  position: number;
  team: FdTeam;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalDifference: number;
}
interface FdStanding {
  stage?: string;
  type?: string; // TOTAL | HOME | AWAY
  group?: string; // "GROUP_A"
  table: FdRow[];
}

function toTeam(t: FdTeam): Team {
  const name = t.name ?? "TBD";
  return {
    id: t.tla ?? String(t.id ?? name),
    name,
    shortName: t.tla ?? t.shortName ?? name.slice(0, 3).toUpperCase(),
    badgeUrl: t.crest ?? "",
    primaryColor: colorFor(name),
  };
}

const prettyGroup = (g?: string) =>
  g ? g.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Group";

// Last successful standings, kept in module memory so a transient upstream
// error doesn't flip the UI back to demo groups.
let lastGood: { groups: GroupTable[]; ts: number } | null = null;

export async function GET() {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) return NextResponse.json({ live: false, groups: [] });

  try {
    const res = await fetch(`${FD_BASE}/competitions/WC/standings`, {
      headers: { "X-Auth-Token": token },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      if (lastGood) {
        return NextResponse.json({ live: true, groups: lastGood.groups, stale: true });
      }
      return NextResponse.json({ live: false, groups: [], error: res.status });
    }
    const data = (await res.json()) as { standings?: FdStanding[] };
    const groups: GroupTable[] = (data.standings ?? [])
      .filter((s) => s.type === "TOTAL" && s.group)
      .map((s) => ({
        group: prettyGroup(s.group),
        table: s.table.map(
          (r): StandingRow => ({
            position: r.position,
            team: toTeam(r.team),
            played: r.playedGames,
            won: r.won,
            draw: r.draw,
            lost: r.lost,
            goalDifference: r.goalDifference,
            points: r.points,
          }),
        ),
      }));
    if (groups.length > 0) {
      lastGood = { groups, ts: Date.now() };
      return NextResponse.json({ live: true, groups });
    }
    if (lastGood) {
      return NextResponse.json({ live: true, groups: lastGood.groups, stale: true });
    }
    return NextResponse.json({ live: false, groups: [] });
  } catch {
    if (lastGood) {
      return NextResponse.json({ live: true, groups: lastGood.groups, stale: true });
    }
    return NextResponse.json({ live: false, groups: [] });
  }
}
