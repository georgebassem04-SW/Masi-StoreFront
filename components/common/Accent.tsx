/**
 * ACCENT WORDS — "Signature *Pieces*" → "Signature" + "Pieces" in the heading font, italic and light.
 * ------------------------------------------------------------------
 * Any title or text typed in the dashboard can mark words with *stars*; they show in the accent style
 * (CSS class "accent" in app/globals.css). No stars = the text as it is.
 */
import { Fragment } from "react";

export function Accent({ text }: { text: string }) {
  if (!text.includes("*")) return <>{text}</>;
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <em key={i} className="accent">{part}</em> : <Fragment key={i}>{part}</Fragment>))}
    </>
  );
}

/** The text without the stars (for alt texts, page titles…) */
export const plainAccent = (text: string) => text.replace(/\*([^*]+)\*/g, "$1");
