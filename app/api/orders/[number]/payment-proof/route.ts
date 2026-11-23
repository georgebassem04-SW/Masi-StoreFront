/**
 * TRANSFER SCREENSHOT — POST /api/orders/<number>/payment-proof   (form data: "photo" + "key")
 * ------------------------------------------------------------------
 * The order page (InstaPay / bank transfer) sends the customer's screenshot here. This route:
 *   1. Checks the picture: real JPEG / PNG / WebP (read from the bytes, not the name), max 5 MB
 *   2. Sends it with the order page key to the backend (lib/api → uploadPaymentProof)
 * The order then waits as "awaiting transfer" until staff press "Confirm payment received" in the dashboard.
 *
 * Answers: 200 { ok: true, count } · 4xx { ok: false, error: "photo" | "not_found" | "not_allowed" | "too_many" }
 */
import { NextResponse, type NextRequest } from "next/server";
import { api } from "@/lib/api";
import { photoType } from "@/lib/validation/custom-request";

const MAX_MB = 5;
const STATUS = { not_found: 404, not_allowed: 409, too_many: 409, photo: 422 } as const;

export async function POST(request: NextRequest, ctx: RouteContext<"/api/orders/[number]/payment-proof">) {
  const { number } = await ctx.params;
  const form = await request.formData().catch(() => null);
  const key = form?.get("key");
  const file = form?.get("photo");
  if (!form || typeof key !== "string" || !key || !file || typeof file === "string") {
    return NextResponse.json({ ok: false, error: "photo" }, { status: 422 });
  }
  if (file.size === 0 || file.size > MAX_MB * 1024 * 1024) return NextResponse.json({ ok: false, error: "photo" }, { status: 422 });
  const data = Buffer.from(await file.arrayBuffer());
  const type = photoType(data);
  if (!type) return NextResponse.json({ ok: false, error: "photo" }, { status: 422 });

  try {
    const result = await api.uploadPaymentProof(decodeURIComponent(number), key, { data, type, name: file.name.slice(0, 100) || "transfer" });
    return NextResponse.json(result, { status: result.ok ? 200 : STATUS[result.error] });
  } catch (error) {
    console.error("payment proof upload failed", error);
    return NextResponse.json({ ok: false, error: "server" }, { status: 502 });
  }
}
