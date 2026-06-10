"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface Item {
  id: string;
}

/**
 * Reusable "manage existing items" list with a confirm-to-delete action.
 * Used for blogs, news and media in the admin so anything posted can also be
 * removed. Deletions are recorded in the activity log by the data layer.
 */
export function ManageList<T extends Item>({
  heading,
  items,
  getTitle,
  getMeta,
  getThumb,
  onDelete,
  emptyText = "Nothing here yet.",
}: {
  heading: string;
  items: T[];
  getTitle: (item: T) => string;
  getMeta?: (item: T) => string;
  getThumb?: (item: T) => string | undefined;
  onDelete: (id: string) => Promise<void> | void;
  emptyText?: string;
}) {
  const toast = useToast();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function remove(item: T) {
    await onDelete(item.id);
    setConfirmId(null);
    toast(`Deleted “${getTitle(item)}” 🗑️`);
  }

  return (
    <div className="card mt-6 p-5 sm:p-6">
      <h3 className="mb-4 text-lg">
        {heading}{" "}
        <span className="text-base font-semibold text-muted">
          ({items.length})
        </span>
      </h3>
      {items.length === 0 ? (
        <p className="py-8 text-center text-base text-muted">{emptyText}</p>
      ) : (
        <ul className="space-y-2.5">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const thumb = getThumb?.(item);
              const confirming = confirmId === item.id;
              return (
                <motion.li
                  key={item.id}
                  layout
                  exit={{ opacity: 0, x: -16, height: 0 }}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-canvas/60 p-2.5"
                >
                  {thumb && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt=""
                      className="h-12 w-16 shrink-0 rounded-xl object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-[15px] font-bold text-ink">
                      {getTitle(item)}
                    </p>
                    {getMeta && (
                      <p className="truncate text-sm text-muted">
                        {getMeta(item)}
                      </p>
                    )}
                  </div>
                  {confirming ? (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => remove(item)}
                        className="rounded-full bg-live px-3.5 py-2 text-sm font-semibold text-white hover:opacity-90"
                      >
                        Confirm delete
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="rounded-full border border-line px-3.5 py-2 text-sm font-semibold text-muted hover:text-ink"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(item.id)}
                      aria-label={`Delete ${getTitle(item)}`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-muted transition-colors hover:border-live/40 hover:bg-live/10 hover:text-live"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
