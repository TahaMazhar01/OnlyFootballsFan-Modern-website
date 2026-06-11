"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Trophy,
  Vote,
  Newspaper,
  Info,
  Flame,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

const items: NavItem[] = [
  { name: "Home", url: "/", icon: Home },
  { name: "Scores", url: "/matches", icon: Trophy },
  { name: "Polls", url: "/polls", icon: Vote },
  { name: "News", url: "/news", icon: Newspaper },
  { name: "About", url: "/about", icon: Info },
];

export function Navbar() {
  const pathname = usePathname();
  const isActive = (url: string) =>
    pathname ? (url === "/" ? pathname === "/" : pathname.startsWith(url)) : false;

  return (
    <>
      {/* Brand — fixed top-left */}
      <div className="fixed left-4 top-4 z-50 sm:left-6 sm:top-5">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-full border border-line bg-white/95 py-2 pl-2 pr-3 shadow-soft transition-transform hover:-translate-y-0.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-gradient shadow-glow transition-transform group-hover:scale-110">
            <Flame className="h-5 w-5 text-navy" strokeWidth={2.5} />
          </span>
          <span className="hidden font-display text-lg font-extrabold tracking-tight text-ink lg:inline">
            OnlyFootballs<span className="text-accent-dark">Fan</span>
          </span>
        </Link>
      </div>

      {/* Tubelight pill nav — bottom-center on mobile, top-center on desktop */}
      <div className="fixed bottom-0 left-1/2 z-50 mb-6 -translate-x-1/2 sm:bottom-auto sm:top-5 sm:mb-0">
        <div className="flex items-center gap-1 rounded-full border border-line bg-white/95 px-1.5 py-1.5 shadow-lift">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.url);
            return (
              <Link
                key={item.name}
                href={item.url}
                className={cn(
                  "relative cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                  "text-muted hover:text-accent-dark",
                  active && "text-accent-dark",
                )}
              >
                <span className="hidden md:inline">{item.name}</span>
                <span className="md:hidden">
                  <Icon size={18} strokeWidth={2.5} />
                </span>
                {active && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 -z-10 w-full rounded-full bg-accent/15"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {/* the "tubelight" headlight — bold glow above the active tab */}
                    <div className="absolute -top-2.5 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-t-full bg-accent shadow-glow">
                      <div className="absolute -left-3 -top-2 h-8 w-16 rounded-full bg-accent/45 blur-md" />
                      <div className="absolute -top-1 h-8 w-10 rounded-full bg-accent/40 blur-md" />
                      <div className="absolute left-2 top-0 h-5 w-5 rounded-full bg-accent/50 blur-sm" />
                    </div>
                  </motion.div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
