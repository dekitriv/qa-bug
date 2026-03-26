import Link from "next/link";
import { notFound } from "next/navigation";

import { FormWorkbench } from "@/components/form-workbench";
import { getScenario } from "@/lib/scenarios";

export default async function FormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scenario = getScenario(slug);

  if (!scenario) {
    notFound();
  }

  return (
    <main className="grid-plate min-h-screen px-6 py-8 md:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">{scenario.progressLabel}</p>
            <h1 className="mt-3 font-display text-5xl leading-none text-ink">{scenario.title}</h1>
          </div>
          <Link href="/" className="border border-ink/15 bg-white px-4 py-3 text-sm text-ink transition hover:bg-fog">
            Back to dashboard
          </Link>
        </div>
        <FormWorkbench scenario={scenario} />
      </div>
    </main>
  );
}

