import type { PublicFormSummary } from "@shared/types";

export const adminNavigation: PublicFormSummary[] = [
  {
    slug: "personal-profile",
    title: "Personal Profile",
    description: "Basic employee profile",
    progressLabel: "Step 1 of 6"
  },
  {
    slug: "emergency-contact",
    title: "Emergency Contact",
    description: "Emergency contact details",
    progressLabel: "Step 2 of 6"
  },
  {
    slug: "job-assignment",
    title: "Job Assignment",
    description: "Department and manager setup",
    progressLabel: "Step 3 of 6"
  },
  {
    slug: "payroll-setup",
    title: "Payroll Setup",
    description: "Banking and payroll setup",
    progressLabel: "Step 4 of 6"
  },
  {
    slug: "benefits-enrollment",
    title: "Benefits Enrollment",
    description: "Coverage and dependents",
    progressLabel: "Step 5 of 6"
  },
  {
    slug: "system-access-request",
    title: "System Access Request",
    description: "Tool and permission request",
    progressLabel: "Step 6 of 6"
  }
];

