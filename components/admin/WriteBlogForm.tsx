"use client";

import { useState } from "react";
import { Eye, PenLine, Send } from "lucide-react";
import { createBlog } from "@/lib/data";
import { Field, inputClass } from "./Field";
import { ImageDropzone } from "./ImageDropzone";
import { Markdown } from "@/components/blog/Markdown";
import { useToast } from "@/components/ui/Toast";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const wordsPerMin = 200;

export function WriteBlogForm({ onDone }: { onDone?: () => void }) {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("Features");
  const [author, setAuthor] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("## Start writing…\n\nShare your take on the game. Use **bold** for emphasis.");
  const [cover, setCover] = useState("");
  const [publish, setPublish] = useState(true);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast("Give your story a title", "info");
      return;
    }
    setSaving(true);
    const readMinutes = Math.max(1, Math.round(body.split(/\s+/).length / wordsPerMin));
    await createBlog({
      slug: slugify(title) || `post-${Date.now()}`,
      title,
      tag,
      author: author || "OnlyFootballsFan",
      excerpt: excerpt || body.slice(0, 140).replace(/[#>*]/g, ""),
      body,
      coverUrl: cover || "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=70",
      readMinutes,
      isPublished: publish,
    });
    setSaving(false);
    toast(publish ? "Story published! 📝" : "Draft saved 💾");
    onDone?.();
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-2">
      {/* Left: inputs */}
      <div className="space-y-5">
        <Field label="Title">
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your headline" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <select className={inputClass} value={tag} onChange={(e) => setTag(e.target.value)}>
              {["Features", "Match Analysis", "Opinion", "Preview", "News"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Author">
            <input className={inputClass} value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your name" />
          </Field>
        </div>
        <Field label="Excerpt" hint="One or two lines that tease the story.">
          <textarea className={`${inputClass} min-h-[80px] resize-none`} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </Field>
        <Field label="Cover image">
          <ImageDropzone value={cover} onChange={setCover} label="Upload cover" />
        </Field>
      </div>

      {/* Right: editor + preview */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setTab("write")} className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ${tab === "write" ? "bg-navy text-white" : "border border-line text-muted"}`}>
            <PenLine className="h-4 w-4" /> Write
          </button>
          <button type="button" onClick={() => setTab("preview")} className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ${tab === "preview" ? "bg-navy text-white" : "border border-line text-muted"}`}>
            <Eye className="h-4 w-4" /> Preview
          </button>
        </div>

        {tab === "write" ? (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={`${inputClass} min-h-[320px] font-mono text-sm leading-relaxed`}
            placeholder="Write your story… use ## for headings, - for lists, **bold**"
          />
        ) : (
          <div className="min-h-[320px] rounded-xl border border-line bg-surface p-5">
            <Markdown source={body} />
          </div>
        )}

        <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-line bg-canvas p-4">
          <span>
            <span className="block font-display font-bold text-ink">
              {publish ? "Publish now" : "Save as draft"}
            </span>
            <span className="text-sm text-muted">
              {publish ? "Visible on the blog immediately" : "Hidden until you publish"}
            </span>
          </span>
          <button
            type="button"
            onClick={() => setPublish((p) => !p)}
            className={`relative h-8 w-14 rounded-full transition-colors ${publish ? "bg-accent" : "bg-line"}`}
            aria-pressed={publish}
          >
            <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${publish ? "left-7" : "left-1"}`} />
          </button>
        </label>

        <button type="submit" disabled={saving} className="btn-primary w-full text-lg">
          <Send className="h-5 w-5" /> {saving ? "Saving…" : publish ? "Publish story" : "Save draft"}
        </button>
      </div>
    </form>
  );
}
