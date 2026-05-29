import { NextResponse, type NextRequest } from "next/server";
import { searchContent } from "@/lib/search";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") ?? "";

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchContent(query);
  return NextResponse.json({ results });
}
