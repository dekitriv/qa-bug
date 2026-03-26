import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { AdminLayout } from "@/components/AdminLayout";
import { FormWorkbench } from "@/components/FormWorkbench";
import { fetchForm } from "@/lib/api";
import type { FormScenario } from "@shared/types";

export function FormPage() {
  const { slug } = useParams();
  const [scenario, setScenario] = useState<FormScenario | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      return;
    }

    setScenario(null);
    setError(null);

    fetchForm(slug)
      .then((response) => setScenario(response.form))
      .catch(() => setError("Nije moguće učitati formular sa bekenda."));
  }, [slug]);

  return (
    <AdminLayout
      title={scenario?.title ?? "Učitavanje…"}
      breadcrumb={`Početna / QA formulari / ${scenario?.title ?? "Učitavanje"}`}
      actions={scenario ? <span className="soft-badge">{scenario.progressLabel}</span> : null}
    >
      {error ? <div className="alert">{error}</div> : null}
      {!error && !scenario ? (
        <section className="content-card">
          <div className="card-content">Učitavanje formulara…</div>
        </section>
      ) : null}
      {scenario ? <FormWorkbench scenario={scenario} /> : null}
    </AdminLayout>
  );
}
