import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";
import { normalizeData } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = normalizeData(await readData());
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray((body as { brands?: unknown }).brands)) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }
  const data = normalizeData(body);
  await writeData(data);
  return NextResponse.json({ ok: true });
}
