import { Navigate, Route, Routes } from "react-router-dom";

import { DashboardPage } from "@/pages/DashboardPage";
import { FormDetailsPage } from "@/pages/FormDetailsPage";
import { FormPage } from "@/pages/FormPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/forms/:slug" element={<FormPage />} />
      <Route path="/forms/:slug/details" element={<FormDetailsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
