"use client";

import { motion } from "framer-motion";
import { getBlogs } from "@/lib/data";
import type { BlogPost } from "@/lib/data/types";
import { useLiveData } from "@/hooks/useLiveData";
import { BlogCard } from "@/components/blog/BlogCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { staggerContainer, staggerItem } from "@/components/ui/Reveal";

export default function BlogPage() {
  const posts = useLiveData(() => getBlogs(), [] as BlogPost[], []);
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHeader
        eyebrow="The Blog"
        title="Stories from the stands"
        subtitle="Match analysis, features, opinions and fan culture, with fresh content every day."
      />

      <section className="container-page py-14">
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <BlogCard post={featured} featured />
          </motion.div>
        )}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {rest.map((p) => (
            <motion.div key={p.id} variants={staggerItem}>
              <BlogCard post={p} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
}
