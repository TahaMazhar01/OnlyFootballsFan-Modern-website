import type {
  Match,
  MatchStatus,
  Poll,
  PollState,
  BlogPost,
  Poster,
  NewsItem,
  Activity,
  ActivityAction,
  ActivityEntity,
  GroupTable,
} from "./types";
import { getDB, notify, subscribe } from "./store";
import { standings as mockStandings } from "./mock";

// ---------------------------------------------------------------------------
// PUBLIC DATA ACCESS LAYER
// The ONLY surface the UI talks to. Today it reads from the local mock store;
// later each function body is swapped for Supabase / API-Football calls and the
// components above stay untouched.
//
// TODO: connect API-Football (free tier) — getLiveMatches / getMatches / getMatch
//       can be backed by API-Football fixtures. Map their response to our `Match`.
// TODO: connect Supabase — getPoll / submitVote / blogs / posters become Supabase
//       queries; submitVote + live updates become Supabase Realtime.
// ---------------------------------------------------------------------------

const delay = (ms = 0) => new Promise((r) => setTimeout(r, ms));

const byKickoff = (a: Match, b: Match) =>
  new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime();

// ----------------------------- Matches ------------------------------------

export async function getMatches(status?: MatchStatus): Promise<Match[]> {
  await delay();
  const all = [...getDB().matches].sort(byKickoff);
  return status ? all.filter((m) => m.status === status) : all;
}

export async function getLiveMatches(): Promise<Match[]> {
  return getMatches("live");
}

export async function getUpcomingMatches(): Promise<Match[]> {
  return getMatches("upcoming");
}

export async function getMatch(id: string): Promise<Match | undefined> {
  await delay();
  return getDB().matches.find((m) => m.id === id);
}

/**
 * Live scores for the Scores page. Tries the server proxy at /api/fixtures
 * (real data when FOOTBALL_DATA_TOKEN is configured); otherwise falls back to
 * the local mock fixtures so the site always renders. The `live` flag lets the
 * UI show whether it's showing real or demo data.
 */
export async function getScores(
  status?: MatchStatus,
): Promise<{ matches: Match[]; live: boolean }> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/fixtures", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { live?: boolean; matches?: Match[] };
        if (data.live && Array.isArray(data.matches) && data.matches.length) {
          const all = [...data.matches].sort(byKickoff);
          return {
            matches: status ? all.filter((m) => m.status === status) : all,
            live: true,
          };
        }
      }
    } catch {
      /* network/API error — fall back to mock below */
    }
  }
  return { matches: await getMatches(status), live: false };
}

/**
 * World Cup group standings. Tries the /api/standings proxy (real groups when
 * the API key is set); otherwise falls back to demo groups so the section
 * always renders.
 */
export async function getStandings(): Promise<{
  groups: GroupTable[];
  live: boolean;
}> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/standings", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as {
          live?: boolean;
          groups?: GroupTable[];
        };
        if (data.live && Array.isArray(data.groups) && data.groups.length) {
          return { groups: data.groups, live: true };
        }
      }
    } catch {
      /* fall back to demo groups */
    }
  }
  return { groups: mockStandings, live: false };
}

// ------------------------------ Polls -------------------------------------

// Voting closes one full day before kickoff. A poll is only truly open if the
// admin hasn't closed it AND we're more than 24h before the match starts.
const POLL_LEAD_MS = 24 * 60 * 60 * 1000; // legacy fallback: close 24h before kickoff

/**
 * The lifecycle state of a poll, driven by its opensAt / closesAt schedule:
 *  - "upcoming": before opensAt (voting hasn't started)
 *  - "open":     between opensAt and closesAt (votable)
 *  - "closed":   after closesAt, OR admin force-closed (isOpen=false) — results
 * Polls created before scheduling existed fall back to: open now, close 24h
 * before kickoff.
 */
export function pollState(poll: Poll): PollState {
  if (!poll.isOpen) return "closed"; // admin master switch off
  const now = Date.now();
  if (poll.opensAt && now < new Date(poll.opensAt).getTime()) return "upcoming";
  let closeMs = poll.closesAt ? new Date(poll.closesAt).getTime() : undefined;
  if (closeMs === undefined) {
    const match = getDB().matches.find((m) => m.id === poll.matchId);
    if (match) closeMs = new Date(match.kickoff).getTime() - POLL_LEAD_MS;
  }
  if (closeMs !== undefined && now >= closeMs) return "closed";
  return "open";
}

export function isPollVotingOpen(poll: Poll): boolean {
  return pollState(poll) === "open";
}

export async function getPoll(matchId: string): Promise<Poll | undefined> {
  await delay();
  return getDB().polls.find((p) => p.matchId === matchId);
}

export async function getPolls(): Promise<Poll[]> {
  await delay();
  return [...getDB().polls];
}

/** Record a vote for a team option and return the updated poll. */
export async function submitVote(
  pollId: string,
  optionTeamId: string,
): Promise<Poll | undefined> {
  await delay(80);
  const poll = getDB().polls.find((p) => p.id === pollId);
  if (!poll) return undefined;
  if (pollState(poll) !== "open") return poll; // not votable
  const opt = poll.options.find((o) => o.teamId === optionTeamId);
  if (opt) opt.votes += 1;
  notify();
  return poll;
}

export async function setPollOpen(
  pollId: string,
  isOpen: boolean,
): Promise<void> {
  const poll = getDB().polls.find((p) => p.id === pollId);
  if (poll) {
    poll.isOpen = isOpen;
    notify();
  }
}

// --------------------------- Club rankings --------------------------------
// Aggregate every vote across all polls, grouped by club, to power the live
// "Fan Power Rankings" leaderboard. Updates as votes come in (incl. the sim).

export interface ClubRanking {
  team: import("./types").Team;
  votes: number;
  matches: number; // how many polls the club appears in
  rank: number;
}

export async function getClubRankings(limit = 6): Promise<ClubRanking[]> {
  await delay();
  const db = getDB();
  const map = new Map<
    string,
    { team: import("./types").Team; votes: number; matches: number }
  >();
  for (const poll of db.polls) {
    const match = db.matches.find((m) => m.id === poll.matchId);
    if (!match) continue;
    for (const opt of poll.options) {
      const team =
        opt.teamId === match.homeTeam.id ? match.homeTeam : match.awayTeam;
      const entry = map.get(team.id) ?? { team, votes: 0, matches: 0 };
      entry.votes += opt.votes;
      entry.matches += 1;
      map.set(team.id, entry);
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.votes - a.votes)
    .slice(0, limit)
    .map((e, i) => ({ ...e, rank: i + 1 }));
}

// ------------------------------ Blogs -------------------------------------

export async function getBlogs(includeDrafts = false): Promise<BlogPost[]> {
  await delay();
  const all = [...getDB().blogs].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  return includeDrafts ? all : all.filter((b) => b.isPublished);
}

export async function getBlog(slug: string): Promise<BlogPost | undefined> {
  await delay();
  return getDB().blogs.find((b) => b.slug === slug);
}

// ----------------------------- Posters ------------------------------------

export async function getPosters(): Promise<Poster[]> {
  await delay();
  return [...getDB().posters].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

// --------------------------- Admin mutations ------------------------------
// Used by the Admin Dashboard. All persist via the store + notify listeners.

const uid = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

// Append an audit-log entry. Callers still invoke notify() afterwards to persist.
function logActivity(
  action: ActivityAction,
  entity: ActivityEntity,
  label: string,
) {
  const log = getDB().activity;
  log.unshift({ id: uid("a"), action, entity, label, ts: new Date().toISOString() });
  if (log.length > 60) log.length = 60; // keep the history bounded
}

export async function getActivity(limit = 20): Promise<Activity[]> {
  await delay();
  return getDB().activity.slice(0, limit);
}

export async function createMatch(
  input: Omit<Match, "id"> & { id?: string },
  pollOpts?: { question?: string; opensAt?: string; closesAt?: string },
): Promise<Match> {
  const db = getDB();
  const match: Match = { ...input, id: input.id ?? uid("m") };
  db.matches.push(match);
  // Auto-create (and schedule) the poll for this match. Defaults: open now,
  // close 24h before kickoff.
  const kickoffMs = new Date(match.kickoff).getTime();
  db.polls.push({
    id: uid("p"),
    matchId: match.id,
    question: pollOpts?.question?.trim() || "Who will win?",
    options: [
      { teamId: match.homeTeam.id, label: match.homeTeam.name, votes: 0 },
      { teamId: match.awayTeam.id, label: match.awayTeam.name, votes: 0 },
    ],
    isOpen: true,
    opensAt: pollOpts?.opensAt || new Date().toISOString(),
    closesAt:
      pollOpts?.closesAt || new Date(kickoffMs - POLL_LEAD_MS).toISOString(),
  });
  logActivity(
    "created",
    "match",
    `${match.homeTeam.shortName} vs ${match.awayTeam.shortName}`,
  );
  notify();
  return match;
}

export async function deleteMatch(id: string): Promise<void> {
  const db = getDB();
  const match = db.matches.find((m) => m.id === id);
  db.matches = db.matches.filter((m) => m.id !== id);
  db.polls = db.polls.filter((p) => p.matchId !== id);
  if (match)
    logActivity(
      "deleted",
      "match",
      `${match.homeTeam.shortName} vs ${match.awayTeam.shortName}`,
    );
  notify();
}

export async function createPoster(
  input: Omit<Poster, "id" | "createdAt"> & { createdAt?: string },
): Promise<Poster> {
  const db = getDB();
  const poster: Poster = {
    ...input,
    id: uid("g"),
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
  db.posters.unshift(poster);
  logActivity("created", "poster", poster.title);
  notify();
  return poster;
}

export async function deletePoster(id: string): Promise<void> {
  const db = getDB();
  const poster = db.posters.find((p) => p.id === id);
  db.posters = db.posters.filter((p) => p.id !== id);
  if (poster) logActivity("deleted", "poster", poster.title);
  notify();
}

export async function createBlog(
  input: Omit<BlogPost, "id" | "publishedAt"> & { publishedAt?: string },
): Promise<BlogPost> {
  const db = getDB();
  const post: BlogPost = {
    ...input,
    id: uid("b"),
    publishedAt: input.publishedAt ?? new Date().toISOString(),
  };
  db.blogs.unshift(post);
  logActivity("created", "blog", post.title);
  notify();
  return post;
}

export async function updateBlog(
  id: string,
  patch: Partial<BlogPost>,
): Promise<void> {
  const post = getDB().blogs.find((b) => b.id === id);
  if (post) {
    Object.assign(post, patch);
    notify();
  }
}

export async function deleteBlog(id: string): Promise<void> {
  const db = getDB();
  const post = db.blogs.find((b) => b.id === id);
  db.blogs = db.blogs.filter((b) => b.id !== id);
  if (post) logActivity("deleted", "blog", post.title);
  notify();
}

// ------------------------------ News --------------------------------------

export async function getNews(limit?: number): Promise<NewsItem[]> {
  await delay();
  const all = [...getDB().news].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  return limit ? all.slice(0, limit) : all;
}

export async function createNews(
  input: Omit<NewsItem, "id" | "publishedAt"> & { publishedAt?: string },
): Promise<NewsItem> {
  const db = getDB();
  const item: NewsItem = {
    ...input,
    id: uid("n"),
    publishedAt: input.publishedAt ?? new Date().toISOString(),
  };
  db.news.unshift(item);
  logActivity("created", "news", item.title);
  notify();
  return item;
}

export async function deleteNews(id: string): Promise<void> {
  const db = getDB();
  const item = db.news.find((n) => n.id === id);
  db.news = db.news.filter((n) => n.id !== id);
  if (item) logActivity("deleted", "news", item.title);
  notify();
}

// --------------------------- Realtime sim ---------------------------------
// Nudges vote counts on open polls so the live bars visibly move in the demo.
// TODO: connect Supabase Realtime — replace this with channel subscriptions.

export function startLiveVoteSimulation(intervalMs = 3500): () => void {
  if (typeof window === "undefined") return () => {};
  const timer = window.setInterval(() => {
    const open = getDB().polls.filter((p) => pollState(p) === "open");
    if (!open.length) return;
    const poll = open[Math.floor(Math.random() * open.length)];
    const opt =
      poll.options[Math.floor(Math.random() * poll.options.length)];
    opt.votes += Math.floor(Math.random() * 7) + 1;
    notify();
  }, intervalMs);
  return () => window.clearInterval(timer);
}

/**
 * Dedicated live-scores heartbeat. Independent of the poll simulation, it fires
 * the store's notify() on an interval so every getScores() consumer re-fetches
 * the /api/fixtures proxy (server-cached ~30s). This guarantees live scores keep
 * updating during a match even when no polls are open. Pauses while the tab is
 * hidden to save bandwidth.
 */
export function startScoresRefresh(intervalMs = 25000): () => void {
  if (typeof window === "undefined") return () => {};
  const tick = () => {
    if (document.hidden) return;
    notify();
  };
  const timer = window.setInterval(tick, intervalMs);
  return () => window.clearInterval(timer);
}

export { subscribe };
export * from "./types";
