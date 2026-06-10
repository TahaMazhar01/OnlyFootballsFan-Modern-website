import type {
  Team,
  Match,
  Poll,
  BlogPost,
  Poster,
  NewsItem,
} from "./types";

// ---------------------------------------------------------------------------
// MOCK SEED DATA
// Realistic football fixtures, polls, blogs and posters for the design-first
// prototype. Real services (Supabase + API-Football) will replace these later;
// the shapes here match lib/data/types.ts exactly so nothing in the UI changes.
// ---------------------------------------------------------------------------

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const teams: Record<string, Team> = {
  mci: { id: "mci", name: "Manchester City", shortName: "MCI", badgeUrl: "", primaryColor: "#6CABDD" },
  ars: { id: "ars", name: "Arsenal", shortName: "ARS", badgeUrl: "", primaryColor: "#EF0107" },
  liv: { id: "liv", name: "Liverpool", shortName: "LIV", badgeUrl: "", primaryColor: "#C8102E" },
  che: { id: "che", name: "Chelsea", shortName: "CHE", badgeUrl: "", primaryColor: "#034694" },
  mun: { id: "mun", name: "Manchester United", shortName: "MUN", badgeUrl: "", primaryColor: "#DA291C" },
  tot: { id: "tot", name: "Tottenham Hotspur", shortName: "TOT", badgeUrl: "", primaryColor: "#132257" },
  rma: { id: "rma", name: "Real Madrid", shortName: "RMA", badgeUrl: "", primaryColor: "#00529F" },
  fcb: { id: "fcb", name: "FC Barcelona", shortName: "BAR", badgeUrl: "", primaryColor: "#A50044" },
  bay: { id: "bay", name: "Bayern Munich", shortName: "BAY", badgeUrl: "", primaryColor: "#DC052D" },
  psg: { id: "psg", name: "Paris Saint-Germain", shortName: "PSG", badgeUrl: "", primaryColor: "#004170" },
  int: { id: "int", name: "Inter Milan", shortName: "INT", badgeUrl: "", primaryColor: "#0068A8" },
  juv: { id: "juv", name: "Juventus", shortName: "JUV", badgeUrl: "", primaryColor: "#111111" },
};

// Build kickoff times relative to "now" so Live / Upcoming / Finished stay realistic.
const now = Date.now();
const hours = (h: number) => new Date(now + h * 3600_000).toISOString();

export const matches: Match[] = [
  {
    id: "m1",
    homeTeam: teams.mci,
    awayTeam: teams.liv,
    kickoff: hours(-0.8),
    status: "live",
    competition: "Premier League",
    venue: "Etihad Stadium",
    posterUrl: img("1574629810360-7efbbe195018"),
    score: { home: 1, away: 1 },
    minute: 67,
  },
  {
    id: "m2",
    homeTeam: teams.rma,
    awayTeam: teams.fcb,
    kickoff: hours(-0.4),
    status: "live",
    competition: "LaLiga · El Clásico",
    venue: "Santiago Bernabéu",
    posterUrl: img("1522778119026-d647f0596c20"),
    score: { home: 2, away: 0 },
    minute: 34,
  },
  {
    id: "m3",
    homeTeam: teams.ars,
    awayTeam: teams.che,
    kickoff: hours(3),
    status: "upcoming",
    competition: "Premier League",
    venue: "Emirates Stadium",
    posterUrl: img("1551958219-acbc608c6377"),
  },
  {
    id: "m4",
    homeTeam: teams.bay,
    awayTeam: teams.psg,
    kickoff: hours(6),
    status: "upcoming",
    competition: "UEFA Champions League",
    venue: "Allianz Arena",
    posterUrl: img("1577223625816-7546f13df25d"),
  },
  {
    id: "m5",
    homeTeam: teams.mun,
    awayTeam: teams.tot,
    kickoff: hours(28),
    status: "upcoming",
    competition: "Premier League",
    venue: "Old Trafford",
    posterUrl: img("1489944440615-453fc2b6a9a9"),
  },
  {
    id: "m6",
    homeTeam: teams.int,
    awayTeam: teams.juv,
    kickoff: hours(-26),
    status: "finished",
    competition: "Serie A · Derby d'Italia",
    venue: "San Siro",
    posterUrl: img("1431324155629-1a6deb1dec8d"),
    score: { home: 3, away: 2 },
  },
  {
    id: "m7",
    homeTeam: teams.che,
    awayTeam: teams.liv,
    kickoff: hours(-50),
    status: "finished",
    competition: "Premier League",
    venue: "Stamford Bridge",
    posterUrl: img("1508098682722-e99c43a406b2"),
    score: { home: 0, away: 2 },
  },
];

export const polls: Poll[] = matches.map((m, i) => {
  const seed = [
    [5210, 4880],
    [6120, 3010],
    [3950, 4120],
    [4400, 3870],
    [5800, 2100],
    [2980, 3340],
    [1900, 4600],
  ][i] ?? [3000, 3000];
  return {
    id: `p${i + 1}`,
    matchId: m.id,
    question: "Who will win?",
    options: [
      { teamId: m.homeTeam.id, label: m.homeTeam.name, votes: seed[0] },
      { teamId: m.awayTeam.id, label: m.awayTeam.name, votes: seed[1] },
    ],
    isOpen: m.status !== "finished",
  };
});

export const blogs: BlogPost[] = [
  {
    id: "b1",
    slug: "the-derby-that-stopped-a-city",
    title: "The Derby That Stopped a City",
    excerpt:
      "Ninety minutes of pure noise. We break down the tactical chess match that left two fanbases breathless and a title race wide open.",
    body: `## A night under the lights\n\nThere are matches, and then there are *derbies*. From the first whistle, the tempo was relentless, with every tackle met with a roar and every pass dissected by 50,000 voices.\n\n### The turning point\n\nThe manager's decision to switch to a back three at half time changed everything. Suddenly the midfield had an extra man, and the game tilted.\n\n> "You could feel the stadium breathe with every attack." (reported by our writer on the ground)\n\nWhat happens next in the title race is anyone's guess. But one thing is certain: nights like these are why we fell in love with the game.`,
    coverUrl: img("1574629810360-7efbbe195018"),
    author: "Maya Okafor",
    readMinutes: 4,
    tag: "Match Analysis",
    publishedAt: hours(-12),
    isPublished: true,
  },
  {
    id: "b2",
    slug: "five-wonderkids-to-watch-this-season",
    title: "Five Wonderkids to Watch This Season",
    excerpt:
      "From a 17-year-old winger tearing up the wing to a ball-playing keeper redefining the position, meet the teens about to take over.",
    body: `## The next generation is here\n\nEvery season produces a handful of names that make you sit up. This year, the talent pool feels deeper than ever.\n\n1. **The winger**: pace, trickery, and an end product beyond his years.\n2. **The metronome**: a midfielder who sees three passes ahead.\n3. **The keeper**: comfortable with the ball at his feet under pressure.\n\nKeep these names in your group chat. You'll be bragging that you knew them first.`,
    coverUrl: img("1551958219-acbc608c6377"),
    author: "Diego Santos",
    readMinutes: 6,
    tag: "Features",
    publishedAt: hours(-40),
    isPublished: true,
  },
  {
    id: "b3",
    slug: "why-fan-culture-is-the-real-mvp",
    title: "Why Fan Culture Is the Real MVP",
    excerpt:
      "Tifos, chants, and tears of joy. A love letter to the people in the stands who make football the greatest show on earth.",
    body: `## More than a game\n\nStrip away the broadcast graphics and the transfer rumours, and what's left is people. People who travel, sing, and believe.\n\nFan culture isn't a side-show; it *is* the show. The colour, the noise, the belonging. That's the product.\n\nAt OnlyFootballsFan, we built this place for exactly that energy. Vote, argue, celebrate. Your voice counts.`,
    coverUrl: img("1606925797300-0b35e9d1794e"),
    author: "Aisha Bello",
    readMinutes: 3,
    tag: "Opinion",
    publishedAt: hours(-70),
    isPublished: true,
  },
  {
    id: "b4",
    slug: "champions-league-preview-night-of-giants",
    title: "Champions League Preview: Night of Giants",
    excerpt:
      "Two European super-clubs, one knockout tie. Here's everything you need to know before kickoff, along with who our readers are backing.",
    body: `## The big one\n\nWhen these two meet, continents tune in. The history is heavy, the stakes higher.\n\n### Key battle\n\nWatch the duel out wide, as that is where this tie will be won and lost.\n\nCast your vote in the live poll and see where the fans stand in real time.`,
    coverUrl: img("1577223625816-7546f13df25d"),
    author: "Tom Reeves",
    readMinutes: 5,
    tag: "Preview",
    publishedAt: hours(-4),
    isPublished: true,
  },
];

export const posters: Poster[] = [
  { id: "g1", title: "Matchday Atmosphere", caption: "Etihad under the lights", imageUrl: img("1574629810360-7efbbe195018"), createdAt: hours(-2) },
  { id: "g2", title: "El Clásico Night", caption: "Bernabéu electric", imageUrl: img("1522778119026-d647f0596c20"), createdAt: hours(-8) },
  { id: "g3", title: "Into the Net", caption: "The moment it hit", imageUrl: img("1577223625816-7546f13df25d"), createdAt: hours(-20) },
  { id: "g4", title: "Pitch Perfect", caption: "Ready for kickoff", imageUrl: img("1489944440615-453fc2b6a9a9"), createdAt: hours(-30) },
  { id: "g5", title: "Floodlights", caption: "Stadium glow", imageUrl: img("1431324155629-1a6deb1dec8d"), createdAt: hours(-44) },
  { id: "g6", title: "Full Stretch", caption: "Everything on the line", imageUrl: img("1508098682722-e99c43a406b2"), createdAt: hours(-60) },
  { id: "g7", title: "The Faithful", caption: "Fans in full voice", imageUrl: img("1606925797300-0b35e9d1794e"), createdAt: hours(-72) },
  { id: "g8", title: "Solo Run", caption: "Breaking the line", imageUrl: img("1543326727-cf6c39e8f84c"), createdAt: hours(-90) },
];

export const news: NewsItem[] = [
  {
    id: "n1",
    title: "Late winner sends title race to the final day",
    summary:
      "A stoppage-time strike turned the table on its head. Here's what it means for the run-in and who blinks first.",
    imageUrl: img("1574629810360-7efbbe195018"),
    category: "Breaking",
    source: "OnlyFootballsFan",
    publishedAt: hours(-1),
  },
  {
    id: "n2",
    title: "Wonderkid winger linked with record summer move",
    summary:
      "Europe's heavyweights are circling. Fans have already made their feelings clear in our live polls.",
    imageUrl: img("1551958219-acbc608c6377"),
    category: "Transfers",
    source: "OnlyFootballsFan",
    publishedAt: hours(-5),
  },
  {
    id: "n3",
    title: "Tactical breakdown: how the back three changed the game",
    summary:
      "A half-time switch swung the midfield battle. We chalk up the key movements that decided it.",
    imageUrl: img("1508098682722-e99c43a406b2"),
    category: "Match Report",
    source: "OnlyFootballsFan",
    publishedAt: hours(-9),
  },
  {
    id: "n4",
    title: "Fan vote: supporters back a bold lineup change",
    summary:
      "Thousands of you cast a vote ahead of the weekend, and the verdict was emphatic. See the numbers.",
    imageUrl: img("1606925797300-0b35e9d1794e"),
    category: "Fan Pulse",
    source: "OnlyFootballsFan",
    publishedAt: hours(-22),
  },
  {
    id: "n5",
    title: "Derby preview: everything you need before kickoff",
    summary:
      "Form, history and the one battle that will decide it. Plus, where the fans stand right now.",
    imageUrl: img("1431324155629-1a6deb1dec8d"),
    category: "Preview",
    source: "OnlyFootballsFan",
    publishedAt: hours(-30),
  },
];
