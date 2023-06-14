import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "/";

  revalidatePath(path);
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
