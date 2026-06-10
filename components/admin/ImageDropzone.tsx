"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

/**
 * Drag-and-drop image picker with live preview. Reads the file as a data URL so
 * the prototype can persist it in localStorage without a backend.
 * TODO: connect Supabase Storage — upload the File and store the public URL.
 */
export function ImageDropzone({
  value,
  onChange,
  label = "Upload image",
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  function handleFile(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className="group relative overflow-hidden rounded-2xl border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="h-52 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-navy/80 text-white hover:bg-navy"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-x-3 bottom-3 rounded-xl bg-white/90 py-2 text-sm font-bold text-navy opacity-0 transition-opacity group-hover:opacity-100"
          >
            Replace image
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`flex h-52 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-center transition-colors ${
            drag
              ? "border-accent bg-accent-soft"
              : "border-line bg-canvas hover:border-accent"
          }`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-dark">
            <ImagePlus className="h-6 w-6" />
          </span>
          <span className="font-display text-base font-bold text-ink">{label}</span>
          <span className="text-sm text-muted">
            Drag & drop or click to browse
          </span>
        </button>
      )}
    </div>
  );
}
