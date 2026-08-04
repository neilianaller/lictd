import { NextResponse } from "next/server";
import { getSslStatuses } from "@/lib/ssl";

// No caching: certificates are checked live on every request.
export const dynamic = "force-dynamic";

export async function GET() {
  const results = await getSslStatuses();
  return NextResponse.json(results);
}
