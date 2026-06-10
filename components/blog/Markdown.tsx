import { Fragment, type ReactNode } from "react";

/**
 * Minimal markdown renderer for the prototype's blog bodies. Handles headings,
 * blockquotes, ordered/unordered lists, bold (**), and paragraphs — enough for
 * the seed content without pulling in a markdown dependency.
 * TODO: swap for a full markdown/MDX renderer when wiring Supabase content.
 */
export function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushList = (key: number) => {
    if (!list) return;
    const items = list.items.map((it, i) => (
      <li key={i} className="ml-1">
        {inline(it)}
      </li>
    ));
    blocks.push(
      list.ordered ? (
        <ol key={`l${key}`} className="my-4 list-decimal space-y-2 pl-6 text-lg text-ink/90">
          {items}
        </ol>
      ) : (
        <ul key={`l${key}`} className="my-4 list-disc space-y-2 pl-6 text-lg text-ink/90">
          {items}
        </ul>
      ),
    );
    list = null;
  };

  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) {
      flushList(i);
      return;
    }
    if (line.startsWith("### ")) {
      flushList(i);
      blocks.push(<h3 key={i} className="mt-8 text-xl font-bold">{inline(line.slice(4))}</h3>);
    } else if (line.startsWith("## ")) {
      flushList(i);
      blocks.push(<h2 key={i} className="mt-10 text-2xl sm:text-3xl">{inline(line.slice(3))}</h2>);
    } else if (line.startsWith("> ")) {
      flushList(i);
      blocks.push(
        <blockquote key={i} className="my-6 rounded-r-2xl border-l-4 border-accent bg-accent-soft/60 px-5 py-4 text-lg font-medium italic text-ink">
          {inline(line.slice(2))}
        </blockquote>,
      );
    } else if (/^\d+\.\s/.test(line)) {
      if (!list || !list.ordered) {
        flushList(i);
        list = { ordered: true, items: [] };
      }
      list.items.push(line.replace(/^\d+\.\s/, ""));
    } else if (line.startsWith("- ")) {
      if (!list || list.ordered) {
        flushList(i);
        list = { ordered: false, items: [] };
      }
      list.items.push(line.slice(2));
    } else {
      flushList(i);
      blocks.push(<p key={i} className="my-4 text-lg leading-relaxed text-ink/90">{inline(line)}</p>);
    }
  });
  flushList(lines.length);

  return <div>{blocks}</div>;
}

// Bold (**text**) inline parsing.
function inline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-bold text-ink">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{p}</Fragment>
    ),
  );
}
