import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AdminLayout } from "@/components/AdminLayout";
import { fetchForms } from "@/lib/api";
import type { PublicFormSummary } from "@shared/types";

export function DashboardPage() {
  const [forms, setForms] = useState<PublicFormSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchForms()
      .then((response) => setForms(response.forms))
      .catch(() => setError("Backend is unavailable. Start the API server on port 4000."));
  }, []);

  return (
    <AdminLayout
      title="Forms"
      breadcrumb="Home / QA Forms"
      actions={
        <div className="toolbar-actions">
          <span className="soft-badge">API :4000</span>
          <span className="soft-badge">6 seeded forms</span>
        </div>
      }
    >
      <section className="content-card">
        <div className="table-toolbar">
          <div>
            <p className="section-title">Available scenarios</p>
            <p className="section-subtitle">
              Open any form, submit it, and inspect the request or response in the browser Network tab.
            </p>
          </div>
        </div>

        {error ? <div className="alert">{error}</div> : null}

        <div className="data-table">
          <div className="table-head table-row">
            <span>Form</span>
            <span>Type</span>
            <span>Progress</span>
            <span>Action</span>
          </div>
          {forms.map((form) => (
            <div key={form.slug} className="table-row">
              <div>
                <div className="row-title">{form.title}</div>
                <div className="row-subtitle">{form.description}</div>
              </div>
              <span className="row-muted">Simple form</span>
              <span className="row-muted">{form.progressLabel}</span>
              <div>
                <Link to={`/forms/${form.slug}`} className="table-link">
                  Open
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
