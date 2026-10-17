/**
 * HOMEPAGE BLOCK: SPOTLIGHT — a big picture with words on it, next to 2 or 4 product cards ("Signature *Pieces*").
 *
 * Where to edit:
 *   - Picture, small line, title, text, link, side of the picture, which products, how many
 *       -> dashboard → Homepage → Spotlight  (sample: mock-data/home.json, "product_spotlight")
 *   - Italic words in the title  -> put *stars* around them in the dashboard
 *   - How each card looks        -> components/product/ProductCard.tsx + Theme & design → Layout → Product cards
 */
import Image from "next/image";
import Link from "next/link";
import type { Product, ProductSpotlightSection as SpotlightType } from "@/types";
import { api } from "@/lib/api";
import { localePath } from "@/i18n/config";
import { t } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product/ProductCard";
import { Accent, plainAccent } from "@/components/common/Accent";
import type { SectionProps } from "./types";

async function loadProducts(d: SpotlightType["data"]): Promise<Product[]> {
  if (d.source === "manual") {
    const ids = d.productIds ?? [];
    const found = await api.getProductsByIds(ids);
    return [...found].sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  }
  if (d.source === "category") return (await api.getProducts({ categoryId: d.categoryId, pageSize: d.limit })).items;
  const all = (await api.getProducts({ sort: "newest", pageSize: 100 })).items;
  return all.filter((p) => (d.source === "new" ? p.isNew : p.isFeatured));
}

export async function ProductSpotlightSection({ section, locale, dict, goldPrices }: SectionProps<SpotlightType>) {
  const d = section.data;
  const products = (await loadProducts(d)).slice(0, d.limit === 2 ? 2 : 4);
  const title = t(d.title, locale);
  const text = d.text ? t(d.text, locale) : "";
  const cta = d.cta && t(d.cta.label, locale) ? d.cta : null;

  return (
    <section className="mx-auto max-w-7xl px-3 py-12 md:px-6 md:py-16">
      {/* White card with a soft shadow under it */}
      <div className="grid gap-3 bg-white p-3 shadow-[0_40px_80px_-60px_rgba(4,35,30,0.35)] md:grid-cols-2">
        {/* The picture with the words at the bottom */}
        <figure className={cn("relative min-h-[460px] overflow-hidden md:min-h-[680px]", d.imagePosition === "end" && "md:order-last")}>
          {d.image?.url && <Image src={d.image.url} alt={t(d.image.alt, locale) || plainAccent(title)} fill sizes="(max-width: 768px) 100vw, 50vw" quality={90} className="object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-35% to-[rgba(4,20,18,0.72)]" />
          <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
            {d.eyebrow && <p className="mb-2 text-[10.5px] uppercase tracking-[0.16em] text-white/75">{t(d.eyebrow, locale)}</p>}
            {title && (
              <h2 className="heading-font text-4xl font-light leading-[0.95] md:text-[47px]">
                <Accent text={title} />
              </h2>
            )}
            {text && <p className="mt-4 max-w-md text-[13.5px] leading-[1.7] opacity-90">{text}</p>}
            {cta && (
              <Link href={localePath(locale, cta.href)} className="link-line mt-5">
                {t(cta.label, locale)}
              </Link>
            )}
          </figcaption>
        </figure>

        {/* The product cards, 2 by 2 (each on the soft background) */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <div key={p.id} className="spotlight-card bg-[var(--card-soft,#F5F5F2)] pb-4">
                <ProductCard product={p} goldPrices={goldPrices} locale={locale} dict={dict} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
