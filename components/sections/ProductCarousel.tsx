/**
 * PRODUCT ROW AS A SLIDER WITH TABS (runs in the browser)
 * ------------------------------------------------------------------
 * Used by FeaturedProductsSection.tsx when the block's look is "Slider" (dashboard → Homepage → Product row).
 *   - Tabs ("All · Necklaces · Rings…") switch the products shown
 *   - The row scrolls sideways (finger / trackpad / the ← → buttons); the thin line under it shows how far you are
 * The cards themselves are made on the server (ProductCard.tsx) and passed in ready.
 */
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  tabs: { key: string; label: string; cards: ReactNode[] }[];
  labels: { previous: string; next: string };
  /** Arabic pages scroll the other way */
  rtl: boolean;
}

export function ProductCarousel({ tabs, labels, rtl }: Props) {
  const [tab, setTab] = useState(0);
  const row = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState({ start: 0, size: 1, atStart: true, atEnd: true });

  // Where the row is scrolled to → the dark part of the line + which arrows can be used
  const measure = () => {
    const el = row.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    const size = el.scrollWidth ? el.clientWidth / el.scrollWidth : 1;
    setProgress({ start: max > 0 ? (pos / max) * (1 - size) : 0, size: Math.min(1, size), atStart: pos <= 2, atEnd: pos >= max - 2 });
  };
  useEffect(() => {
    row.current?.scrollTo({ left: 0 });
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [tab]);

  const go = (dir: 1 | -1) => {
    const el = row.current;
    if (!el) return;
    const step = el.clientWidth * 0.8 * dir * (rtl ? -1 : 1);
    el.scrollBy({ left: step, behavior: "smooth" });
  };

  const current = tabs[tab] ?? tabs[0];
  return (
    <div>
      {/* Tabs (only when there is more than one) */}
      {tabs.length > 1 && (
        <div role="tablist" className="mb-12 flex flex-wrap justify-center gap-x-7 gap-y-2 md:mb-16">
          {tabs.map((t, i) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={i === tab}
              onClick={() => setTab(i)}
              className={cn(
                "border-b pb-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors",
                i === tab ? "border-foreground text-foreground" : "border-transparent text-foreground/50 hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* The row: about 3 cards on computers, 1½ on phones */}
      <div
        ref={row}
        onScroll={measure}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {current?.cards.map((card, i) => (
          <div key={i} className="w-[72%] shrink-0 snap-start sm:w-[45%] lg:w-[calc((100%-2.5rem)/3)]">
            {card}
          </div>
        ))}
      </div>

      {/* Progress line + ← → */}
      <div className="mt-8 flex items-center gap-6">
        <div className="relative h-px flex-1 overflow-hidden bg-foreground/15">
          <div
            className="absolute inset-y-0 bg-foreground transition-all duration-300"
            style={{ insetInlineStart: `${progress.start * 100}%`, width: `${progress.size * 100}%` }}
          />
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={() => go(-1)} disabled={progress.atStart} aria-label={labels.previous} className="flex size-10 items-center justify-center rounded-full border border-foreground/15 transition-opacity disabled:opacity-30">
            <ArrowLeft className="size-4 rtl:rotate-180" />
          </button>
          <button type="button" onClick={() => go(1)} disabled={progress.atEnd} aria-label={labels.next} className="flex size-10 items-center justify-center rounded-full border border-foreground/15 transition-opacity disabled:opacity-30">
            <ArrowRight className="size-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
