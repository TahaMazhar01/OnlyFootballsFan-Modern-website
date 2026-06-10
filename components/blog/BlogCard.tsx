"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/lib/data/types";
import { relativeTime } from "@/lib/format";

export function BlogCard({
  post,
  featured = false,
}: {
  post: BlogPost;
  featured?: boolean;
}) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="card group flex h-full flex-col overflow-hidden"
    >
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div
          className={`relative overflow-hidden ${featured ? "h-64" : "h-48"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverUrl}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <span className="absolute left-4 top-4 chip bg-white/95 text-navy shadow-soft">
            {post.tag}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3
            className={`font-display font-bold leading-snug text-ink transition-colors group-hover:text-accent-dark ${
              featured ? "text-2xl" : "text-xl"
            }`}
          >
            {post.title}
          </h3>
          <p className="mt-2.5 line-clamp-3 flex-1 text-base text-muted">
            {post.excerpt}
          </p>
          <div className="mt-5 flex items-center justify-between text-sm text-muted">
            <span className="font-semibold text-ink">{post.author}</span>
            <span className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" /> {post.readMinutes} min
              </span>
              <span>{relativeTime(post.publishedAt)}</span>
            </span>
          </div>
          <span className="mt-4 inline-flex items-center gap-1 text-[15px] font-bold text-accent-dark transition-all group-hover:gap-2">
            Read story <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
