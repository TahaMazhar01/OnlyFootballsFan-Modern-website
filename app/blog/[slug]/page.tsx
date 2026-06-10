"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { getBlog, getBlogs } from "@/lib/data";
import type { BlogPost } from "@/lib/data/types";
import { useLiveData } from "@/hooks/useLiveData";
import { Markdown } from "@/components/blog/Markdown";
import { BlogCard } from "@/components/blog/BlogCard";
import { relativeTime } from "@/lib/format";

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const post = useLiveData(() => getBlog(slug), undefined, [slug]);
  const more = useLiveData(() => getBlogs(), [] as BlogPost[], []);

  if (post === undefined) {
    return (
      <div className="container-page py-24">
        <div className="mx-auto h-96 max-w-3xl animate-pulse rounded-3xl bg-line/60" />
      </div>
    );
  }
  if (!post) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-3xl">Story not found</h1>
        <Link href="/blog" className="btn-ghost mt-6">
          Back to blog
        </Link>
      </div>
    );
  }

  const related = more.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article>
      {/* Cover */}
      <div className="relative h-[44vh] min-h-[320px] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.coverUrl} alt={post.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/20" />
        <div className="container-page absolute inset-x-0 bottom-0">
          <div className="max-w-3xl pb-10 text-white">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-base font-semibold text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back to blog
            </Link>
            <span className="chip mt-5 bg-accent text-navy">{post.tag}</span>
            <h1 className="mt-4 text-3xl leading-tight sm:text-5xl">
              {post.title}
            </h1>
            <div className="mt-5 flex items-center gap-4 text-base text-white/80">
              <span className="font-bold text-white">{post.author}</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" /> {post.readMinutes} min read
              </span>
              <span>{relativeTime(post.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container-page py-12"
      >
        <div className="mx-auto max-w-3xl">
          <p className="text-xl font-medium text-muted">{post.excerpt}</p>
          <hr className="my-8 border-line" />
          <Markdown source={post.body} />
        </div>
      </motion.div>

      {related.length > 0 && (
        <section className="container-page pb-20">
          <h2 className="mb-8 text-2xl sm:text-3xl">Keep reading</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
