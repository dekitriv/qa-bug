import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { AdminLayout } from "@/components/AdminLayout";
import { fetchForm, fetchFormDetails } from "@/lib/api";
import type { FormScenario } from "@shared/types";

function renderValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "boolean") {
    return value ? "Da" : "Ne";
  }

  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
}

export function FormDetailsPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [scenario, setScenario] = useState<FormScenario | null>(null);
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!slug) {
      return;
    }

    setScenario(null);
    setRecord(null);
    setError(null);

    if (!token) {
      setError("Nedostaje token sačuvanih detalja.");
      return;
    }

    Promise.all([fetchForm(slug), fetchFormDetails(slug, token)])
      .then(([formResponse, detailsResponse]) => {
        setScenario(formResponse.form);
        setRecord(detailsResponse.record);
      })
      .catch(() => setError("Nije moguće učitati sačuvane detalje sa bekenda."));
  }, [searchParams, slug]);

  return (
    <AdminLayout
      title={scenario ? `${scenario.title} — detalji` : "Detalji"}
      breadcrumb={`Početna / QA formulari / ${scenario?.title ?? "Detalji"} / Detalji`}
      actions={
        slug ? (
          <div className="toolbar-actions">
            <Link to={`/forms/${slug}`} className="secondary-btn">
              Nazad na formular
            </Link>
          </div>
        ) : null
      }
    >
      {error ? <div className="alert">{error}</div> : null}
      {!error && (!scenario || !record) ? (
        <section className="content-card">
          <div className="card-content">Učitavanje detalja…</div>
        </section>
      ) : null}
      {scenario && record ? (
        <section className="content-card compact">
          <div className="card-head">
            <div>
              <p className="section-title">{scenario.title}</p>
              <p className="section-subtitle">Podaci učitani sa bekend endpointa za detalje.</p>
            </div>
            <div className="expect-chip">Detalji</div>
          </div>
          <div className="card-content">
            <div className="details-list">
              {scenario.fields.map((field) => (
                <div key={field.name} className="details-row">
                  <div className="details-label">{field.label}</div>
                  <div className="details-value">{renderValue(record[field.name])}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </AdminLayout>
  );
}
