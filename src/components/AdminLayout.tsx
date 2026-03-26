import clsx from "clsx";
import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";

import { adminNavigation } from "@/lib/navigation";

export function AdminLayout({
  title,
  breadcrumb,
  actions,
  children
}: {
  title: string;
  breadcrumb: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <Link to="/" className="brand-box">
          <div className="brand-mark">Q</div>
          <div>
            <p className="brand-title">QA Forms Lab</p>
            <p className="brand-subtitle">Training Console</p>
          </div>
        </Link>

        <div className="sidebar-section">
          <p className="sidebar-label">Onboarding</p>
          <NavLink to="/" end className={({ isActive }) => clsx("sidebar-link", isActive && "active")}>
            Overview
          </NavLink>
          {adminNavigation.map((item) => (
            <NavLink
              key={item.slug}
              to={`/forms/${item.slug}`}
              className={({ isActive }) => clsx("sidebar-link", isActive && "active")}
            >
              {item.title}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="user-chip">QA</div>
          <div>
            <p className="footer-title">qa.operator</p>
            <p className="footer-subtitle">Software Admin</p>
          </div>
        </div>
      </aside>

      <section className="content-area">
        <header className="content-header">
          <div>
            <p className="breadcrumb">{breadcrumb}</p>
            <h1 className="content-title">{title}</h1>
          </div>
          <div className="header-actions">{actions}</div>
        </header>
        <div className="content-body">{children}</div>
      </section>
    </main>
  );
}
