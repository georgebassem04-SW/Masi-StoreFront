/**
 * STORE FINDER (runs in the browser) — the "Store finder" look of the Branches block, like the MASI design.
 * ------------------------------------------------------------------
 *   [FIND A STORE · 6 locations · All / Boutiques / Coming soon / Heritage]   [ map ]
 *   [01 Heliopolis FLAGSHIP · address · line · hours · DIRECTIONS · BOOK A VISIT]
 *   …then one story block per store (photo, small line, title, text, SHOW ON MAP).
 * Clicking a store (or "Show on map") moves the map to it. The map is OpenStreetMap (no key, nothing to install).
 *
 * Where to edit:
 *   - The stores, their type, line, map position, booking link and story -> dashboard → Settings → Branches
 *   - The small line above the title / the title                         -> dashboard → Site pages → Stores → Branches block
 *   - Fixed words (Find a store, filters, Directions…)                    -> Theme & design → Texts → branches
 */
"use client";

import { useMemo, useRef, useState } from "react";
import type { Branch, Locale } from "@/types";
import type { Dictionary } from "@/i18n/get-dictionary";
import { fill, t } from "@/lib/format";
import { localePath } from "@/i18n/config";
import { cn } from "@/lib/utils";

type Filter = "all" | "boutiques" | "soon" | "heritage";
/** Which store types each filter shows */
const FILTERS: Record<Filter, (b: Branch) => boolean> = {
  all: () => true,
  boutiques: (b) => !b.kind || b.kind === "boutique" || b.kind === "flagship" || b.kind === "private",
  soon: (b) => b.kind === "new",
  heritage: (b) => b.kind === "heritage",
};

/** OpenStreetMap picture around one point (or around all points), with a pin on the chosen store */
function mapSrc(points: { lat: number; lng: number }[], pin?: { lat: number; lng: number }) {
  if (!points.length) return "";
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const pad = points.length === 1 ? 0.02 : 0.03;
  const box = [Math.min(...lngs) - pad, Math.min(...lats) - pad, Math.max(...lngs) + pad, Math.max(...lats) + pad].map((n) => n.toFixed(4)).join(",");
  const marker = pin ? `&marker=${pin.lat.toFixed(5)},${pin.lng.toFixed(5)}` : "";
  return `https://www.openstreetmap.org/export/embed.html?bbox=${box}&layer=mapnik${marker}`;
}

const directionsUrl = (b: Branch) => b.mapUrl || (b.lat != null && b.lng != null ? `https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}` : "");

export function StoreLocator({ branches, locale, labels, eyebrow, title }: { branches: Branch[]; locale: Locale; labels: Dictionary["branches"]; eyebrow: string; title?: string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [chosen, setChosen] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => branches.filter(FILTERS[filter]), [branches, filter]);
  const onMap = (list: Branch[]) => list.filter((b) => b.lat != null && b.lng != null).map((b) => ({ lat: b.lat!, lng: b.lng! }));
  const current = branches.find((b) => b.id === chosen && b.lat != null);
  const src = current ? mapSrc([{ lat: current.lat!, lng: current.lng! }], { lat: current.lat!, lng: current.lng! }) : mapSrc(onMap(visible));
  const caps = locale === "ar" ? "" : "uppercase tracking-[0.18em]";
  const linkCls = cn("border-b border-current pb-0.5 text-[10px] transition-opacity hover:opacity-60", caps);
  // Only offer the filters that have at least one store
  const filters = (Object.keys(FILTERS) as Filter[]).filter((f) => f === "all" || branches.some(FILTERS[f]));
  const filterLabel: Record<Filter, string> = { all: labels.filterAll, boutiques: labels.filterBoutiques, soon: labels.filterSoon, heritage: labels.filterHeritage };

  function show(b: Branch) {
    setChosen(b.id);
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      <section className="grid border-y lg:h-[680px] lg:grid-cols-[400px_1fr]">
        {/* ===== LIST ===== */}
        <div className="flex min-h-0 flex-col border-e">
          <div className="border-b px-6 py-6">
            {eyebrow && <p className={cn("text-[10px] text-muted-foreground", caps)}>{eyebrow}</p>}
            <h2 className="mt-1 text-3xl font-light" style={{ fontFamily: "var(--font-heading)" }}>
              {title || (visible.length === 1 ? labels.locationsOne : fill(labels.locations, { count: visible.length }))}
            </h2>
            {filters.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-2" role="tablist">
                {filters.map((f) => (
                  <button
                    key={f}
                    type="button"
                    role="tab"
                    aria-selected={filter === f}
                    onClick={() => {
                      setFilter(f);
                      setChosen(null);
                    }}
                    className={cn("rounded-full border px-3.5 py-1.5 text-xs transition-colors", filter === f ? "border-primary bg-primary text-primary-foreground" : "hover:border-foreground")}
                  >
                    {filterLabel[f]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <ol className="min-h-0 flex-1 divide-y overflow-y-auto">
            {visible.map((b, i) => {
              const dir = directionsUrl(b);
              return (
                <li key={b.id} className={cn("flex gap-5 px-6 py-6 transition-colors", chosen === b.id && "bg-muted/60")}>
                  <span className="pt-1.5 text-[11px] tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <div className="min-w-0 flex-1">
                    <button type="button" onClick={() => setChosen(b.id)} className="flex flex-wrap items-center gap-2 text-start">
                      <span className="text-xl font-light" style={{ fontFamily: "var(--font-heading)" }}>
                        {t(b.name, locale)}
                      </span>
                      {b.kind && b.kind !== "boutique" && <span className={cn("border px-1.5 py-0.5 text-[9px]", caps)}>{labels.kinds[b.kind]}</span>}
                    </button>
                    <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                      <p>{t(b.address, locale)}</p>
                      {b.tagline && t(b.tagline, locale) && <p>{t(b.tagline, locale)}</p>}
                      {t(b.hours, locale) && <p>{t(b.hours, locale)}</p>}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4">
                      {dir && (
                        <a href={dir} target="_blank" rel="noopener noreferrer" className={linkCls}>
                          {labels.directions}
                        </a>
                      )}
                      {b.kind === "heritage" ? (
                        <a href={localePath(locale, "/about")} className={linkCls}>
                          {labels.ourStory}
                        </a>
                      ) : (
                        b.bookUrl && (
                          <a href={b.bookUrl.startsWith("/") ? localePath(locale, b.bookUrl) : b.bookUrl} target={b.bookUrl.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={linkCls}>
                            {labels.bookVisit}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ===== MAP ===== */}
        <div ref={mapRef} className="relative h-[420px] bg-muted lg:h-full">
          {src && <iframe key={src} title={labels.map} src={src} loading="lazy" className="absolute inset-0 size-full border-0 grayscale-[35%]" />}
        </div>
      </section>

      {/* ===== ONE STORY PER STORE ===== */}
      {branches.some((b) => b.story && t(b.story.title, locale)) && (
        <section className="mx-auto max-w-6xl space-y-24 px-6 py-24">
          {branches
            .filter((b) => b.story && t(b.story.title, locale))
            .map((b, i) => (
              <article key={b.id} className={cn("grid items-center gap-10 md:grid-cols-2", i % 2 === 1 && "md:[&>*:first-child]:order-last")}>
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  {b.image?.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.image.url} alt={t(b.name, locale)} loading="lazy" className="absolute inset-0 size-full object-cover" />
                  )}
                </div>
                <div className="max-w-md">
                  <p className="text-[11px] tabular-nums text-muted-foreground">{String(branches.indexOf(b) + 1).padStart(2, "0")}</p>
                  {t(b.story!.eyebrow, locale) && <p className={cn("mt-3 text-[10px] text-muted-foreground", caps)}>{t(b.story!.eyebrow, locale)}</p>}
                  <h3 className="mt-2 text-3xl font-light leading-tight md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
                    {t(b.story!.title, locale)}
                  </h3>
                  {t(b.story!.text, locale) && <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{t(b.story!.text, locale)}</p>}
                  {b.lat != null && (
                    <button type="button" onClick={() => show(b)} className={cn("mt-6", linkCls)}>
                      {labels.showOnMap}
                    </button>
                  )}
                </div>
              </article>
            ))}
        </section>
      )}
    </>
  );
}
