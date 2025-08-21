import { NextRequest } from "next/server";

function hexToUint8Array(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const len = clean.length;
  const bytes = new Uint8Array(len / 2);
  for (let i = 0; i < len; i += 2) {
    bytes[i / 2] = parseInt(clean.substr(i, 2), 16);
  }
  return bytes;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    if (Number.isNaN(id)) {
      return new Response("Invalid id", { status: 400 });
    }

    // Fetch the insight to get attachment_legacy
    const baseUrl = new URL(request.url);
    baseUrl.pathname = `/api/insights/${id}`;
    baseUrl.search = "";

    const res = await fetch(baseUrl.toString(), { cache: "no-store" });
    if (!res.ok) {
      return new Response(`Failed to fetch insight: ${res.status}`, { status: 502 });
    }
    const insight = await res.json();

    const hex = insight?.attachment_legacy as string | undefined;
    if (!hex || typeof hex !== "string" || hex.length < 8) {
      return new Response("PDF not found", { status: 404 });
    }

    const bytes = hexToUint8Array(hex);
    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="insight-${id}.pdf"`,
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch (e) {
    return new Response(`Failed to render PDF: ${String(e)}`, { status: 500 });
  }
}
