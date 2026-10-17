/**
 * PRODUCT CARD PICTURES WITH DOTS (runs in the browser)
 * ------------------------------------------------------------------
 * Used by ProductCard.tsx when dashboard → Theme & design → Layout → Product cards → "Dots under the picture" is on.
 * All the product's pictures sit on top of each other; a dot under the picture shows that one.
 * The dots stop the click so the visitor stays on the list (the picture itself still opens the product).
 */
"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  images: { url: string }[];
  alt: string;
  /** Classes of each picture (object-cover, blend, grayscale…) */
  imageClass?: string;
  /** Anything drawn on the picture (labels, sold-out shade) */
  children?: ReactNode;
  boxClass: string;
  boxStyle?: React.CSSProperties;
  dotsLabel: string;
}

export function CardImages({ images, alt, imageClass, children, boxClass, boxStyle, dotsLabel }: Props) {
  const [active, setActive] = useState(0);
  const list = images.slice(0, 8);
  return (
    <>
      <div className={boxClass} style={boxStyle}>
        {list.map((img, i) => (
          <Image
            key={img.url + i}
            src={img.url}
            alt={i === 0 ? alt : ""}
            fill
            sizes="(max-width: 768px) 50vw, 25vw" quality={90}
            className={cn("object-cover transition-opacity duration-500", imageClass, i === active ? "opacity-100" : "opacity-0")}
          />
        ))}
        {children}
      </div>
      {/* One dot per picture (hidden when there is only one) */}
      <div className="flex h-[22px] items-center justify-center gap-[5px]" role="tablist" aria-label={dotsLabel}>
        {list.length > 1 &&
          list.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`${i + 1} / ${list.length}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActive(i);
              }}
              className={cn("rounded-full transition-colors", i === active ? "size-[6px] bg-foreground" : "size-[5px] bg-foreground/20 hover:bg-foreground/50")}
            />
          ))}
      </div>
    </>
  );
}
