"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getScores, getBlogs, getNews } from "@/lib/data";
import type { Match, BlogPost, NewsItem } from "@/lib/data/types";
import { useLiveData } from "@/hooks/useLiveData";
import { Hero } from "@/components/home/Hero";
import { LiveNow } from "@/components/home/LiveNow";
import { LiveStrip } from "@/components/match/LiveStrip";
import { LogoMarquee } from "@/components/home/LogoMarquee";
import { Stats } from "@/components/home/Stats";
import { Newsletter } from "@/components/home/Newsletter";
import { FanPowerRankings } from "@/components/home/FanPowerRankings";
import { MatchCard } from "@/components/match/MatchCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { NewsCard } from "@/components/news/NewsCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, StaggerReveal } from "@/components/ui/Reveal";

export default function HomePage() {
  const matches = useLiveData(
    async () => {
      const { matches: all } = await getScores();
      return [
        ...all.filter((m) => m.status === "live"),
        ...all.filter((m) => m.status === "upcoming"),
      ].slice(0, 4);
    },
    [] as Match[],
    [],
  );
  const blogs = useLiveData(async () => (await getBlogs()).slice(0, 3), [] as BlogPost[], []);
  const news = useLiveData(async () => (await getNews(4)), [] as NewsItem[], []);

  return (
    <>
      <Hero />
      <LiveNow />
      <LiveStrip />
      <LogoMarquee />

      {/* Today's matches + live polls */}
      <section className="cv-auto container-page py-16">
        <SectionHeading
          eyebrow="Matchday"
          title="Live &amp; upcoming scores"
          subtitle="Real-time scores and the fixtures on their way. Tap a match for the full detail."
          action={
            <Link href="/matches" className="btn-ghost">
              All scores <ArrowRight className="h-5 w-5" />
            </Link>
          }
        />
        <StaggerReveal className="mt-10 grid gap-6 md:grid-cols-2">
          {matches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </StaggerReveal>
      </section>

      {/* Latest news — feed of breaking stories, transfers & match reports */}
      <section className="cv-auto container-page py-16">
        <SectionHeading
          eyebrow="News"
          title="The latest from football"
          subtitle="Breaking stories, transfers and match reports, fresh from the grounds."
          action={
            <Link href="/news" className="btn-ghost">
              All news <ArrowRight className="h-5 w-5" />
            </Link>
          }
        />
        {news.length > 0 && (
          <div className="mt-10 space-y-6">
            <Reveal>
              <NewsCard item={news[0]} featured />
            </Reveal>
            <StaggerReveal className="grid gap-6 sm:grid-cols-3">
              {news.slice(1, 4).map((n) => (
                <NewsCard key={n.id} item={n} />
              ))}
            </StaggerReveal>
          </div>
        )}
      </section>

      <Stats />

      {/* Fan Power Rankings — live leaderboard of clubs by total fan votes */}
      <section className="cv-auto container-page py-16">
        <SectionHeading
          eyebrow="Fan pulse"
          title="Who the fans are backing"
          subtitle="Every vote across every poll, added up live. Watch your club climb the rankings in real time."
          action={
            <Link href="/polls" className="btn-ghost">
              Cast your vote <ArrowRight className="h-5 w-5" />
            </Link>
          }
        />
        <Reveal className="mt-10">
          <FanPowerRankings />
        </Reveal>
      </section>

      {/* Latest blogs */}
      <section className="cv-auto container-page py-16">
        <SectionHeading
          eyebrow="Fresh content"
          title="Latest from the blog"
          subtitle="Analysis, features and fan stories, updated daily."
          action={
            <Link href="/blog" className="btn-ghost">
              All stories <ArrowRight className="h-5 w-5" />
            </Link>
          }
        />
        <StaggerReveal className="mt-10 grid gap-6 md:grid-cols-3">
          {blogs.map((b) => (
            <BlogCard key={b.id} post={b} />
          ))}
        </StaggerReveal>
      </section>

      <Newsletter />

      {/* CTA band */}
      <Reveal className="container-page pb-24">
        <div className="flex flex-col items-center justify-between gap-6 overflow-hidden rounded-4xl bg-accent-gradient p-10 text-center shadow-glow sm:flex-row sm:text-left">
          <div>
            <h2 className="text-3xl text-navy sm:text-4xl">
              Your team needs your voice
            </h2>
            <p className="mt-2 max-w-xl text-lg text-navy/80">
              Jump into a live match and cast your vote — every tap moves the
              bars and backs your side in real time.
            </p>
          </div>
          <Link href="/polls" className="btn-navy shrink-0 text-lg">
            Cast your vote <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </Reveal>
    </>
  );
}
