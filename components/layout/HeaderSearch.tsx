/**
 * SEARCH in the header — a magnifier button that opens a search bar under the header.
 * While typing, matching pieces show under the field (live results, /api/search).
 * Enter opens the full results page /products?q=… (filters and sorting).
 *
 * Where to edit:
 *   - Everything about the bar (look: simple / framed / panel, width, words, colours, ✕ button,
 *     live results on/off and how many, popular words, loading mark, ring around the magnifier)
 *       -> dashboard → Header → Search bar
 *     (saved in theme.header.search · defaults and ready-made looks: lib/theme-chrome.ts → DEFAULT_SEARCH / SEARCH_PRESETS)
 *   - Default words ("Search products…", "Popular", "{count} pieces") -> i18n/dictionaries/*.json → "catalog"
 *     (or dashboard → Theme & design → Texts)
 *   - Results data: app/api/search/route.ts
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Search, X } from "lucide-react";
import { DEFAULT_ICONS, iconFor } from "@/lib/icon-library";
import { DEFAULT_SEARCH } from "@/lib/theme-chrome";
import type { HeaderSearchStyle, Locale } from "@/types";
import { fill } from "@/lib/format";
import { cn } from "@/lib/utils";

/** The look with its words already in the visitor's language (Header.tsx does that) */
export type SearchLook = Omit<HeaderSearchStyle, "placeholder" | "buttonText" | "popular"> & { buttonText: string; popular: string[] };

/** Fixed words (dictionary → "catalog", changeable in dashboard → Theme & design → Texts) */
export interface SearchWords {
  popular: string;
  pieces: string;
  piecesOne: string;
  close: string;
}

interface Hit {
  slug: string;
  name: string;
  image: string | null;
  price: string;
}

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
/** Panel look: "narrow" = centred like the MASI reference · "full" = wider */
const PANEL_WIDTH = { narrow: "max-w-3xl px-4 md:px-0", full: "max-w-6xl px-4 md:px-8" } as const;

/**
 * `iconId` (from the icon library) and `iconClass` (size): chosen in the dashboard → Header → Icons.
 * `asText`: show the word "Search" instead of the icon on computers (Header → Icons → "Show as words")
 * `placeholder`: words in the field (dashboard text, or the default from the dictionary)
 * `loaderSrc`: picture of the turning brand mark (Search bar → loading mark, else tab icon, else logo)
 */
export function HeaderSearch({
  locale,
  label,
  placeholder,
  iconClass = "size-5",
  iconId = DEFAULT_ICONS.search,
  asText = false,
  look = { ...DEFAULT_SEARCH, buttonText: "", popular: [] },
  words,
  loaderSrc = "",
}: {
  locale: Locale;
  label: string;
  placeholder: string;
  iconClass?: string;
  iconId?: string;
  asText?: boolean;
  look?: SearchLook;
  words: SearchWords;
  loaderSrc?: string;
}) {
  const Icon = iconFor("search", iconId)!;
  const [open, setOpen] = useState(false);
  // The panel look slides open/closed with a clip; "shown" drives that animation
  const [shown, setShown] = useState(false);
  const [text, setText] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const panel = look.look === "panel";

  function show() {
    setOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  }
  function hide() {
    setShown(false);
    if (panel) setTimeout(() => setOpen(false), 450);
    else setOpen(false);
  }

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  // Escape closes, from anywhere on the page
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && hide();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // LIVE RESULTS: ask /api/search ~200ms after the last key
  useEffect(() => {
    const q = text.trim();
    if (!look.live || !open || q.length < 2) {
      setHits([]);
      setTotal(0);
      setSearched("");
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&locale=${locale}&limit=${look.liveCount}`, { signal: ctrl.signal });
        const data = (await res.json()) as { total: number; items: Hit[] };
        setHits(data.items);
        setTotal(data.total);
        setSearched(q);
      } catch {
        /* aborted by a newer key, or offline: keep the last results */
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [text, open, look.live, look.liveCount, locale]);

  const resultsUrl = (q: string) => `/${locale}/products${q ? `?q=${encodeURIComponent(q)}` : ""}`;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(resultsUrl(text.trim()));
    hide();
  }

  const field = (
    <input
      ref={input}
      type="search"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder={look.floatingLabel ? "" : placeholder}
      aria-label={label}
      className={cn(
        "flex-1 bg-transparent outline-none [&::-webkit-search-cancel-button]:hidden",
        panel ? "h-14 min-w-0 text-2xl font-light md:h-16 md:text-[2rem] placeholder:text-muted-foreground/60" : "text-base",
        !panel && (look.look === "boxed" ? "h-14 w-full px-6" : "h-11"),
        look.floatingLabel && "pt-4",
      )}
      style={panel ? { fontFamily: "var(--font-heading)" } : undefined}
    />
  );

  // Colours: "" = automatic from the site colours (CSS variables of the theme)
  const vars = {
    "--sb-bg": look.fieldBackground || "color-mix(in srgb, var(--foreground) 3%, var(--background))",
    "--sb-border": look.fieldBorder || "var(--primary)",
    "--sb-label": look.labelColor || "var(--primary)",
    "--sb-btn": look.buttonColor || "var(--primary)",
    "--sb-btn-text": look.buttonTextColor || "var(--primary-foreground)",
    "--sb-btn-hover": look.buttonHoverColor || "var(--accent)",
    "--sb-btn-hover-text": look.buttonHoverTextColor || "var(--primary)",
    "--sb-close": look.closeColor || "var(--primary)",
  } as CSSProperties;

  const caps = locale === "ar" ? "" : "uppercase tracking-[0.18em]";
  const loader =
    look.loader === "monogram" && loaderSrc ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={loaderSrc} alt="" className="size-4 animate-spin object-contain [animation-duration:1.6s]" />
    ) : (
      <span className="size-4 animate-spin rounded-full border border-current border-t-transparent opacity-60" />
    );

  /* ----- quick words + live results (shared by every look) ----- */
  const q = text.trim();
  const extras = (
    <div className={cn("mx-auto w-full", panel ? PANEL_WIDTH[look.width] : look.width === "full" ? "md:px-6" : "max-w-4xl")}>
      {look.popular.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className={cn("me-2 text-[10px] text-muted-foreground", caps)}>{words.popular}</span>
          {look.popular.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => {
                setText(w);
                input.current?.focus();
              }}
              className="rounded-full border border-foreground/20 px-3 py-1 text-[11px] transition-colors hover:border-foreground"
            >
              {w}
            </button>
          ))}
        </div>
      )}

      {look.live && q.length >= 2 && (
        <div className="mt-8" aria-live="polite">
          {/* "3 PIECES" (or the turning mark while loading) */}
          <div className={cn("mb-3 flex min-h-5 items-center text-[10px] text-muted-foreground", caps)}>
            {loading ? loader : searched && (total === 1 ? words.piecesOne : fill(words.pieces, { count: total }))}
          </div>
          <ul className={cn("grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-4", loading && "opacity-50 transition-opacity")}>
            {hits.map((h) => (
              <li key={h.slug}>
                <Link href={`/${locale}/products/${h.slug}`} onClick={hide} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    {h.image && (
                      <Image
                        src={h.image}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 200px, 50vw"
                        className="object-cover mix-blend-multiply transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                        style={{ transitionTimingFunction: EASE }}
                      />
                    )}
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-snug">{h.name}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground" dir="auto">{h.price}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => (open ? hide() : show())}
        aria-label={label}
        aria-expanded={open}
        className={cn(
          asText ? "nav-link flex h-9 items-center justify-center px-1" : "nav-link flex size-9 items-center justify-center",
          // Thin circle on hover (dashboard → Search bar → "Circle around the magnifier")
          look.iconRing && !asText && "rounded-full border border-transparent transition-colors duration-300 hover:border-current",
        )}
      >
        {open && !panel ? <X className={iconClass} /> : <Icon className={asText ? `${iconClass} lg:hidden` : iconClass} />}
        {asText && (!open || panel) && <span className="hidden whitespace-nowrap lg:inline">{label}</span>}
      </button>

      {open && panel && (
        /* PANEL: page-coloured, full width, opens with a clip from the top */
        <div
          className="absolute inset-x-0 top-full z-30 max-h-[calc(100vh-100%)] overflow-y-auto bg-background pb-10 pt-8 text-foreground md:pt-10"
          style={{ clipPath: shown ? "inset(0)" : "inset(0 0 100%)", transition: `clip-path .7s ${EASE}` }}
        >
          <div className={cn("mx-auto", PANEL_WIDTH[look.width])}>
            <form role="search" onSubmit={submit} className="flex items-center gap-3 border-b border-foreground/25">
              <Search className="size-4 shrink-0 opacity-60" strokeWidth={1.25} />
              {field}
              <button type="button" onClick={hide} aria-label={words.close} className="shrink-0 p-1 opacity-70 transition-opacity hover:opacity-100">
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </form>
          </div>
          {extras}
        </div>
      )}

      {open && !panel && (
        <div style={vars} className="absolute inset-x-0 top-full z-30 border-b bg-background p-3 text-foreground shadow-md md:py-4">
          <form role="search" onSubmit={submit}>
            {look.look === "simple" ? (
              /* SIMPLE: rounded field with a small magnifier */
              <div className={cn("mx-auto flex items-center gap-2 rounded-lg border bg-background px-3", look.width === "full" ? "max-w-none px-4 md:mx-6" : "max-w-3xl")}>
                <Search className="size-4 text-muted-foreground" />
                {look.floatingLabel ? <FloatingLabel text={placeholder} simple>{field}</FloatingLabel> : field}
              </div>
            ) : (
              /* BOXED: framed field · coloured search button · ✕ button */
              <div className={cn("mx-auto flex items-stretch gap-3 md:gap-5", look.width === "full" ? "max-w-none md:px-6" : "max-w-4xl")}>
                <div className="relative flex min-w-0 flex-1 border bg-[var(--sb-bg)] [border-color:var(--sb-border)]">
                  {look.floatingLabel ? <FloatingLabel text={placeholder}>{field}</FloatingLabel> : field}
                </div>
                <button
                  type="submit"
                  aria-label={label}
                  className={cn(
                    "group/sb flex shrink-0 items-center justify-center gap-2 border border-transparent px-5 font-medium tracking-wide transition-colors md:min-w-36",
                    "bg-[var(--sb-btn)] text-[var(--sb-btn-text)] hover:bg-[var(--sb-btn-hover)] hover:text-[var(--sb-btn-hover-text)]",
                  )}
                >
                  <Search className="size-5" />
                  {look.buttonText && (
                    <span className={cn("hidden md:inline", look.buttonTextOn === "hover" && "md:hidden md:group-hover/sb:inline md:group-focus-visible/sb:inline")}>{look.buttonText}</span>
                  )}
                </button>
                {look.closeButton && (
                  <button type="button" onClick={hide} aria-label={words.close} className="flex w-14 shrink-0 items-center justify-center bg-[var(--sb-close)] text-white transition-opacity hover:opacity-85">
                    <X className="size-6" />
                  </button>
                )}
              </div>
            )}
          </form>
          {extras}
        </div>
      )}
    </>
  );
}

/** The words as a small title in the top corner of the field (dashboard → Search bar → "Words as a small title on top") */
function FloatingLabel({ text, simple, children }: { text: string; simple?: boolean; children: React.ReactNode }) {
  return (
    <label className="relative flex min-w-0 flex-1">
      <span className={cn("pointer-events-none absolute top-1.5 text-xs text-[var(--sb-label)]", simple ? "start-0" : "start-6")}>{text}</span>
      {children}
    </label>
  );
}
