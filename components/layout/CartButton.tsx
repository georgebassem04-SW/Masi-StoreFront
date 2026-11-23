/**
 * CART ICON in the header, with a small bubble showing how many items are in the cart.
 * The count is read from the cart store (stores/cart-store.ts).
 * Clicking it opens the bag drawer (components/cart/CartDrawer.tsx), or the /cart page when the dashboard
 * sets Product page → Bag → "Full page".
 * Bubble colour = the client's primary colour (bg-primary).
 */
"use client";

import Link from "next/link";
import { DEFAULT_ICONS, iconFor } from "@/lib/icon-library";
import { useEffect, useState } from "react";
import { selectCartCount, useCartStore } from "@/stores/cart-store";

/**
 * `iconId` (from the icon library) and `iconClass` (size): chosen in the dashboard → Header → Icons.
 * `asText`: "Cart (2)" in words on computers instead of the icon (Header → Icons → "Show as words")
 */
/** `drawer`: true = opens the bag drawer · false = goes to the /cart page (dashboard → Product page → Bag) */
export function CartButton({ href, label, iconId = DEFAULT_ICONS.cart, iconClass = "size-5", asText = false, drawer = true }: { href: string; label: string; iconId?: string; iconClass?: string; asText?: boolean; drawer?: boolean }) {
  const Icon = iconFor("cart", iconId)!;
  const count = useCartStore(selectCartCount);
  const openCart = useCartStore((s) => s.openCart);

  // The cart is saved in the browser, so the count is only known after the page loads.
  // Showing it before that would cause a "hydration" warning in Next.js.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const inside = (
    <>
        {asText && <span className="hidden whitespace-nowrap lg:inline">{label} ({mounted ? count : 0})</span>}
        <Icon className={asText ? `${iconClass} lg:hidden` : iconClass} />
        {/* Count bubble — only shown when the cart has items */}
        {mounted && count > 0 && (
          <span className={`absolute -top-2 -end-2 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground${asText ? " lg:hidden" : ""}`}>
            {count}
          </span>
        )}
    </>
  );

  if (!drawer)
    return (
      <Link href={href} aria-label={label} className="nav-link relative">
        {inside}
      </Link>
    );
  return (
    <button type="button" onClick={openCart} aria-label={label} aria-haspopup="dialog" className="nav-link relative">
      {inside}
    </button>
  );
}
