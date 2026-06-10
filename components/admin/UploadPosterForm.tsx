"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { createPoster } from "@/lib/data";
import { Field, inputClass } from "./Field";
import { ImageDropzone } from "./ImageDropzone";
import { useToast } from "@/components/ui/Toast";

export function UploadPosterForm({ onDone }: { onDone?: () => void }) {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) {
      toast("Add an image first", "info");
      return;
    }
    setSaving(true);
    await createPoster({ title: title || "Untitled", caption, imageUrl: image });
    setSaving(false);
    toast("Poster published to the gallery! 🖼️");
    onDone?.();
    setTitle("");
    setCaption("");
    setImage("");
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-2">
      <Field label="Poster image" hint="Drag a photo or click to browse.">
        <ImageDropzone value={image} onChange={setImage} label="Upload poster" />
      </Field>
      <div className="space-y-5">
        <Field label="Title">
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Matchday Atmosphere" />
        </Field>
        <Field label="Caption">
          <textarea className={`${inputClass} min-h-[120px] resize-none`} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="A short line about this moment…" />
        </Field>
        <button type="submit" disabled={saving} className="btn-primary w-full text-lg">
          <Upload className="h-5 w-5" /> {saving ? "Publishing…" : "Publish poster"}
        </button>
      </div>
    </form>
  );
}
