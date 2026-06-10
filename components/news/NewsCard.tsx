"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import type { NewsItem } from "@/lib/data/types";
import { relativeTime } from "@/lib/format";

const categoryColor: Record<string, string> = {
  Breaking: "bg-live/10 text-live ring-live/30",
  Transfers: "bg-accent-soft text-accent-dark ring-accent/30",
  "Match Report": "bg-navy/10 text-navy ring-navy/20",
  "Fan Pulse": "bg-accent-soft text-accent-dark ring-accent/30",
  Preview: "bg-navy/10 text-navy ring-navy/20",
  Opinion: "bg-navy/10 text-navy ring-navy/20",
};

export function NewsCard({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
  const chip = categoryColor[item.category] ?? "bg-line text-muted ring-line";
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className={`card group flex h-full flex-col overflow-hidden ${
        featured ? "sm:flex-row" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          featured ? "sm:w-1/2" : "aspect-[16/10]"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            featured ? "min-h-[240px]" : ""
          }`}
        />
        <span
          className={`chip absolute left-4 top-4 ring-1 ${chip}`}
        >
          {item.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3
          className={`font-display font-bold leading-snug text-ink ${
            featured ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {item.title}
        </h3>
        <p className="mt-2 flex-1 text-base text-muted">{item.summary}</p>
        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {relativeTime(item.publishedAt)}
          </span>
          <span className="flex items-center gap-1 font-semibold text-accent-dark">
            {item.source} <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
