import { NextResponse } from "next/server";

import { listPublicForms } from "@/lib/scenarios";

export async function GET() {
  return NextResponse.json({ forms: listPublicForms() });
}

