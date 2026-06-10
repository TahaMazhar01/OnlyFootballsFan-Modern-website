"use client";

import { useState } from "react";
import { Newspaper } from "lucide-react";
import { createNews } from "@/lib/data";
import { Field, inputClass } from "./Field";
import { ImageDropzone } from "./ImageDropzone";
import { useToast } from "@/components/ui/Toast";

const CATEGORIES = [
  "Breaking",
  "Transfers",
  "Match Report",
  "Fan Pulse",
  "Preview",
  "Opinion",
];

export function WriteNewsForm({ onDone }: { onDone?: () => void }) {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast("Add a headline first", "info");
      return;
    }
    setSaving(true);
    await createNews({
      title: title.trim(),
      summary: summary.trim() || "Read more on OnlyFootballsFan.",
      category,
      source: "OnlyFootballsFan",
      imageUrl:
        image ||
        "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=70",
    });
    setSaving(false);
    toast("News article published! 📰");
    onDone?.();
    setTitle("");
    setSummary("");
    setCategory(CATEGORIES[0]);
    setImage("");
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-2">
      <Field label="Cover image" hint="Drag a photo or click to browse.">
        <ImageDropzone value={image} onChange={setImage} label="Upload cover" />
      </Field>
      <div className="space-y-5">
        <Field label="Headline">
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Late winner sends title race to the final day"
          />
        </Field>
        <Field label="Category">
          <select
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Summary">
          <textarea
            className={`${inputClass} min-h-[120px] resize-none`}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="A short, punchy summary of the story…"
          />
        </Field>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full text-lg"
        >
          <Newspaper className="h-5 w-5" />{" "}
          {saving ? "Publishing…" : "Publish news"}
        </button>
      </div>
    </form>
  );
}
