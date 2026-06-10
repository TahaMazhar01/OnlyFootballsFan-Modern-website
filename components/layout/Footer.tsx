import Link from "next/link";
import { Flame, AtSign, Hash, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-gradient shadow-glow">
              <Flame className="h-5 w-5 text-navy" strokeWidth={2.5} />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">
              OnlyFootballs<span className="text-accent-dark">Fan</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-base text-muted">
            Where every fan has a voice. Live polls, daily content, one home for
            the football faithful.
          </p>
          <div className="mt-5 flex gap-2">
            {[AtSign, Hash, Send].map((Icon, i) => (
              <span
                key={i}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-muted transition-colors hover:border-accent hover:text-accent-dark"
              >
                <Icon className="h-5 w-5" />
              </span>
            ))}
          </div>
        </div>

        <FooterCol
          title="Explore"
          links={[
            ["Matches", "/matches"],
            ["News", "/news"],
            ["Blog", "/blog"],
            ["About", "/about"],
          ]}
        />
        <FooterCol
          title="Community"
          links={[
            ["Live Polls", "/matches"],
            ["Latest News", "/news"],
            ["Fan Stories", "/blog"],
            ["Our Story", "/about"],
          ]}
        />
        <div>
          <h4 className="text-base font-bold">Stay in the game</h4>
          <p className="mt-3 text-base text-muted">
            Get matchday polls and fresh content in your inbox.
          </p>
          <form className="mt-4 flex gap-2">
            <input
              type="email"
              placeholder="you@email.com"
              className="w-full rounded-full border border-line bg-canvas px-4 py-2.5 text-base outline-none focus:border-accent focus:ring-4 focus:ring-accent/20"
            />
            <button type="submit" className="btn-primary px-5 py-2.5">
              Join
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} OnlyFootballsFan. A fan-made demo.</p>
          <p>Built with Next.js · Framer Motion · Tailwind</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h4 className="text-base font-bold">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="text-base text-muted transition-colors hover:text-accent-dark"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
