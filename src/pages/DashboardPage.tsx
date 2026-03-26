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
      .catch(() => setError("API nije dostupan. Pokrenite server na portu 4000."));
  }, []);

  return (
    <AdminLayout
      title="Formulari"
      breadcrumb="Početna / QA formulari"
      actions={
        <div className="toolbar-actions">
          <span className="soft-badge">API :4000</span>
          <span className="soft-badge">6 scenarija sa greškama</span>
        </div>
      }
    >
      <section className="content-card">
        <div className="table-toolbar">
          <div>
            <p className="section-title">Šest unapred popunjenih formulara. Šest namernih defekata.</p>
            <p className="section-subtitle">
              Otvorite bilo koji formular, pošaljite ga i pregledajte zahtev ili odgovor u Network tabu pregledača.
            </p>
          </div>
        </div>

        {error ? <div className="alert">{error}</div> : null}

        <div className="data-table">
          <div className="table-head table-row">
            <span>Formular</span>
            <span>Tip</span>
            <span>Napredak</span>
            <span>Akcija</span>
          </div>
          {forms.map((form) => (
            <div key={form.slug} className="table-row">
              <div>
                <div className="row-title">{form.title}</div>
                {form.description ? <div className="row-subtitle">{form.description}</div> : null}
              </div>
              <span className="row-muted">Jednostavan formular</span>
              <span className="row-muted">{form.progressLabel}</span>
              <div>
                <Link to={`/forms/${form.slug}`} className="table-link">
                  Otvori
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
