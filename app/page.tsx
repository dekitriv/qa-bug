import Link from "next/link";

import { listPublicForms } from "@/lib/scenarios";

export default function DashboardPage() {
  const forms = listPublicForms();

  return (
    <main className="grid-plate min-h-screen px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="overflow-hidden border border-ink/15 bg-white/90 shadow-plate">
          <div className="grid gap-6 border-b border-ink/15 p-8 md:grid-cols-[1.5fr_0.9fr]">
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate">QA Forms Lab / HR Onboarding</p>
              <h1 className="max-w-3xl font-display text-5xl leading-none text-ink md:text-7xl">
                Six prefilled forms.
                <br />
                Six deliberate defects.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate">
                Review the prepared data, tweak a field or two when useful, submit, and compare the visible form state to
                the result panel. Every form contains exactly one bug.
              </p>
            </div>
            <div className="border-l border-ink/15 pl-0 md:pl-6">
              <div className="space-y-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate">Training brief</p>
                  <p className="mt-3 text-sm leading-6 text-slate">
                    This lab mimics a compact onboarding workflow for Mila Jovanovic. The backend is simulated through
                    route handlers, and the seed data resets at any time.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-ink/10 bg-fog px-4 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate">Mix</p>
                    <p className="mt-2 text-2xl font-semibold text-ink">4 FE / 2 BE</p>
                  </div>
                  <div className="border border-ink/10 bg-fog px-4 py-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate">Hosting</p>
                    <p className="mt-2 text-2xl font-semibold text-ink">Vercel-ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-px bg-ink/10 md:grid-cols-2 xl:grid-cols-3">
            {forms.map((form, index) => (
              <Link
                key={form.slug}
                href={`/forms/${form.slug}`}
                className="group bg-white p-6 transition hover:bg-[#fcfaf5]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate">{form.progressLabel}</p>
                    <h2 className="mt-4 font-display text-3xl leading-tight text-ink">{form.title}</h2>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-sm text-slate">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-5 max-w-sm text-sm leading-6 text-slate">{form.description}</p>
                <div className="mt-8 flex items-center justify-between border-t border-ink/10 pt-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-rust">Open form</span>
                  <span className="text-sm text-ink transition group-hover:translate-x-1">Inspect →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

