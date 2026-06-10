"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CalendarPlus,
  Image as ImageIcon,
  PenSquare,
  Newspaper,
  BarChart3,
  History,
  Flame,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { DashboardHome } from "@/components/admin/DashboardHome";
import { AddMatchForm } from "@/components/admin/AddMatchForm";
import { UploadPosterForm } from "@/components/admin/UploadPosterForm";
import { WriteBlogForm } from "@/components/admin/WriteBlogForm";
import { WriteNewsForm } from "@/components/admin/WriteNewsForm";
import { ManagePolls } from "@/components/admin/ManagePolls";
import { ManageList } from "@/components/admin/ManageList";
import { ActivityLog } from "@/components/admin/ActivityLog";
import {
  getBlogs,
  getNews,
  getPosters,
  deleteBlog,
  deleteNews,
  deletePoster,
} from "@/lib/data";
import type { BlogPost, NewsItem, Poster } from "@/lib/data/types";
import { useLiveData } from "@/hooks/useLiveData";
import { relativeTime } from "@/lib/format";

export type AdminView =
  | "home"
  | "match"
  | "poster"
  | "blog"
  | "news"
  | "polls"
  | "activity";

const AUTH_KEY = "off:admin:auth";

const nav: { view: AdminView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { view: "home", label: "Dashboard", icon: LayoutDashboard },
  { view: "match", label: "Add Match", icon: CalendarPlus },
  { view: "news", label: "News", icon: Newspaper },
  { view: "blog", label: "Blog", icon: PenSquare },
  { view: "poster", label: "Media", icon: ImageIcon },
  { view: "polls", label: "Manage Polls", icon: BarChart3 },
  { view: "activity", label: "Activity", icon: History },
];

const titles: Record<AdminView, { title: string; subtitle: string }> = {
  home: { title: "Dashboard", subtitle: "" },
  match: { title: "Add a match", subtitle: "Fill in the details, and a live poll will be created automatically." },
  poster: { title: "Media library", subtitle: "Upload images, and delete any you no longer need." },
  blog: { title: "Blog posts", subtitle: "Write like a message, publish, and delete anytime." },
  news: { title: "News articles", subtitle: "Post a story, pick a category, and delete anytime." },
  polls: { title: "Manage polls", subtitle: "See live votes and open or close any poll." },
  activity: { title: "Activity log", subtitle: "Every add and delete, recorded automatically." },
};

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [view, setView] = useState<AdminView>("home");

  // Live lists for the manage/delete sections.
  const blogs = useLiveData(() => getBlogs(true), [] as BlogPost[], []);
  const news = useLiveData(() => getNews(), [] as NewsItem[], []);
  const posters = useLiveData(() => getPosters(), [] as Poster[], []);

  useEffect(() => {
    setAuthed(
      typeof window !== "undefined" &&
        window.localStorage.getItem(AUTH_KEY) === "1",
    );
  }, []);

  function login() {
    window.localStorage.setItem(AUTH_KEY, "1");
    setAuthed(true);
  }
  function logout() {
    window.localStorage.removeItem(AUTH_KEY);
    setAuthed(false);
    setView("home");
  }

  if (authed === null) return <div className="min-h-screen bg-canvas" />;
  if (!authed) return <LoginScreen onLogin={login} />;

  return (
    <div className="min-h-screen bg-canvas">
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="card p-4">
            <div className="mb-4 flex items-center gap-2 px-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-gradient">
                <Flame className="h-5 w-5 text-navy" strokeWidth={2.5} />
              </span>
              <span className="font-display font-extrabold">Admin</span>
            </div>
            <nav className="flex gap-1 overflow-x-auto lg:flex-col">
              {nav.map((n) => (
                <button
                  key={n.view}
                  onClick={() => setView(n.view)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-left text-base font-semibold transition-colors lg:w-full ${
                    view === n.view
                      ? "bg-navy text-white"
                      : "text-muted hover:bg-canvas hover:text-ink"
                  }`}
                >
                  <n.icon className="h-5 w-5" /> {n.label}
                </button>
              ))}
            </nav>
            <div className="mt-3 border-t border-line pt-3">
              <Link href="/" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-base font-semibold text-muted hover:text-ink">
                <ArrowLeft className="h-5 w-5" /> View site
              </Link>
              <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-base font-semibold text-muted hover:text-live">
                <LogOut className="h-5 w-5" /> Log out
              </button>
            </div>
          </div>
        </aside>

        {/* Content — keyed so each view remounts and replays its enter animation.
            (Avoid AnimatePresence mode="wait" here: a stuck exit would block the swap.) */}
        <div>
          <div>
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {view !== "home" && (
                <div className="mb-7">
                  <h1 className="text-3xl sm:text-4xl">{titles[view].title}</h1>
                  <p className="mt-2 text-lg text-muted">{titles[view].subtitle}</p>
                </div>
              )}
              {view === "home" && <DashboardHome go={setView} />}
              {view === "match" && (
                <div className="card p-6 sm:p-8">
                  <AddMatchForm onDone={() => setView("polls")} />
                </div>
              )}
              {view === "poster" && (
                <>
                  <div className="card p-6 sm:p-8">
                    <UploadPosterForm />
                  </div>
                  <ManageList
                    heading="Your media"
                    items={posters}
                    getTitle={(p) => p.title}
                    getMeta={(p) => p.caption}
                    getThumb={(p) => p.imageUrl}
                    onDelete={deletePoster}
                    emptyText="No media yet. Upload your first image above."
                  />
                </>
              )}
              {view === "blog" && (
                <>
                  <div className="card p-6 sm:p-8">
                    <WriteBlogForm />
                  </div>
                  <ManageList
                    heading="Your blog posts"
                    items={blogs}
                    getTitle={(b) => b.title}
                    getMeta={(b) =>
                      `${b.tag} · ${relativeTime(b.publishedAt)}${b.isPublished ? "" : " · draft"}`
                    }
                    getThumb={(b) => b.coverUrl}
                    onDelete={deleteBlog}
                    emptyText="No blog posts yet. Write your first one above."
                  />
                </>
              )}
              {view === "news" && (
                <>
                  <div className="card p-6 sm:p-8">
                    <WriteNewsForm />
                  </div>
                  <ManageList
                    heading="Your news articles"
                    items={news}
                    getTitle={(n) => n.title}
                    getMeta={(n) => `${n.category} · ${relativeTime(n.publishedAt)}`}
                    getThumb={(n) => n.imageUrl}
                    onDelete={deleteNews}
                    emptyText="No news yet. Publish your first article above."
                  />
                </>
              )}
              {view === "polls" && <ManagePolls />}
              {view === "activity" && <ActivityLog />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("admin@onlyfootballsfan.com");
  const [password, setPassword] = useState("football");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy bg-pitch-gradient px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        className="w-full max-w-md rounded-4xl bg-surface p-8 shadow-lift sm:p-10"
      >
        <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-gradient shadow-glow">
          <Flame className="h-7 w-7 text-navy" strokeWidth={2.5} />
        </span>
        <h1 className="text-3xl">Admin sign in</h1>
        <p className="mt-2 text-base text-muted">
          Manage matches, polls, posters and blogs.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
          }}
          className="mt-7 space-y-4"
        >
          <div>
            <label className="mb-1.5 block font-display text-base font-bold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-base outline-none focus:border-accent focus:ring-4 focus:ring-accent/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-display text-base font-bold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-base outline-none focus:border-accent focus:ring-4 focus:ring-accent/20"
            />
          </div>
          <button type="submit" className="btn-primary w-full text-lg">
            Sign in to dashboard
          </button>
        </form>
        <p className="mt-5 rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent-dark">
          Demo mode: any details work. Mock auth, structured for Supabase Auth later.
        </p>
      </motion.div>
    </div>
  );
}
