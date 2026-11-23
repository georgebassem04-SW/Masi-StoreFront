/**
 * PAGE BLOCK: PAGE TITLE — "Magazine cover" look (Our Story).
 * ------------------------------------------------------------------
 * The whole screen is the picture with a dark shade. On it:
 *   - a thin top line with three small words (left · middle · right) between two hairlines
 *   - one giant word (MASI) in the heading font
 *   - up to 4 chapters in the bottom corners (2 left, 2 right) — each links to a part of the page (#heritage …)
 *   - in the middle: the short subtitle, a small brand mark and a small link ("Read the issue")
 *
 * Where to edit: dashboard → Site pages → the page → "Page title" block → Look: "Magazine cover".
 * The page title itself is kept for screen readers and Google (the giant word is what shows).
 */
import Image from "next/image";
import Link from "next/link";
import type { Locale, PageHeroChapter, PageHeroSection as PageHeroSectionType } from "@/types";
import { localePath } from "@/i18n/config";
import { t } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Accent, plainAccent } from "@/components/common/Accent";

const SMALL = "text-[10px] font-medium uppercase tracking-[0.18em] md:text-[11px]";

const href = (locale: Locale, h: string) => (h.startsWith("#") || /^(https?:|mailto:|tel:)/i.test(h) ? h : localePath(locale, h));

function Chapter({ c, locale, end }: { c: PageHeroChapter; locale: Locale; end?: boolean }) {
  const title = t(c.title, locale);
  if (!title) return null;
  const label = c.label ? t(c.label, locale) : "";
  const body = (
    <>
      <span className="cover-chapter block text-xl md:text-[26px] lg:text-[30px]">
        <Accent text={title} />
      </span>
      {label && <span className={cn(SMALL, "mt-1.5 block opacity-80")}>{label}</span>}
    </>
  );
  return c.href ? (
    <Link href={href(locale, c.href)} className={cn("group block transition-opacity hover:opacity-80", end && "md:text-end")}>
      {body}
    </Link>
  ) : (
    <div className={cn(end && "md:text-end")}>{body}</div>
  );
}

export function PageHeroCover({ section, locale }: { section: PageHeroSectionType; locale: Locale }) {
  const d = section.data;
  const c = d.cover ?? {};
  const title = plainAccent(t(d.title, locale));
  const word = (c.word && t(c.word, locale)) || title;
  const top = [c.topLeft, c.topCenter, c.topRight].map((x) => (x ? t(x, locale) : ""));
  const chapters = (c.chapters ?? []).slice(0, 4);
  const left = chapters.slice(0, 2);
  const right = chapters.slice(2, 4);
  const shade = Math.min(80, Math.max(0, c.shade ?? 35)) / 100;
  const tagline = d.subtitle ? t(d.subtitle, locale) : "";
  const link = c.link && t(c.link.label, locale) ? { label: t(c.link.label, locale), href: href(locale, c.link.href || "#") } : null;

  return (
    // data-overlay-hero="pad": the see-through header sits on top and the words start under it (app/globals.css)
    <section data-overlay-hero="pad" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#1b1512] text-white">
      {d.image?.url && <Image src={d.image.url} alt="" fill priority sizes="100vw" quality={90} className="-z-10 object-cover" />}
      {/* Shade: even all over, a little darker at the bottom where the chapters are */}
      <div className="absolute inset-0 -z-10" style={{ background: `linear-gradient(to bottom, rgb(20 10 8 / ${shade}), rgb(20 10 8 / ${shade * 0.7}) 45%, rgb(20 10 8 / ${Math.min(0.85, shade + 0.25)}))` }} />

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 pb-6 md:px-14 md:pb-8">
        {/* Top line between two hairlines */}
        {top.some(Boolean) && (
          <div className={cn(SMALL, "grid grid-cols-2 items-center gap-2 border-y border-white/30 py-3 md:grid-cols-3 md:py-4")}>
            <span className="text-start">{top[0]}</span>
            <span className="hidden text-center md:block">{top[1]}</span>
            <span className="text-end">{top[2]}</span>
          </div>
        )}

        {/* The giant word; the real page title stays for screen readers and Google */}
        <div className="flex flex-1 items-center justify-center py-8 md:py-4">
          <h1 className="text-center">
            <span aria-hidden="true" className="cover-word block select-none">
              {word}
            </span>
            <span className="sr-only">{title}</span>
          </h1>
        </div>

        {/* Bottom: chapters left · words and link in the middle · chapters right */}
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-8">
          <div className="flex flex-col gap-4 md:gap-5">
            {left.map((ch, i) => (
              <Chapter key={i} c={ch} locale={locale} />
            ))}
          </div>

          <div className="order-last flex flex-col items-center gap-3 text-center md:order-none md:max-w-[300px]">
            {tagline && <p className="cover-chapter text-lg italic opacity-75 md:text-xl">{tagline}</p>}
            {c.badge?.url && (
              // Small brand mark (a plain <img>: it is tiny and may be an SVG)
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.badge.url} alt="" className="mt-1 h-7 w-auto opacity-80 brightness-0 invert" />
            )}
            {link && (
              <Link href={link.href} className={cn(SMALL, "opacity-80 transition-opacity hover:opacity-100")}>
                {link.label}
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-4 md:gap-5">
            {right.map((ch, i) => (
              <Chapter key={i} c={ch} locale={locale} end />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
