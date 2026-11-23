/**
 * BAG DRAWER — slides in from the side when something is added to the bag or the bag icon is clicked.
 * ------------------------------------------------------------------
 * - Width on computers, blur and the delivery line: dashboard → Product page → Bag. Full width on phones.
 * - Closes with ×, Escape, or a click on the dimmed page. Keyboard focus moves into the drawer
 *   and goes back to where it was after closing (Radix Dialog does this).
 * - Opened/closed through the cart store: useCartStore((s) => s.openCart)().
 * - Mounted once in app/[locale]/layout.tsx. The /cart page still works as a fallback.
 *
 * Where to edit:
 *   - Texts (AR/EN) -> i18n/dictionaries/*.json -> "cart"
 *   - Width, blur, delivery line -> dashboard → Product page → Bag (theme.productPage.bag)
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Minus, Plus, X } from "lucide-react";
import type { Locale, ThemeBag } from "@/types";
import type { Dictionary } from "@/i18n/get-dictionary";
import { selectCartCount, selectCartSubtotal, useCartStore } from "@/stores/cart-store";
import { formatPrice, formatWeight, t } from "@/lib/format";
import { localePath } from "@/i18n/config";

interface Props {
  locale: Locale;
  labels: Dictionary["cart"];
  productLabels: Dictionary["product"];
  currency: string;
  showWeight: boolean;
  /** Dashboard → Product page → Bag (width, blur, delivery line) */
  bag: ThemeBag;
}

export function CartDrawer({ locale, labels, productLabels, currency, showWeight, bag }: Props) {
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);

  // The bag lives in the browser: render nothing until the page has loaded
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const p = (path: string) => localePath(locale, path);
  const price = (n: number) => formatPrice(n, items[0]?.currency ?? currency, locale);
  const caps = locale === "ar" ? "" : "uppercase tracking-[0.18em]";

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className={`fixed inset-0 z-50 bg-black/30 ${bag.blur ? "backdrop-blur-[3px]" : ""} data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0`} />
        <Dialog.Content
          className="fixed inset-y-0 end-0 z-50 flex h-full w-full flex-col bg-background shadow-2xl sm:max-w-[var(--bag-width)] data-[state=open]:animate-in data-[state=open]:duration-500 data-[state=closed]:animate-out data-[state=closed]:duration-300 ltr:data-[state=open]:slide-in-from-right ltr:data-[state=closed]:slide-out-to-right rtl:data-[state=open]:slide-in-from-left rtl:data-[state=closed]:slide-out-to-left"
          style={{ animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)", "--bag-width": `${bag.width}px` } as CSSProperties}
        >
          {/* ===== HEADER: YOUR BAG (n) ===== */}
          <div className="flex items-center justify-between border-b px-6 py-5">
            <Dialog.Title className={`text-xs font-normal ${caps}`}>
              {labels.bag} ({count})
            </Dialog.Title>
            <Dialog.Description className="sr-only">{labels.bag}</Dialog.Description>
            <Dialog.Close className="-me-2 rounded-full p-2 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <X className="size-5" strokeWidth={1.25} />
              <span className="sr-only">{labels.close}</span>
            </Dialog.Close>
          </div>

          {items.length === 0 ? (
            /* ===== EMPTY ===== */
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <p className="text-2xl font-light" style={{ fontFamily: "var(--font-heading)" }}>{labels.empty}</p>
              <p className="mt-2 text-sm text-muted-foreground">{labels.emptyText}</p>
              <Link href={p("/products")} onClick={closeCart} className={`mt-8 border border-foreground px-8 py-3 text-xs ${caps} transition-colors hover:bg-foreground hover:text-background`}>
                {labels.continue}
              </Link>
            </div>
          ) : (
            <>
              {/* ===== ITEMS ===== */}
              <ul className="flex-1 divide-y overflow-y-auto px-6">
                {items.map((item) => {
                  const atMax = item.maxQty !== undefined && item.quantity >= item.maxQty;
                  return (
                    <li key={item.variantId} className="flex gap-4 py-5">
                      <Link href={p(`/products/${item.slug}`)} onClick={closeCart} className="relative size-24 shrink-0 overflow-hidden bg-muted">
                        {item.imageUrl && <Image src={item.imageUrl} alt="" fill sizes="192px" className="object-contain mix-blend-multiply" />}
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex justify-between gap-3">
                          <Link href={p(`/products/${item.slug}`)} onClick={closeCart} className="text-sm leading-snug hover:opacity-70">
                            {t(item.name, locale)}
                          </Link>
                          <p className="shrink-0 text-sm">{price(item.unitPrice * item.quantity)}</p>
                        </div>
                        {/* karat · weight · size */}
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.karat}K
                          {showWeight && <> · {formatWeight(item.weightGrams, locale)} {productLabels.grams}</>}
                          {item.size && <> · {productLabels.size}: {item.size}</>}
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-3">
                          {/* quantity stepper */}
                          <div className="flex items-center border">
                            <button
                              type="button"
                              className="flex size-7 items-center justify-center disabled:opacity-30"
                              onClick={() => setQuantity(item.variantId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              aria-label={labels.decrease}
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-7 text-center text-xs">{item.quantity}</span>
                            <button
                              type="button"
                              className="flex size-7 items-center justify-center disabled:opacity-30"
                              onClick={() => setQuantity(item.variantId, item.quantity + 1)}
                              disabled={atMax}
                              aria-label={labels.increase}
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(item.variantId)}
                            className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                          >
                            {labels.remove}
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* ===== FOOTER: subtotal + buttons ===== */}
              <div className="space-y-4 border-t px-6 py-6">
                <div className="flex items-baseline justify-between">
                  <span className={`text-xs ${caps}`}>{labels.subtotal}</span>
                  <span>{price(subtotal)}</span>
                </div>
                {bag.deliveryNote && <p className="text-xs text-muted-foreground">{labels.deliveryNote}</p>}
                <Link
                  href={p("/checkout")}
                  onClick={closeCart}
                  className={`flex w-full items-center justify-center border border-foreground bg-foreground py-3.5 text-xs text-background ${caps} transition-opacity hover:opacity-85`}
                >
                  {labels.checkout}
                </Link>
                <button
                  type="button"
                  onClick={closeCart}
                  className={`flex w-full items-center justify-center border border-foreground py-3.5 text-xs ${caps} transition-colors hover:bg-foreground hover:text-background`}
                >
                  {labels.continue}
                </button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
