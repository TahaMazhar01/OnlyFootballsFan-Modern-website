"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { useToast } from "@/components/ui/Toast";

export function Newsletter() {
  const toast = useToast();
  const [email, setEmail] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    toast("You're in! Matchday polls incoming. 📨");
    setEmail("");
  }

  return (
    <section className="container-page py-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-4xl border border-line bg-surface p-8 text-center shadow-soft sm:p-14">
          <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-navy/10 blur-3xl" />
          <div className="relative">
            <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-gradient text-navy shadow-glow">
              <Mail className="h-7 w-7" />
            </span>
            <h2 className="mx-auto max-w-2xl text-3xl sm:text-4xl">
              Never miss a matchday poll
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-muted">
              Join 50,000+ fans getting live polls, posters and fresh stories
              delivered every morning. No spam, just football.
            </p>
            <form
              onSubmit={onSubmit}
              className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-full border border-line bg-canvas px-5 py-3.5 text-lg outline-none focus:border-accent focus:ring-4 focus:ring-accent/20"
              />
              <button type="submit" className="btn-primary shrink-0 text-lg">
                Subscribe <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
