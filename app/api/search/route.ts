/**
 * LIVE SEARCH ENDPOINT — GET /api/search?q=brace&locale=en&limit=4
 * ------------------------------------------------------------------
 * Used by the header search (components/layout/HeaderSearch.tsx) to show pieces while the visitor types.
 * Same search rules as the products page (lib/catalog/search.ts), same prices and price look as the
 * product cards (today's gold rate, special offers, dashboard → Layout → Product cards → Price).
 * Returns { total, items: [{ slug, name, image, price }] }.
 */
import { NextResponse, type NextRequest } from "next/server";
import { api } from "@/lib/api";
import { clientConfig } from "@/config/clients";
import { calculatePrice } from "@/lib/pricing";
import { getActiveOffers, offerFor } from "@/lib/offers";
import { getSiteTheme } from "@/lib/site-theme";
import { formatCardPrice, t } from "@/lib/format";
import { isLocale } from "@/i18n/config";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const q = (sp.get("q") ?? "").trim().slice(0, 80);
  const locale = sp.get("locale") ?? "";
  const limit = sp.get("limit") === "8" ? 8 : 4;
  if (!q || !isLocale(locale)) return NextResponse.json({ total: 0, items: [] });

  const [found, goldPrices, offers, theme] = await Promise.all([
    api.getProducts({ search: q, pageSize: limit, page: 1 }),
    api.getGoldPrices(),
    getActiveOffers(),
    getSiteTheme(),
  ]);
  const card = theme.layout.card;
  const money = (n: number) => formatCardPrice(n, clientConfig.currency, locale, t(card.priceSymbol, locale), card.priceDecimals);

  const items = found.items.slice(0, limit).map((p) => {
    // Cheapest size, after a special offer when one applies (like the product cards)
    const prices = p.variants.map((v) => {
      const full = calculatePrice(p, v, goldPrices);
      return offerFor(p.id, full, offers)?.total ?? full.total;
    });
    return {
      slug: p.slug,
      name: t(p.name, locale),
      image: p.images[0]?.url ?? null,
      price: prices.length ? money(Math.min(...prices)) : "",
    };
  });

  return NextResponse.json({ total: found.total, items }, { headers: { "Cache-Control": "public, max-age=30" } });
}
