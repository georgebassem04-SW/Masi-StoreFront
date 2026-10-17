/**
 * HOMEPAGE BLOCK: PRODUCT ROW — e.g. "Featured pieces" or "New arrivals".
 *
 * Where to edit:
 *   - Title, which products, how many -> dashboard → Homepage → Product row  (sample: mock-data/home.json, "featured_products")
 *       "source": "featured" = products with isFeatured: true
 *                 "new"      = products with isNew: true
 *                 "manual"   = the ids listed in "productIds"
 *                 "category" = products of "categoryId"
 *       "limit": how many to show
 *   - Mark a product featured/new    -> mock-data/products.json (isFeatured / isNew)
 *   - Products per row               -> config/clients/demo.ts -> layout.gridColumns
 *   - How each product looks         -> components/product/ProductCard.tsx
 *   - Slider with tabs ("All · Necklaces · Rings…"), centred small-capital title
 *                                    -> dashboard → Homepage → Product row → Look (data: layout, titleStyle, tabs, allLabel)
 *                                       The slider itself: ProductCarousel.tsx
 */
import type { FeaturedProductsSection as FeaturedProductsSectionType, Product } from "@/types";
import { api } from "@/lib/api";
import { localePath } from "@/i18n/config";
import { t } from "@/lib/format";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionTitle } from "@/components/common/SectionTitle";
import type { SectionProps } from "./types";
import { Accent } from "@/components/common/Accent";
import { ProductCarousel } from "./ProductCarousel";

async function loadProducts(data: FeaturedProductsSectionType["data"]): Promise<Product[]> {
  switch (data.source) {
    case "manual": {
      // Shown in the order chosen in the dashboard
      const ids = data.productIds ?? [];
      const found = await api.getProductsByIds(ids);
      return [...found].sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
    }
    case "category":
      return (await api.getProducts({ categoryId: data.categoryId, pageSize: data.limit })).items;
    case "new":
      return (await api.getProducts({ sort: "newest", pageSize: 100 })).items.filter((p) => p.isNew);
    default:
      return (await api.getProducts({ pageSize: 100 })).items.filter((p) => p.isFeatured);
  }
}

export async function FeaturedProductsSection({ section, locale, dict, goldPrices }: SectionProps<FeaturedProductsSectionType>) {
  const d = section.data;
  const products = (await loadProducts(d)).slice(0, d.limit);
  if (!products.length) return null;
  const title = t(d.title, locale);
  const card = (p: Product) => <ProductCard key={p.id} product={p} goldPrices={goldPrices} locale={locale} dict={dict} />;

  /* ----- SLIDER with tabs ----- */
  if (d.layout === "carousel") {
    // Tabs after "All": a category (and its sub-categories) or a tag such as "gold" / "diamond"
    const tabs = d.tabs?.length ? d.tabs : [];
    let pool: Product[] = [];
    let cats: { id: string; parentId?: string }[] = [];
    if (tabs.length) [pool, cats] = await Promise.all([api.getProducts({ pageSize: 200 }).then((r) => r.items), api.getCategories()]);
    const inCategory = (p: Product, id: string) => p.categoryId === id || cats.some((c) => c.id === p.categoryId && c.parentId === id);
    const tabList = [
      { key: "all", label: t(d.allLabel, locale) || dict.common.all, cards: products.map(card) },
      ...tabs.map((tab, i) => ({
        key: `tab-${i}`,
        label: t(tab.label, locale),
        cards: pool
          .filter((p) => (tab.categoryId ? inCategory(p, tab.categoryId) : true) && (tab.tag ? p.tags.includes(tab.tag) : true))
          .slice(0, d.limit)
          .map(card),
      })),
    ].filter((tab) => tab.label && tab.cards.length);
    return (
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:px-8">
        <SectionHeading title={title} centered={d.titleStyle !== "classic"} href={localePath(locale, "/products")} linkLabel={dict.product.viewAll} />
        <ProductCarousel tabs={tabList} labels={{ previous: dict.common.previous, next: dict.common.next }} rtl={locale === "ar"} />
      </section>
    );
  }

  /* ----- GRID (original) ----- */
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <SectionHeading title={title} centered={d.titleStyle === "centered"} href={localePath(locale, "/products")} linkLabel={dict.product.viewAll} />
      <div className="product-grid">{products.map(card)}</div>
    </section>
  );
}

/** Title above the row: the classic one (with "View all"), or small spaced capitals in the middle */
function SectionHeading({ title, centered, href, linkLabel }: { title: string; centered: boolean; href: string; linkLabel: string }) {
  if (!title) return null;
  if (!centered) return <SectionTitle title={title} href={href} linkLabel={linkLabel} />;
  return (
    <h2 className="heading-font mb-6 text-center text-[22px] font-light uppercase tracking-[0.04em]">
      <Accent text={title} />
    </h2>
  );
}
