"use client";

import { useState } from "react";
import { getNews } from "@/lib/data";
import type { NewsItem } from "@/lib/data/types";
import { useLiveData } from "@/hooks/useLiveData";
import { PageHeader } from "@/components/ui/PageHeader";
import { NewsCard } from "@/components/news/NewsCard";
import { Reveal } from "@/components/ui/Reveal";

export default function NewsPage() {
  const news = useLiveData(() => getNews(), [] as NewsItem[], []);
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(news.map((n) => n.category)))];
  const shown = filter === "All" ? news : news.filter((n) => n.category === filter);
  const [featured, ...rest] = shown;

  return (
    <>
      <PageHeader
        eyebrow="News"
        title="The latest from football"
        subtitle="Breaking stories, transfers, match reports and fan takes, updated fresh every day."
      />

      <section className="container-page pb-8">
        {/* category filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`chip border transition-colors ${
                filter === c
                  ? "border-accent bg-accent-soft text-accent-dark"
                  : "border-line bg-surface text-muted hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {!shown.length ? (
          <p className="py-20 text-center text-lg text-muted">
            No news in this category yet.
          </p>
        ) : (
          <div className="space-y-6">
            {featured && (
              <Reveal>
                <NewsCard item={featured} featured />
              </Reveal>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((n, i) => (
                <Reveal key={n.id} delay={i * 0.05}>
                  <NewsCard item={n} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
