/**
 * HOMEPAGE BLOCK: PLACES ON A PICTURE — "Visit us *in Cairo*" on a wide picture, with the places in a row at the bottom.
 *
 * Where to edit:
 *   - Picture, small line, title, the places (name, short text, link), height, shade
 *       -> dashboard → Homepage → Places on a picture  (sample: mock-data/home.json, "locations")
 *   - Italic words in the title -> *stars* around them
 */
import Image from "next/image";
import Link from "next/link";
import type { LocationsSection as LocationsType } from "@/types";
import { localePath } from "@/i18n/config";
import { t } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Accent, plainAccent } from "@/components/common/Accent";
import type { SectionProps } from "./types";

const HEIGHT = { md: "min-h-[560px] md:min-h-[640px]", lg: "min-h-[640px] md:min-h-[100svh]" } as const;

export function LocationsSection({ section, locale }: SectionProps<LocationsType>) {
  const d = section.data;
  const title = t(d.title, locale);
  const items = d.items.filter((i) => t(i.title, locale));
  const href = (h: string) => (/^(https?:|tel:|mailto:)/.test(h) ? h : localePath(locale, h));

  return (
    <section className={cn("relative flex flex-col justify-between overflow-hidden text-white", HEIGHT[d.height ?? "md"])}>
      {d.image?.url && <Image src={d.image.url} alt={t(d.image.alt, locale) || plainAccent(title)} fill sizes="100vw" quality={90} className="object-cover" />}
      <div className="absolute inset-0" style={{ background: `rgb(0 0 0 / ${(d.overlay ?? 25) / 100})` }} />

      {/* Title at the top */}
      <div className="relative px-6 pt-16 text-center md:pt-20">
        {d.eyebrow && <p className="mb-3 text-[10.5px] uppercase tracking-[0.16em] opacity-80">{t(d.eyebrow, locale)}</p>}
        {title && (
          <h2 className="heading-font text-4xl font-light md:text-[56px] md:leading-tight">
            <Accent text={title} />
          </h2>
        )}
      </div>

      {/* The places along the bottom, split by thin lines */}
      {items.length > 0 && (
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-6 pb-10 pt-12 md:grid-cols-3 md:gap-0 md:px-8">
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/30 md:inset-x-8" />
          {items.map((item, i) => (
            <div key={i} className={cn("md:px-6", i > 0 && "md:border-s md:border-white/30", i === 0 && "md:ps-0")}>
              <h3 className="heading-font text-xl font-light">{t(item.title, locale)}</h3>
              {item.text && <p className="mt-2 text-[13px] leading-[1.7] opacity-90">{t(item.text, locale)}</p>}
              {item.link && t(item.link.label, locale) && (
                <Link href={href(item.link.href)} className="link-line mt-3">
                  {t(item.link.label, locale)}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
