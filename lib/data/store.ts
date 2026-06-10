import type { Match, Poll, BlogPost, Poster, NewsItem, Activity } from "./types";
import {
  matches as seedMatches,
  polls as seedPolls,
  blogs as seedBlogs,
  posters as seedPosters,
  news as seedNews,
} from "./mock";

// ---------------------------------------------------------------------------
// LOCAL STORE
// A tiny in-memory database seeded from mock data and persisted to
// localStorage so the Admin Dashboard's changes survive a refresh during the
// prototype. Everything here is swappable.
// TODO: connect Supabase — replace this store with Supabase queries/mutations
//       and Supabase Realtime subscriptions (no UI changes required).
// ---------------------------------------------------------------------------

const STORAGE_KEY = "off:db:v3";

export interface DB {
  matches: Match[];
  polls: Poll[];
  blogs: BlogPost[];
  posters: Poster[];
  news: NewsItem[];
  activity: Activity[];
}

const clone = <T,>(v: T): T =>
  typeof structuredClone === "function"
    ? structuredClone(v)
    : JSON.parse(JSON.stringify(v));

function seed(): DB {
  return {
    matches: clone(seedMatches),
    polls: clone(seedPolls),
    blogs: clone(seedBlogs),
    posters: clone(seedPosters),
    news: clone(seedNews),
    activity: [],
  };
}

let db: DB = seed();
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) db = JSON.parse(raw) as DB;
  } catch {
    /* ignore corrupt storage, fall back to seed */
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* storage full / unavailable — non-fatal in prototype */
  }
}

export function notify() {
  persist();
  listeners.forEach((l) => l());
}

/** Subscribe to any store change (used to mimic realtime in the prototype). */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDB(): DB {
  hydrate();
  return db;
}

export function resetDB() {
  db = seed();
  notify();
}
