import { NextResponse } from "next/server";

import { getScenario } from "@/lib/scenarios";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scenario = getScenario(slug);

  if (!scenario) {
    return NextResponse.json({ message: "Form not found." }, { status: 404 });
  }

  return NextResponse.json({ form: scenario });
}

