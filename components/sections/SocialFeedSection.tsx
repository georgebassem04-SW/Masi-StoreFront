/**
 * PAGE BLOCK: SOCIAL FEED ("Stay connected") — tall pictures from the client's Instagram / TikTok,
 * each with the account name on top. Clicking a picture opens its post (or the account page).
 *
 * Where to edit:
 *   - Title, small text, account name, account link, pictures, button -> dashboard → Homepage → "Social feed"
 *   - Picture shape -> "aspect-[9/16]" below (Reels / TikTok shape; try aspect-square for normal posts)
 *   - Pictures per row -> "grid-cols-2 md:grid-cols-4" below
 */
import Link from "next/link";
import type { SocialFeedSection as SocialFeedSectionType } from "@/types";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/format";
import { getSiteTheme } from "@/lib/site-theme";
import type { SectionProps } from "./types";
import { Accent } from "@/components/common/Accent";

/** Only real web addresses open from the pictures (never "javascript:") */
const safeUrl = (u?: string) => (u && /^https?:\/\//i.test(u) ? u : "");

export async function SocialFeedSection({ section, locale }: SectionProps<SocialFeedSectionType>) {
  const d = section.data;
  const items = d.items.filter((i) => i.image?.url);
  if (!items.length) return null;
  const { brand } = await getSiteTheme();
  const profile = safeUrl(d.profileUrl);
  const subtitle = d.subtitle ? t(d.subtitle, locale) : "";
  const button = d.button && t(d.button.label, locale) ? { label: t(d.button.label, locale), href: safeUrl(d.button.href) || profile } : null;

  // GALLERY look (dashboard → the block → Look): plain pictures edge to edge, a light title and a quiet text above
  if (d.look === "gallery") {
    return (
      <section className="py-16 md:py-24">
        <div className="mx-auto mb-10 max-w-2xl px-6 text-center md:mb-14">
          <h2 className="heading-font text-3xl font-light md:text-[40px]">
            <Accent text={t(d.title, locale)} />
          </h2>
          {subtitle && <p className="mt-4 text-[13px] leading-[1.7] text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-2 gap-2 px-2 md:grid-cols-4">
          {items.map((item, i) => {
            const href = safeUrl(item.href) || profile;
            const tile = (
              <div className="group relative aspect-[4/5] overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image.url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            );
            return href ? (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer" aria-label={d.handle || t(d.title, locale)}>
                {tile}
              </a>
            ) : (
              <div key={i}>{tile}</div>
            );
          })}
        </div>
        {button?.href && (
          <div className="mt-8 flex justify-center">
            <Link href={button.href} target="_blank" rel="noopener noreferrer" className="link-line">
              {button.label}
            </Link>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl"><Accent text={t(d.title, locale)} /></h2>
        {subtitle && <p className="mt-2 text-sm opacity-80">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {items.map((item, i) => {
          const href = safeUrl(item.href) || profile;
          const tile = (
            <div className="group relative aspect-[9/16] overflow-hidden rounded-[var(--radius)] bg-muted">
              {/* Plain <img>: the pictures can come from the media library or any address */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image.url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/45 to-transparent" />
              {d.handle && (
                <span className="absolute start-3 top-3 flex items-center gap-2 text-sm font-medium text-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={brand.logo} alt="" className="size-6 rounded-full bg-white object-contain p-0.5" />
                  {d.handle}
                </span>
              )}
            </div>
          );
          return href ? (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" aria-label={d.handle || t(d.title, locale)}>
              {tile}
            </a>
          ) : (
            <div key={i}>{tile}</div>
          );
        })}
      </div>

      {button?.href && (
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link href={button.href} target="_blank" rel="noopener noreferrer">
              {button.label}
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
