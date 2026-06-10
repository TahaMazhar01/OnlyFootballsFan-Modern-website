"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Send } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface FanMsg {
  id: number;
  name: string;
  text: string;
  likes: number;
}

const seed: FanMsg[] = [
  { id: 1, name: "Sam K.", text: "Up the City! We've got this 💙", likes: 42 },
  { id: 2, name: "Reds4Life", text: "Never walk alone. YNWA 🔴", likes: 38 },
  { id: 3, name: "Tactics Tom", text: "That midfield switch is genius. Game on.", likes: 19 },
];

export function FanSupport() {
  const toast = useToast();
  const [msgs, setMsgs] = useState<FanMsg[]>(seed);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setMsgs((m) => [
      { id: Date.now(), name: name.trim() || "Anonymous Fan", text, likes: 0 },
      ...m,
    ]);
    setText("");
    toast("Your support is live! 📣");
  }

  return (
    <div>
      <form onSubmit={submit} className="card p-5">
        <p className="mb-3 font-display text-lg font-bold">Show your support</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="mb-3 w-full rounded-xl border border-line bg-canvas px-4 py-3 text-base outline-none focus:border-accent focus:ring-4 focus:ring-accent/20"
        />
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Back your team…"
            className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-base outline-none focus:border-accent focus:ring-4 focus:ring-accent/20"
          />
          <button type="submit" className="btn-primary shrink-0">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>

      <div className="mt-5 space-y-3">
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card flex items-start justify-between gap-4 p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display font-bold text-accent-dark">
                  {m.name.slice(0, 1).toUpperCase()}
                </span>
                <div>
                  <p className="font-bold text-ink">{m.name}</p>
                  <p className="text-base text-muted">{m.text}</p>
                </div>
              </div>
              <button
                onClick={() =>
                  setMsgs((arr) =>
                    arr.map((x) =>
                      x.id === m.id ? { ...x, likes: x.likes + 1 } : x,
                    ),
                  )
                }
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-muted transition-colors hover:border-live hover:text-live"
              >
                <Heart className="h-4 w-4" /> {m.likes}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
