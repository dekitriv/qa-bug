import clsx from "clsx";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { submitForm } from "@/lib/api";
import { applyClientBugTransform } from "@/lib/clientBugs";
import { cloneValues } from "@/lib/utils";
import type { FieldConfig, FormScenario } from "@shared/types";

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
      <label className={clsx("field-shell", !field.halfWidth && "full")}>
        <span className="eyebrow">{field.label}</span>
        <input type="hidden" {...register(field.name, { required: requiredMsg })} />
        <input
          type="file"
          accept=".pdf,application/pdf"
          aria-label={field.label}
          className="file-input"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setValue(field.name, file?.name ?? "", { shouldValidate: true });
          }}
        />
        {field.helperText ? <span className="helper-text">{field.helperText}</span> : null}
        {error ? <span className="field-error">{error}</span> : null}
      </label>
    );
  }

  if (field.type === "select") {
    const registered = register(field.name, {
      required: requiredMsg
    });

    return (
      <label className={clsx("field-shell", !field.halfWidth && "full")}>
        <span className="eyebrow">{field.label}</span>
        <select aria-label={field.label} {...registered}>
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {field.helperText ? <span className="helper-text">{field.helperText}</span> : null}
        {error ? <span className="field-error">{error}</span> : null}
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className={clsx("field-shell", !field.halfWidth && "full")}>
        <span className="eyebrow">{field.label}</span>
        <textarea aria-label={field.label} {...register(field.name, { required: requiredMsg })} />
        {field.helperText ? <span className="helper-text">{field.helperText}</span> : null}
        {error ? <span className="field-error">{error}</span> : null}
      </label>
    );
  }

  if (field.type === "multiselect") {
    const selected = Array.isArray(values[field.name]) ? (values[field.name] as string[]) : [];

    return (
      <fieldset className="field-shell full">
        <legend className="eyebrow">{field.label}</legend>
        <div className="checkbox-grid">
          {(field.options ?? []).map((option) => (
            <label key={option.value} className={clsx("checkbox-card", selected.includes(option.value) && "selected")}>
              <input
                type="checkbox"
                value={option.value}
                {...register(field.name, { required: requiredMsg })}
                defaultChecked={selected.includes(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {error ? <span className="field-error">{error}</span> : null}
      </fieldset>
    );
  }

  return (
    <label className={clsx("field-shell", !field.halfWidth && "full")}>
      <span className="eyebrow">{field.label}</span>
      <input
        type={field.type}
        aria-label={field.label}
        {...register(field.name, { required: requiredMsg })}
      />
      {field.helperText ? <span className="helper-text">{field.helperText}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

export function FormWorkbench({ scenario }: { scenario: FormScenario }) {
  const navigate = useNavigate();
  const [serverErrorBanner, setServerErrorBanner] = useState<string | null>(null);
  const [serverSuccessBanner, setServerSuccessBanner] = useState<string | null>(null);

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

  async function onSubmit(values: Record<string, unknown>) {
    setServerErrorBanner(null);
    setServerSuccessBanner(null);
    clearErrors();
    try {
      const buggedValues = applyClientBugTransform(scenario.slug, values);
      const { ok, body } = await submitForm(scenario.slug, { values: buggedValues });

      if (!ok) {
        if (
          scenario.slug === "job-assignment" &&
          body.status === 422 &&
          body.data &&
          typeof body.data === "object" &&
          !Array.isArray(body.data)
        ) {
          const fieldErrors = body.data as Record<string, string[] | string>;
          for (const [key, val] of Object.entries(fieldErrors)) {
            if (key === "non_field_errors") {
              continue;
            }
            if (Array.isArray(val) && val[0]) {
              setError(key, { message: val[0] });
            }
          }
        }
        setServerErrorBanner(body.message);
        return;
      }

      setServerSuccessBanner(body.message);
      const recordToken =
        body.data && typeof body.data === "object" && "recordToken" in body.data
          ? String((body.data as { recordToken: unknown }).recordToken)
          : null;

      if (!recordToken) {
        setServerErrorBanner("Bekend nije vratio token sačuvanih detalja.");
        return;
      }

      navigate(`/forms/${scenario.slug}/details?token=${encodeURIComponent(recordToken)}`);
    } catch {}
  }

  function handleReset() {
    reset(cloneValues(scenario.initialValues));
    clearErrors();
    setServerErrorBanner(null);
    setServerSuccessBanner(null);
  }

  return (
    <section className="form-screen">
      <div className="form-column">
        <section className="content-card compact">
          <div className="card-head">
            <div>
              <p className="section-title">{scenario.title}</p>
              {scenario.overview ? <p className="section-subtitle">{scenario.overview}</p> : null}
            </div>
            <div className="expect-chip">{scenario.progressLabel}</div>
          </div>

          <div className="card-content">
            {serverErrorBanner ? <div className="alert">{serverErrorBanner}</div> : null}
            {serverSuccessBanner ? <div className="success-alert">{serverSuccessBanner}</div> : null}

            <form className="form-grid compact-grid" onSubmit={handleSubmit(onSubmit)}>
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
              <div className="actions simple-actions" style={{ gridColumn: "1 / -1" }}>
                <button type="submit" disabled={isSubmitting} className="primary-btn blue-btn">
                  {isSubmitting ? "Čuvanje…" : scenario.submitLabel}
                </button>
                <button type="button" onClick={handleReset} className="secondary-btn">
                  Resetuj
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </section>
  );
}
