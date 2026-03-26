import clsx from "clsx";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { submitForm } from "@/lib/api";
import { applyClientBugTransform, createClientBugRefs } from "@/lib/clientBugs";
import { cloneValues } from "@/lib/utils";
import type { FieldConfig, FormScenario } from "@shared/types";

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
      onChange: (event) => onStaleSelectChange(field.name, event.target.value)
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
        <textarea
          aria-label={field.label}
          {...register(field.name, { required: field.required ? `${field.label} is required.` : false })}
        />
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
                {...register(field.name, { required: field.required ? `${field.label} is required.` : false })}
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
        {...register(field.name, { required: field.required ? `${field.label} is required.` : false })}
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

  async function onSubmit(values: Record<string, unknown>) {
    setServerErrorBanner(null);
    setServerSuccessBanner(null);
    try {
      const buggedValues = applyClientBugTransform(scenario.slug, values, clientBugRefs.current);
      const { ok, body } = await submitForm(scenario.slug, { values: buggedValues });

      if (!ok) {
        setServerErrorBanner(body.message);
        return;
      }

      setServerSuccessBanner(body.message);
      const recordToken =
        body.data && typeof body.data === "object" && "recordToken" in body.data
          ? String((body.data as { recordToken: unknown }).recordToken)
          : null;

      if (!recordToken) {
        setServerErrorBanner("Saved details token was not returned by the backend.");
        return;
      }

      navigate(`/forms/${scenario.slug}/details?token=${encodeURIComponent(recordToken)}`);
    } catch {
      setServerErrorBanner("The backend request failed before a response was returned.");
    }
  }

  function handleReset() {
    reset(cloneValues(scenario.initialValues));
    clientBugRefs.current = createClientBugRefs(scenario);
    setServerErrorBanner(null);
    setServerSuccessBanner(null);
  }

  function handleStaleSelectChange(fieldName: string, nextValue: string) {
    if (scenario.slug !== "job-assignment") {
      return;
    }

    const currentVisibleValue = currentValues[fieldName];
    clientBugRefs.current.jobAssignmentShadow[fieldName] = currentVisibleValue ?? nextValue;
  }

  return (
    <section className="form-screen">
      <div className="form-column">
        <section className="content-card compact">
          <div className="card-head">
            <div>
              <p className="section-title">{scenario.title}</p>
              <p className="section-subtitle">{scenario.overview}</p>
            </div>
            <div className="expect-chip">{scenario.progressLabel}</div>
          </div>

          <div className="card-content">
            <div className="soft-panel">
              <p className="soft-panel-title">QA note</p>
              <p className="soft-panel-text">
                Open browser Network, submit the form, and inspect the request or response there. The page stays simple
                on purpose.
              </p>
            </div>

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
                  onStaleSelectChange={handleStaleSelectChange}
                />
              ))}
              <div className="actions simple-actions" style={{ gridColumn: "1 / -1" }}>
                <button type="submit" disabled={isSubmitting} className="primary-btn blue-btn">
                  {isSubmitting ? "Saving..." : scenario.submitLabel}
                </button>
                <button type="button" onClick={handleReset} className="secondary-btn">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </section>
  );
}
