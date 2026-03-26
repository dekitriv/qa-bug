import { NextResponse } from "next/server";

import { getScenario } from "@/lib/scenarios";
import { runSubmission } from "@/lib/submitters";
import type { SubmitPayload } from "@/lib/types";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scenario = getScenario(slug);

  if (!scenario) {
    return NextResponse.json({ message: "Form not found." }, { status: 404 });
  }

  const payload = (await request.json()) as SubmitPayload;
  const result = runSubmission(scenario.slug, payload.values ?? {});

  return NextResponse.json(result, { status: result.status });
}
