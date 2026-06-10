# OnlyFootballsFan ⚽🔥

A modern, animated **football-fan community** web app. Fans see live & upcoming
matches, **vote to support their team in real-time polls** (animated result bars),
and read fresh daily content — blogs, posters and news. A simple, non-technical
**Admin Dashboard** lets anyone run the site daily without writing code.

This is a **design-first prototype**: a fully styled, animated, responsive
front-end built on realistic **mock data**, architected so real services
(**Supabase** + **API-Football**) plug in later with no UI changes.

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (custom light theme)
- **Framer Motion** (animations, transitions, live poll bars, counters)
- **lucide-react** (icons)
- Mock data in typed TS + a single `/lib/data` access layer

## Design

- **Light theme.** Canvas `#F8FAFC`, ink `#0B1120`, accent **electric green `#16E07A`**,
  depth navy `#0A2540`.
- **Fonts:** headings **Sora** (chunky/sporty), body **Inter** (17–19px, high readability).
- Bento grids, asymmetric hero, sticky live strip, glassmorphism nav, soft shadows,
  scroll-reveal, hover lifts, micro-interactions. Mobile-first & accessible.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

> **Note on `npm run dev` inside automated preview/headless harnesses:** Next.js dev
> keeps a persistent Hot-Module-Reload socket open, so some headless preview tools
> (which wait for "network idle") can reload the page in a loop. This does **not**
> happen in a normal browser. If you ever hit it in tooling, use `npm run build && npm run start`.

---

## Pages / routes

| Route | What it is |
|---|---|
| `/` | Animated hero, sticky **LIVE NOW** strip, today's matches + live polls, posters, latest blogs, animated stat counters, newsletter CTA |
| `/matches` | All matches, filter Live / Upcoming / Finished, each card has a live poll |
| `/matches/[id]` | Match centre: big header, full live poll, match info, related posters, fan-support wall |
| `/blog` + `/blog/[slug]` | Blog list (featured + grid) and article with cover + markdown body |
| `/gallery` | Masonry posters with hover zoom + lightbox |
| `/about` | Brand page |
| `/admin` | Non-technical dashboard: login → Add Match, Upload Poster, Write Blog, Manage Polls |

The **live feel** is simulated: a timer nudges open-poll vote counts every couple of
seconds (`startLiveVoteSimulation`), and the UI re-renders via a tiny store
subscription so the bars visibly move.

---

## Where the mock data lives

```
lib/data/
  types.ts     # Team, Match, Poll, Vote, BlogPost, Poster (typed domain model)
  mock.ts      # seed data: teams, fixtures, polls, blogs, posters
  store.ts     # in-memory DB seeded from mock + persisted to localStorage
  index.ts     # THE public data API the UI calls (getLiveMatches, getPoll, submitVote, …)
hooks/useLiveData.ts   # subscribes to the store so polls update "live"
```

**Golden rule:** UI components only ever import from `@/lib/data`. Swapping in real
services means changing function bodies in `lib/data/*` — **not the components**.

---

## TODO: connect real services (the exact swap points)

All marked in code with `// TODO: connect Supabase` / `// TODO: connect API-Football`.

### Supabase (DB + Auth + Realtime + Storage) — replaces the local store
- `lib/data/store.ts` → replace the localStorage DB with Supabase tables
  (`teams, matches, polls, votes, blog_posts, posters`).
- `lib/data/index.ts`
  - `getMatches / getMatch / getPolls / getPoll / getBlogs / getPosters` → Supabase `select`s.
  - `submitVote`, `createMatch`, `createPoster`, `createBlog`, `updateBlog`, `setPollOpen`,
    delete functions → Supabase `insert/update/delete`.
  - `startLiveVoteSimulation` → **delete it**; subscribe to **Supabase Realtime**
    channels on `votes`/`polls` instead (the `subscribe()` plumbing already exists).
- `components/admin/ImageDropzone.tsx` → upload the `File` to **Supabase Storage**,
  store the public URL instead of a data URL.
- `app/admin/page.tsx` `LoginScreen` → swap mock auth for **Supabase Auth**.

### API-Football (free tier) — replaces fixture sourcing
- `lib/data/index.ts` `getMatches / getLiveMatches / getMatch` → back with API-Football
  fixtures; map their response onto our `Match` type.
- `components/admin/AddMatchForm.tsx` → "auto-fill from API-Football" (teams, kickoff,
  live status, scores) instead of manual entry.

---

## Recommended free tools for the next phase

| Tool | Free tier | Replaces in this prototype |
|---|---|---|
| **[Supabase](https://supabase.com)** | Postgres DB, Auth, Realtime, Storage | The whole `lib/data/store.ts`, mock auth, image uploads, and the simulated live updates |
| **[API-Football](https://www.api-football.com/)** | ~100 req/day: fixtures, live scores, teams | The hard-coded fixtures in `lib/data/mock.ts` and manual match entry |
| **[Vercel](https://vercel.com)** | Free Next.js hosting | Local `npm run dev` |

---

## Data model (typed — see `lib/data/types.ts`)

- `Team { id, name, shortName, badgeUrl, primaryColor }`
- `Match { id, homeTeam, awayTeam, kickoff, status, competition, venue, posterUrl?, score?, minute? }`
- `Poll { id, matchId, question, options:[{teamId,label,votes}], isOpen }`
- `Vote { id, pollId, optionId, ts }`
- `BlogPost { id, slug, title, excerpt, body, coverUrl, author, readMinutes, tag, publishedAt, isPublished }`
- `Poster { id, title, caption, imageUrl, createdAt }`

## Admin demo login

Any email/password works (mock auth). Pre-filled with
`admin@onlyfootballsfan.com` / `football`.
