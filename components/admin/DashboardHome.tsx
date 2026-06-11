"use client";

import { motion } from "framer-motion";
import {
  CalendarPlus,
  Image as ImageIcon,
  PenSquare,
  BarChart3,
  Activity,
  FileText,
  Radio,
  ArrowRight,
} from "lucide-react";
import { getMatches, getBlogs, getPosters, getPolls, pollState } from "@/lib/data";
import type { Match, BlogPost, Poster, Poll } from "@/lib/data/types";
import { useLiveData } from "@/hooks/useLiveData";
import type { AdminView } from "@/app/admin/page";

const actions: {
  view: AdminView;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { view: "match", title: "Add Match", desc: "Create a fixture & auto-poll", icon: CalendarPlus },
  { view: "poster", title: "Upload Poster", desc: "Add to the gallery", icon: ImageIcon },
  { view: "blog", title: "Write Blog", desc: "Publish a new story", icon: PenSquare },
  { view: "polls", title: "Manage Polls", desc: "Open, close & view votes", icon: BarChart3 },
];

export function DashboardHome({ go }: { go: (v: AdminView) => void }) {
  const matches = useLiveData(() => getMatches(), [] as Match[], []);
  const blogs = useLiveData(() => getBlogs(true), [] as BlogPost[], []);
  const posters = useLiveData(() => getPosters(), [] as Poster[], []);
  const polls = useLiveData(() => getPolls(), [] as Poll[], []);

  const stats = [
    { icon: Activity, label: "Matches", value: matches.length },
    { icon: Radio, label: "Open polls", value: polls.filter((p) => pollState(p) === "open").length },
    { icon: FileText, label: "Blog posts", value: blogs.length },
    { icon: ImageIcon, label: "Posters", value: posters.length },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl">Welcome back 👋</h1>
        <p className="mt-2 text-lg text-muted">
          Run your fan site in minutes with no code needed. Pick a task below.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent-dark">
              <s.icon className="h-5 w-5" />
            </span>
            <p className="font-display text-3xl font-extrabold tabular-nums">{s.value}</p>
            <p className="text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        {actions.map((a) => (
          <motion.button
            key={a.view}
            whileHover={{ y: -4 }}
            onClick={() => go(a.view)}
            className="card group flex items-center gap-4 p-6 text-left transition-shadow hover:shadow-lift"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-gradient text-navy shadow-glow">
              <a.icon className="h-7 w-7" />
            </span>
            <span className="flex-1">
              <span className="font-display text-xl font-bold text-ink">{a.title}</span>
              <span className="block text-base text-muted">{a.desc}</span>
            </span>
            <ArrowRight className="h-6 w-6 text-muted transition-all group-hover:translate-x-1 group-hover:text-accent-dark" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
