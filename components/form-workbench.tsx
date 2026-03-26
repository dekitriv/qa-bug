"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { applyClientBugTransform } from "@/lib/client-bugs";
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
  setValue
}: {
  field: FieldConfig;
  register: ReturnType<typeof useForm<Record<string, unknown>>>["register"];
  error?: string;
  values: Record<string, unknown>;
  setValue: ReturnType<typeof useForm<Record<string, unknown>>>["setValue"];
}) {
  if (field.showWhen && values[field.showWhen.field] !== field.showWhen.equals) {
    return null;
  }

  const requiredMsg = field.required ? `${field.label} je obavezno polje.` : false;

  if (field.type === "file") {
    return (
      <label className={clsx("field-shell", field.halfWidth ? "md:col-span-1" : "md:col-span-2")}>
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate">{field.label}</span>
        <input type="hidden" {...register(field.name, { required: requiredMsg })} />
        <input
          type="file"
          accept=".pdf,application/pdf"
          className="mt-1 w-full border border-ink/15 bg-white px-3 py-2 text-sm"
          aria-label={field.label}
          onChange={(event) => {
            const file = event.target.files?.[0];
            setValue(field.name, file?.name ?? "", { shouldValidate: true });
          }}
        />
        {field.helperText ? <span className="text-xs text-slate">{field.helperText}</span> : null}
        {error ? <span className="field-error">{error}</span> : null}
      </label>
    );
  }

  if (field.type === "select") {
    const registered = register(field.name, {
      required: requiredMsg
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
      required: requiredMsg
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
                    required: requiredMsg
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
    required: requiredMsg
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setError,
    clearErrors,
    setValue
  } = useForm<Record<string, unknown>>({
    defaultValues: cloneValues(scenario.initialValues)
  });

  const currentValues = (useWatch({ control }) as Record<string, unknown>) ?? {};
  const visibleJson = useMemo(() => prettyPrintJson(currentValues), [currentValues]);

  async function onSubmit(values: Record<string, unknown>) {
    setServerErrorBanner(null);
    clearErrors();

    const buggedValues = applyClientBugTransform(scenario.slug, values);
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
      if (scenario.slug === "job-assignment" && result.fieldErrors) {
        for (const [key, msg] of Object.entries(result.fieldErrors)) {
          setError(key, { message: msg });
        }
      }
      setServerErrorBanner(result.message);
    }
  }

  function handleReset() {
    reset(cloneValues(scenario.initialValues));
    clearErrors();
    setServerResult(null);
    setServerErrorBanner(null);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="border border-ink/15 bg-white shadow-plate">
        <div className="border-b border-ink/15 px-6 py-5">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate">Pripremljen scenario</p>
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-4xl leading-none text-ink">{scenario.title}</h2>
              {scenario.overview ? (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate">{scenario.overview}</p>
              ) : null}
            </div>
            {scenario.expectedOutcome ? (
              <div className="border border-ink/10 bg-fog px-4 py-3 text-sm text-slate">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-rust">Očekivano</span>
                <p className="mt-2 max-w-xs leading-6 text-ink">{scenario.expectedOutcome}</p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="p-6">
          <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            {scenario.fields.map((field) => (
              <FieldRenderer
                key={field.name}
                field={field}
                register={register}
                error={errors[field.name]?.message as string | undefined}
                values={currentValues}
                setValue={setValue}
              />
            ))}
            <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-5 md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="border border-ink bg-ink px-5 py-3 text-sm text-white transition hover:bg-[#2b2b2b] disabled:opacity-70"
              >
                {isSubmitting ? "Slanje…" : scenario.submitLabel}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="border border-ink/15 bg-white px-5 py-3 text-sm text-ink transition hover:bg-fog"
              >
                Resetuj na pripremljene podatke
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <section className="border border-ink/15 bg-white shadow-plate">
          <div className="border-b border-ink/15 px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate">Vidljivo stanje formulara</p>
          </div>
          <pre className="json-block">{visibleJson}</pre>
        </section>

        <section className="border border-ink/15 bg-white shadow-plate">
          <div className="border-b border-ink/15 px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate">Pregled slanja</p>
          </div>
          <div className="space-y-4 p-5">
            {serverErrorBanner ? (
              <div role="alert" className="border border-rust/25 bg-[#fff2ea] px-4 py-3 text-sm text-rust">
                {serverErrorBanner}
              </div>
            ) : null}

            {!serverResult ? (
              <p className="text-sm leading-6 text-slate">Pošaljite formular da biste videli zahtev i sačuvani rezultat.</p>
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
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-slate">Poslati payload</p>
                    <pre className="json-block">{prettyPrintJson(serverResult.submittedData)}</pre>
                  </div>
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-slate">Sačuvani rezultat</p>
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
