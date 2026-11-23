/**
 * TRANSFER SCREENSHOT UPLOAD (runs in the browser) — on the order page for InstaPay / bank transfer orders.
 * ------------------------------------------------------------------
 * The customer picks the screenshot of their transfer → it is checked here (picture, ≤ 5 MB), sent to
 * /api/orders/<number>/payment-proof, and the order waits "for payment confirmation" until staff confirm it.
 * Up to 3 screenshots (e.g. if the first one was unclear).
 *
 * Where to edit:
 *   - Texts (AR/EN) -> i18n/dictionaries/*.json -> "orderSuccess.proof"
 *   - Size limit    -> MAX_MB below (keep it the same as app/api/orders/[number]/payment-proof/route.ts)
 */
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ImageUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_MB = 5;
const MAX_PROOFS = 3;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

interface Labels {
  title: string;
  hint: string;
  choose: string;
  send: string;
  sending: string;
  sent: string;
  sentCount: string;
  another: string;
  errors: { photo: string; too_many: string; not_allowed: string; not_found: string; failed: string };
}

export function PaymentProofUpload({ number, orderKey, sentCount, labels: L }: { number: string; orderKey: string; sentCount: number; labels: Labels }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(sentCount);
  const [adding, setAdding] = useState(sentCount === 0);

  function pick(f: File | undefined) {
    setError(null);
    if (!f) return;
    if (!TYPES.includes(f.type) || f.size > MAX_MB * 1024 * 1024) {
      setError(L.errors.photo);
      return;
    }
    setFile(f);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(f);
    });
  }

  async function send() {
    if (!file) return;
    setBusy(true);
    setError(null);
    const form = new FormData();
    form.append("key", orderKey);
    form.append("photo", file);
    const res = await fetch(`/api/orders/${encodeURIComponent(number)}/payment-proof`, { method: "POST", body: form }).catch(() => null);
    const data = res ? ((await res.json().catch(() => ({}))) as { ok?: boolean; count?: number; error?: keyof Labels["errors"] }) : {};
    setBusy(false);
    if (res?.ok && data.ok) {
      setCount(data.count ?? count + 1);
      setFile(null);
      setPreview(null);
      setAdding(false);
      router.refresh();
      return;
    }
    setError(L.errors[data.error ?? "failed"] ?? L.errors.failed);
  }

  return (
    <div className="space-y-3 rounded-xl border p-5">
      <h3 className="font-semibold">{L.title}</h3>

      {count > 0 && (
        <p role="status" className="flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <span>
            {L.sent}
            {count > 1 && <> ({L.sentCount.replace("{n}", String(count))})</>}
          </span>
        </p>
      )}

      {adding ? (
        <>
          <p className="text-sm text-muted-foreground">{L.hint}</p>
          <input ref={input} type="file" accept={TYPES.join(",")} className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-sm text-muted-foreground transition-colors hover:border-primary"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element -- local preview of the customer's own picture
              <img src={preview} alt="" className="max-h-64 rounded-md object-contain" />
            ) : (
              <ImageUp className="size-8 text-primary" />
            )}
            <span className="font-medium text-foreground">{file ? file.name : L.choose}</span>
          </button>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="button" size="lg" className="w-full" disabled={!file || busy} onClick={send}>
            {busy && <Loader2 className="animate-spin" />}
            {busy ? L.sending : L.send}
          </Button>
        </>
      ) : (
        count < MAX_PROOFS && (
          <Button type="button" variant="outline" onClick={() => setAdding(true)}>
            {L.another}
          </Button>
        )
      )}
    </div>
  );
}
