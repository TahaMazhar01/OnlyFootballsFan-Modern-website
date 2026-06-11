// Core domain types for OnlyFootballsFan.
// These are intentionally framework-agnostic so the same shapes can be returned
// by mock data today and by Supabase / API-Football later.

export type MatchStatus = "live" | "upcoming" | "finished";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  /** Badge image URL. Mock uses emoji/initials fallback when empty. */
  badgeUrl: string;
  /** Brand color used for badges, poll bars, accents. */
  primaryColor: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  /** ISO timestamp of kickoff. */
  kickoff: string;
  status: MatchStatus;
  competition: string;
  venue: string;
  posterUrl?: string;
  score?: { home: number; away: number };
  /** Live clock label e.g. "67'" — only meaningful when status === 'live'. */
  minute?: number;
}

export interface PollOption {
  teamId: string;
  label: string;
  votes: number;
}

export type PollState = "upcoming" | "open" | "closed";

export interface Poll {
  id: string;
  matchId: string;
  question: string;
  options: PollOption[];
  /** Admin master switch — when false the poll is force-closed regardless of dates. */
  isOpen: boolean;
  /** Voting opens at this time. Before it, the poll is "upcoming". */
  opensAt?: string;
  /** Voting closes at this time. After it, the poll is "closed" (results shown). */
  closesAt?: string;
}

export interface Vote {
  id: string;
  pollId: string;
  optionId: string; // teamId of the chosen option
  ts: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string; // markdown-ish
  coverUrl: string;
  author: string;
  readMinutes: number;
  tag: string;
  publishedAt: string;
  isPublished: boolean;
}

export interface Poster {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string; // "Breaking", "Transfers", "Match Report", "Opinion"...
  source: string; // e.g. "OnlyFootballsFan"
  url?: string;
  publishedAt: string;
}

// Audit trail — every add/delete the admin performs is recorded here so the
// dashboard can show a history of changes.
export type ActivityAction = "created" | "deleted" | "updated";
export type ActivityEntity =
  | "match"
  | "poll"
  | "poster"
  | "blog"
  | "news";

export interface Activity {
  id: string;
  action: ActivityAction;
  entity: ActivityEntity;
  label: string; // human-readable description of what changed
  ts: string;
}
