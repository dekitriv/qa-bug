"use client";

import clsx from "clsx";
import { useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { applyClientBugTransform, createClientBugRefs } from "@/lib/client-bugs";
import type { FieldConfig, FormScenario, SubmitResult } from "@/lib/types";
import { cloneValues, prettyPrintJson } from "@/lib/utils";

interface FormWorkbenchProps {
  scenario: FormScenario;
}

function FieldRenderer({
  field,
  register,
  error,
  values,
  onStaleSelectChange
}: {
  field: FieldConfig;
  register: ReturnType<typeof useForm<Record<string, unknown>>>["register"];
  error?: string;
  values: Record<string, unknown>;
  onStaleSelectChange: (fieldName: string, nextValue: string) => void;
}) {
  if (field.showWhen && values[field.showWhen.field] !== field.showWhen.equals) {
    return null;
  }

  if (field.type === "select") {
    const registered = register(field.name, {
      required: field.required ? `${field.label} is required.` : false,
      onChange: (event) => {
        onStaleSelectChange(field.name, event.target.value);
      }
    });

    return (
      <label className={clsx("field-shell", field.halfWidth ? "md:col-span-1" : "md:col-span-2")}>
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate">{field.label}</span>
        <select {...registered} aria-label={field.label}>
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {field.helperText ? <span className="text-xs text-slate">{field.helperText}</span> : null}
        {error ? <span className="field-error">{error}</span> : null}
      </label>
    );
  }

  if (field.type === "textarea") {
    const registered = register(field.name, {
      required: field.required ? `${field.label} is required.` : false
    });

    return (
      <label className={clsx("field-shell", field.halfWidth ? "md:col-span-1" : "md:col-span-2")}>
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate">{field.label}</span>
        <textarea {...registered} aria-label={field.label} placeholder={field.placeholder} />
        {field.helperText ? <span className="text-xs text-slate">{field.helperText}</span> : null}
        {error ? <span className="field-error">{error}</span> : null}
      </label>
    );
  }

  if (field.type === "multiselect") {
    const selected = Array.isArray(values[field.name]) ? (values[field.name] as string[]) : [];

    return (
      <fieldset className="field-shell md:col-span-2">
        <legend className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate">{field.label}</legend>
        <div className="grid gap-3 md:grid-cols-2">
          {(field.options ?? []).map((option) => {
            const checked = selected.includes(option.value);
            return (
              <label
                key={option.value}
                className={clsx(
                  "flex items-center gap-3 border px-4 py-3 text-sm transition",
                  checked ? "border-brass bg-[#faf5eb]" : "border-ink/15 bg-white"
                )}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  {...register(field.name, {
                    required: field.required ? `${field.label} is required.` : false
                  })}
                  defaultChecked={checked}
                  className="h-4 w-4 accent-amber-800"
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
        {error ? <span className="field-error">{error}</span> : null}
      </fieldset>
    );
  }

  const registered = register(field.name, {
    required: field.required ? `${field.label} is required.` : false
  });

  return (
    <label className={clsx("field-shell", field.halfWidth ? "md:col-span-1" : "md:col-span-2")}>
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate">{field.label}</span>
      <input type={field.type} {...registered} aria-label={field.label} placeholder={field.placeholder} />
      {field.helperText ? <span className="text-xs text-slate">{field.helperText}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

export function FormWorkbench({ scenario }: FormWorkbenchProps) {
  const [serverResult, setServerResult] = useState<SubmitResult | null>(null);
  const [serverErrorBanner, setServerErrorBanner] = useState<string | null>(null);
  const clientBugRefs = useRef(createClientBugRefs(scenario));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control
  } = useForm<Record<string, unknown>>({
    defaultValues: cloneValues(scenario.initialValues)
  });

  const currentValues = (useWatch({ control }) as Record<string, unknown>) ?? {};
  const visibleJson = useMemo(() => prettyPrintJson(currentValues), [currentValues]);

  async function onSubmit(values: Record<string, unknown>) {
    setServerErrorBanner(null);

    const buggedValues = applyClientBugTransform(scenario.slug, values, clientBugRefs.current);
    const response = await fetch(`/api/forms/${scenario.slug}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ values: buggedValues })
    });

    const result = (await response.json()) as SubmitResult;
    setServerResult(result);

    if (!response.ok) {
      setServerErrorBanner(result.message);
    }
  }

  function handleReset() {
    reset(cloneValues(scenario.initialValues));
    clientBugRefs.current = createClientBugRefs(scenario);
    setServerResult(null);
    setServerErrorBanner(null);
  }

  function handleStaleSelectChange(fieldName: string, nextValue: string) {
    if (scenario.slug !== "job-assignment") {
      return;
    }

    const currentVisibleValue = currentValues[fieldName];
    clientBugRefs.current.jobAssignmentShadow[fieldName] = currentVisibleValue ?? nextValue;
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="border border-ink/15 bg-white shadow-plate">
        <div className="border-b border-ink/15 px-6 py-5">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate">Prepared scenario</p>
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-4xl leading-none text-ink">{scenario.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">{scenario.overview}</p>
            </div>
            <div className="border border-ink/10 bg-fog px-4 py-3 text-sm text-slate">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-rust">Expected</span>
              <p className="mt-2 max-w-xs leading-6 text-ink">{scenario.expectedOutcome}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6 border border-ink/10 bg-[#faf5eb] px-4 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-rust">Exercise note</p>
            <p className="mt-2 text-sm leading-6 text-slate">
              Review the defaults, edit fields when useful, submit, and compare the visible form state to the backend
              review panel. The seed data can be restored at any time.
            </p>
          </div>
          <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            {scenario.fields.map((field) => (
              <FieldRenderer
                key={field.name}
                field={field}
                register={register}
                error={errors[field.name]?.message as string | undefined}
                values={currentValues}
                onStaleSelectChange={handleStaleSelectChange}
              />
            ))}
            <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-5 md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="border border-ink bg-ink px-5 py-3 text-sm text-white transition hover:bg-[#2b2b2b] disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : scenario.submitLabel}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="border border-ink/15 bg-white px-5 py-3 text-sm text-ink transition hover:bg-fog"
              >
                Reset to prepared data
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <section className="border border-ink/15 bg-white shadow-plate">
          <div className="border-b border-ink/15 px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate">Visible form state</p>
          </div>
          <pre className="json-block">{visibleJson}</pre>
        </section>

        <section className="border border-ink/15 bg-white shadow-plate">
          <div className="border-b border-ink/15 px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate">Submission review</p>
          </div>
          <div className="space-y-4 p-5">
            {serverErrorBanner ? (
              <div role="alert" className="border border-rust/25 bg-[#fff2ea] px-4 py-3 text-sm text-rust">
                {serverErrorBanner}
              </div>
            ) : null}

            {!serverResult ? (
              <p className="text-sm leading-6 text-slate">Submit the form to inspect the request and saved result.</p>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={clsx(
                      "border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em]",
                      serverResult.ok ? "border-brass/30 bg-[#fbf5e7] text-brass" : "border-rust/25 bg-[#fff2ea] text-rust"
                    )}
                  >
                    HTTP {serverResult.status}
                  </span>
                  <span className="text-sm text-ink">{serverResult.message}</span>
                </div>
                <ul className="space-y-2 text-sm leading-6 text-slate">
                  {serverResult.reviewNotes.map((note) => (
                    <li key={note}>• {note}</li>
                  ))}
                </ul>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-slate">Submitted payload</p>
                    <pre className="json-block">{prettyPrintJson(serverResult.submittedData)}</pre>
                  </div>
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-slate">Saved result</p>
                    <pre className="json-block">{prettyPrintJson(serverResult.savedData)}</pre>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

