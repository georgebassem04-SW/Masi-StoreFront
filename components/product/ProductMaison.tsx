/**
 * PRODUCT PAGE — "MAISON" LOOK (like the MASI design), the column next to the photos.
 * ------------------------------------------------------------------
 *   NAME IN CAPITALS · colour in italic · description · "Product description" list · size note
 *   price · [SELECT A SIZE / ADD TO BAG] [♡] · returns line · size guide + size list
 *   folding sections: Product Details · Materials · Product Care · Shipping & Return · "Also available in"
 * Switched on in dashboard → Product page → Look: "Maison".
 *
 * Where to edit:
 *   - Per piece (colour line, list, details, materials, group code) -> dashboard → the product → "Product page texts"
 *   - Care / shipping texts, size guide link, heart, returns line     -> dashboard → Product page
 *   - Fixed words ("Select a size", "Materials"…)                     -> Theme & design → Texts → product
 * Adding to the bag uses the same cart as the classic page (stores/cart-store.ts) and opens the bag drawer.
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Heart, Minus, Plus, Repeat2 } from "lucide-react";
import type { Locale, LocalizedText, ThemeProductPage } from "@/types";
import type { Dictionary } from "@/i18n/get-dictionary";
import { productButtonCss } from "@/lib/theme-chrome";
import { formatCardPrice, formatPrice, t } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import { useWishlist } from "@/stores/wishlist-store";
import { cn } from "@/lib/utils";
import type { PurchaseVariant } from "./ProductPurchase";

/** Colour dot of each metal ("Also available in") */
const METAL_DOT: Record<string, string> = { yellow_gold: "#D9B66A", rose_gold: "#E2B3A2", white_gold: "#DADADA", platinum: "#C9CBCD", silver: "#C0C0C0" };

export interface SiblingProduct {
  slug: string;
  label: string;
  metal: string;
  current: boolean;
}

interface Props {
  locale: Locale;
  labels: Dictionary["product"];
  product: {
    id: string;
    slug: string;
    sku: string;
    name: LocalizedText;
    karat: number;
    imageUrl?: string;
    description: string;
    subtitle: string;
    highlights: string[];
    details: string;
    materials: string;
  };
  variants: PurchaseVariant[];
  currency: string;
  look: ThemeProductPage;
  showSku: boolean;
  showBuyNow: boolean;
  priceFormat?: { symbol: string; decimals: boolean };
  checkoutHref: string;
  cartHref: string;
  siblings: SiblingProduct[];
  /** Care / shipping texts already in the visitor's language */
  care: string;
  shipping: string;
}

const canBuy = (v: PurchaseVariant) => v.stockQty > 0 || v.stockStatus === "made_to_order";
const hasSize = (v: PurchaseVariant) => !!v.size && v.size !== "one";

export function ProductMaison({ locale, labels, product, variants, currency, look, showSku, showBuyNow, priceFormat, checkoutHref, cartHref, siblings, care, shipping }: Props) {
  const router = useRouter();
  const sized = variants.length > 1 || variants.some(hasSize);
  // With several sizes nothing is chosen at first ("SELECT A SIZE"); one size = already chosen
  const [variantId, setVariantId] = useState<string | undefined>(sized ? undefined : variants[0]?.id);
  const [maxNote, setMaxNote] = useState(false);
  const variant = variants.find((v) => v.id === variantId);

  const add = useCartStore((s) => s.add);
  const openCart = useCartStore((s) => s.openCart);
  const inCart = useCartStore((s) => s.items.find((i) => i.variantId === variantId)?.quantity ?? 0);
  const wish = useWishlist();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const wished = mounted && wish.slugs.includes(product.slug);

  const money = (n: number) => (priceFormat ? formatCardPrice(n, currency, locale, priceFormat.symbol, priceFormat.decimals) : formatPrice(n, currency, locale));
  // Price shown: the chosen size, else the cheapest one
  const shownPrice = useMemo(() => {
    const list = variant ? [variant] : variants;
    return Math.min(...list.map((v) => v.offer?.total ?? v.price.total));
  }, [variant, variants]);
  const caps = locale === "ar" ? "" : "uppercase tracking-[0.16em]";
  // "Nile Bracelet — Yellow gold" + colour line "Yellow gold" → the name without the colour (the colour has its own line)
  const fullName = t(product.name, locale);
  const title = product.subtitle && fullName.endsWith(` — ${product.subtitle}`) ? fullName.slice(0, -(product.subtitle.length + 3)) : fullName;

  function putInCart() {
    if (!variant || !canBuy(variant)) return false;
    const maxQty = variant.stockStatus === "made_to_order" ? undefined : variant.stockQty;
    if (maxQty !== undefined && inCart >= maxQty) {
      setMaxNote(true);
      return false;
    }
    add({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.imageUrl,
      karat: product.karat,
      weightGrams: variant.weightGrams,
      size: hasSize(variant) ? variant.size : undefined,
      quantity: 1,
      unitPrice: variant.offer?.total ?? variant.price.total,
      currency,
      maxQty,
    });
    return true;
  }
  function addToBag() {
    if (!putInCart()) return;
    if (look.bag.mode === "drawer") openCart();
    else router.push(cartHref);
  }
  function buyNow() {
    if (!variant) return;
    putInCart();
    router.push(checkoutHref);
  }

  const mainLabel = !variant ? labels.selectASize : canBuy(variant) ? labels.addToCart : labels.outOfStock;
  const sections = [
    { key: "details", title: labels.productDetails, body: product.details },
    { key: "materials", title: labels.materials, body: product.materials },
    { key: "care", title: labels.care, body: care },
    { key: "shipping", title: labels.shipping, body: shipping },
  ].filter((s) => s.body.trim());

  return (
    <div className="flex flex-col text-start">
      {showSku && (
        <p className="mb-4 text-[11px] text-muted-foreground">
          {labels.ref} <span dir="ltr">{product.sku}</span>
        </p>
      )}

      {/* NAME in capitals (body font) · colour in italic (heading font) */}
      <h1 className={cn("text-xl font-normal leading-snug md:text-[1.375rem]", locale !== "ar" && "uppercase tracking-[0.02em]")} style={{ fontFamily: "var(--font-sans)" }}>
        {title}
      </h1>
      {product.subtitle && (
        <p className="mt-1 text-lg italic text-muted-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          {product.subtitle}
        </p>
      )}

      {product.description && <p className="mt-5 text-sm leading-relaxed">{product.description}</p>}

      {product.highlights.length > 0 && (
        <div className="mt-5 text-sm">
          <p>{labels.productDescription}</p>
          <ul className="mt-2 list-disc space-y-1 ps-5">
            {product.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      )}
      {sized && labels.sizeNote && <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{labels.sizeNote}</p>}

      <div className="my-6 border-t" />

      {/* PRICE (regular weight) */}
      <p className="text-base" dir="auto">
        {variant?.offer && <s className="me-2 text-muted-foreground">{money(variant.price.total)}</s>}
        {money(shownPrice)}
      </p>

      {/* MAIN BUTTON + HEART */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={addToBag}
          disabled={!variant || !canBuy(variant)}
          style={variant && canBuy(variant) ? productButtonCss("cart", look.buttons.cart) : undefined}
          className={cn("h-12 flex-1 border text-xs transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:border-transparent disabled:bg-muted disabled:text-muted-foreground", caps)}
        >
          {mainLabel}
        </button>
        {look.wishlist && (
          <button
            type="button"
            onClick={() => wish.toggle(product.slug)}
            aria-pressed={wished}
            aria-label={wished ? labels.wishlistRemove : labels.wishlistAdd}
            className="flex size-12 shrink-0 items-center justify-center border transition-colors hover:border-foreground"
          >
            <Heart className={cn("size-4", wished && "fill-current")} strokeWidth={1.5} />
          </button>
        )}
      </div>
      {/* Buy now stays second to "Add to bag" */}
      {showBuyNow && variant && canBuy(variant) && (
        <button type="button" onClick={buyNow} className={cn("mt-2 h-12 w-full border border-foreground/30 text-xs transition-colors hover:border-foreground", caps)}>
          {labels.buyNow}
        </button>
      )}
      {maxNote && <p className="mt-2 text-xs text-amber-800">{labels.maxInCart}</p>}

      {look.returnsLine && (
        <p className={cn("mt-4 flex items-center gap-3 text-[11px]", caps)}>
          <Repeat2 className="size-4" strokeWidth={1.25} />
          {labels.returnsLine}
        </p>
      )}

      {/* SIZE GUIDE + SIZE LIST */}
      {sized && (
        <div className="mt-6">
          {look.sizeGuideUrl && (
            <a href={look.sizeGuideUrl} target={look.sizeGuideUrl.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={cn("mb-3 inline-block text-[11px] hover:opacity-70", caps)}>
              {labels.sizeGuide} ↗
            </a>
          )}
          <label className="relative block">
            <span className="sr-only">{labels.selectSize}</span>
            <select
              value={variantId ?? ""}
              onChange={(e) => {
                setVariantId(e.target.value || undefined);
                setMaxNote(false);
              }}
              className={cn("h-12 w-full appearance-none border bg-transparent px-10 text-center text-xs outline-none focus-visible:border-foreground", caps)}
            >
              <option value="">{labels.selectSize}</option>
              {variants.map((v) => (
                <option key={v.id} value={v.id} disabled={!canBuy(v)}>
                  {v.size && v.size !== "one" ? v.size : v.sku}
                  {!canBuy(v) ? ` — ${labels.outOfStock}` : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2" strokeWidth={1.25} />
          </label>
        </div>
      )}

      {/* FOLDING SECTIONS */}
      {sections.length > 0 && (
        <div className="mt-6 divide-y border-y">
          {sections.map((s) => (
            <details key={s.key} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm [&::-webkit-details-marker]:hidden">
                {s.title}
                <Plus className="size-4 group-open:hidden" strokeWidth={1.25} />
                <Minus className="hidden size-4 group-open:block" strokeWidth={1.25} />
              </summary>
              <p className="whitespace-pre-line pb-5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </details>
          ))}
        </div>
      )}

      {/* ALSO AVAILABLE IN */}
      {siblings.length > 1 && (
        <div className="mt-8">
          <p className={cn("mb-3 text-[11px]", caps)}>{labels.alsoAvailable}</p>
          <ul className="flex flex-wrap gap-4">
            {siblings.map((s) => (
              <li key={s.slug}>
                <Link href={`/${locale}/products/${s.slug}`} aria-current={s.current} className={cn("flex items-center gap-2 text-xs", s.current ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                  <span className={cn("size-4 rounded-full border", s.current && "ring-1 ring-foreground ring-offset-2 ring-offset-background")} style={{ background: METAL_DOT[s.metal] ?? "#ddd" }} />
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
