"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Trash2,
  PencilLine,
  History,
  type LucideIcon,
} from "lucide-react";
import { getActivity } from "@/lib/data";
import type { Activity } from "@/lib/data/types";
import { useLiveData } from "@/hooks/useLiveData";
import { relativeTime } from "@/lib/format";

const actionMeta: Record<
  Activity["action"],
  { icon: LucideIcon; color: string; verb: string }
> = {
  created: { icon: PlusCircle, color: "text-accent-dark bg-accent-soft", verb: "Added" },
  deleted: { icon: Trash2, color: "text-live bg-live/10", verb: "Deleted" },
  updated: { icon: PencilLine, color: "text-navy bg-navy/10", verb: "Updated" },
};

export function ActivityLog() {
  const activity = useLiveData(() => getActivity(40), [] as Activity[], []);

  return (
    <div className="card p-5 sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy text-white">
          <History className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-xl leading-tight">Activity log</h3>
          <p className="text-sm text-muted">
            A record of everything added or deleted on the site.
          </p>
        </div>
      </div>

      {activity.length === 0 ? (
        <p className="py-12 text-center text-base text-muted">
          No changes yet. Add or delete something and it shows up here.
        </p>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {activity.map((a) => {
              const m = actionMeta[a.action];
              const Icon = m.icon;
              return (
                <motion.li
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-canvas/60 p-3"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${m.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-ink">
                      {m.verb}{" "}
                      <span className="font-normal text-muted">{a.entity}</span>{" "}
                      — {a.label}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm text-muted">
                    {relativeTime(a.ts)}
                  </span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
