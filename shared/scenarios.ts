import { z } from "zod";

import type { ApiResponse, BugSpec, FormScenario, FormSlug, PublicFormSummary } from "./types";

const serbianPhoneRegex = /^06\d{7,8}$/;

const baseEmployee = {
  employeeId: "HR-2026-041",
  fullName: "Mila Jovanovic",
  email: "mila.jovanovic@northgate.example",
  office: "Belgrade HQ"
};

const scenarios: FormScenario[] = [
  {
    slug: "personal-profile",
    title: "Personal Profile",
    description: "Create the starter employee profile with contact and role basics.",
    progressLabel: "Step 1 of 6",
    overview: "Mila is starting on April 14. Review the profile and submit the onboarding record.",
    submitLabel: "Create employee profile",
    expectedOutcome: "A new onboarding profile should be created and returned by the backend.",
    fields: [
      { name: "employeeId", label: "Employee ID", type: "text", required: true, halfWidth: true },
      { name: "fullName", label: "Full name", type: "text", required: true, halfWidth: true },
      { name: "email", label: "Work email", type: "email", required: true, halfWidth: true },
      { name: "title", label: "Job title", type: "text", required: true, halfWidth: true },
      { name: "startDate", label: "Start date", type: "date", required: true, halfWidth: true },
      { name: "office", label: "Office", type: "text", required: true, halfWidth: true }
    ],
    initialValues: {
      ...baseEmployee,
      title: "Senior Product Analyst",
      startDate: "2026-04-14"
    }
  },
  {
    slug: "emergency-contact",
    title: "Emergency Contact",
    description: "Capture Mila's emergency contact details before account activation.",
    progressLabel: "Step 2 of 6",
    overview: "The backend should reject malformed phone numbers and guide QA to the exact field.",
    submitLabel: "Save emergency contact",
    expectedOutcome: "Any phone validation error should appear inline on the phone field.",
    fields: [
      { name: "contactName", label: "Contact name", type: "text", required: true, halfWidth: true },
      {
        name: "relationship",
        label: "Relationship",
        type: "select",
        required: true,
        halfWidth: true,
        options: [
          { label: "Parent", value: "parent" },
          { label: "Partner", value: "partner" },
          { label: "Sibling", value: "sibling" }
        ]
      },
      {
        name: "phone",
        label: "Mobile phone",
        type: "tel",
        required: true,
        helperText: "Use a Serbian mobile number such as 0612345678.",
        halfWidth: true
      },
      { name: "email", label: "Email", type: "email", required: true, halfWidth: true }
    ],
    initialValues: {
      contactName: "Ana Jovanovic",
      relationship: "sibling",
      phone: "06123",
      email: "ana.jovanovic@example.com"
    }
  },
  {
    slug: "job-assignment",
    title: "Job Assignment",
    description: "Assign team, manager, and employment type for Mila's first day.",
    progressLabel: "Step 3 of 6",
    overview: "QA should be able to change assignment values and trust that the submitted payload matches the screen.",
    submitLabel: "Save job assignment",
    expectedOutcome: "The saved assignment should reflect the latest visible selections.",
    fields: [
      {
        name: "department",
        label: "Department",
        type: "select",
        required: true,
        halfWidth: true,
        options: [
          { label: "Operations", value: "operations" },
          { label: "Design Ops", value: "design-ops" },
          { label: "Product Strategy", value: "product-strategy" }
        ]
      },
      {
        name: "employmentType",
        label: "Employment type",
        type: "select",
        required: true,
        halfWidth: true,
        options: [
          { label: "Full-time", value: "full-time" },
          { label: "Contractor", value: "contractor" },
          { label: "Temporary", value: "temporary" }
        ]
      },
      { name: "manager", label: "Manager", type: "text", required: true, halfWidth: true },
      { name: "floor", label: "Floor zone", type: "text", required: true, halfWidth: true }
    ],
    initialValues: {
      department: "operations",
      employmentType: "full-time",
      manager: "Luka Savic",
      floor: "North Wing / Level 4"
    }
  },
  {
    slug: "payroll-setup",
    title: "Payroll Setup",
    description: "Record bank and tax details for the first payroll run.",
    progressLabel: "Step 4 of 6",
    overview: "Financial identifiers must survive submit exactly as entered, including leading zeroes.",
    submitLabel: "Save payroll profile",
    expectedOutcome: "The saved account number should match the visible field exactly.",
    fields: [
      { name: "bankName", label: "Bank name", type: "text", required: true, halfWidth: true },
      { name: "bankAccountNumber", label: "Account number", type: "text", required: true, halfWidth: true },
      { name: "taxNumber", label: "Tax number", type: "text", required: true, halfWidth: true },
      { name: "notes", label: "Payroll notes", type: "textarea", halfWidth: false }
    ],
    initialValues: {
      bankName: "Banca Intesa",
      bankAccountNumber: "0600123400019988",
      taxNumber: "18394721",
      notes: "Priority setup for the April payroll cutoff."
    }
  },
  {
    slug: "benefits-enrollment",
    title: "Benefits Enrollment",
    description: "Configure medical coverage and dependent information.",
    progressLabel: "Step 5 of 6",
    overview: "Family coverage should preserve dependent data and submit it for review.",
    submitLabel: "Save benefits enrollment",
    expectedOutcome: "Dependents should remain attached whenever family coverage is selected.",
    fields: [
      {
        name: "coverageTier",
        label: "Coverage tier",
        type: "select",
        required: true,
        halfWidth: true,
        options: [
          { label: "Single", value: "single" },
          { label: "Family", value: "family" },
          { label: "Employee + partner", value: "partner" }
        ]
      },
      { name: "coverageStart", label: "Coverage start", type: "date", required: true, halfWidth: true },
      {
        name: "dependents",
        label: "Dependents",
        type: "textarea",
        helperText: "List each dependent on a new line.",
        showWhen: {
          field: "coverageTier",
          equals: "family"
        }
      }
    ],
    initialValues: {
      coverageTier: "family",
      coverageStart: "2026-04-14",
      dependents: "Petar Jovanovic\nLena Jovanovic"
    }
  },
  {
    slug: "system-access-request",
    title: "System Access Request",
    description: "Grant the core tools Mila needs on day one.",
    progressLabel: "Step 6 of 6",
    overview: "All selected systems should be preserved in the saved result after submit.",
    submitLabel: "Provision access",
    expectedOutcome: "Every selected system should be present in the saved access request.",
    fields: [
      {
        name: "roleProfile",
        label: "Role profile",
        type: "select",
        required: true,
        halfWidth: true,
        options: [
          { label: "Analyst", value: "analyst" },
          { label: "Manager", value: "manager" },
          { label: "Admin", value: "admin" }
        ]
      },
      {
        name: "requestedSystems",
        label: "Requested systems",
        type: "multiselect",
        required: true,
        options: [
          { label: "Google Workspace", value: "google-workspace" },
          { label: "Jira", value: "jira" },
          { label: "Notion", value: "notion" },
          { label: "HubSpot", value: "hubspot" }
        ]
      },
      { name: "notes", label: "Access notes", type: "textarea" }
    ],
    initialValues: {
      roleProfile: "analyst",
      requestedSystems: ["google-workspace", "jira", "notion"],
      notes: "Standard onboarding bundle plus analytics workspace access."
    }
  }
];

const bugSpecs: BugSpec[] = [
  {
    slug: "personal-profile",
    category: "backend",
    title: "HTTP 500 on profile creation",
    summary: "The backend fails during creation and returns no created data.",
    reproduction: ["Open Personal Profile.", "Submit the prepared data.", "Observe the 500 response and missing saved result."],
    expectedBehavior: "The backend should create and return the employee profile."
  },
  {
    slug: "emergency-contact",
    category: "frontend",
    title: "Field validation not shown inline",
    summary: "The backend returns a field-level phone validation error, but the form does not map it to the phone input.",
    reproduction: ["Open Emergency Contact.", "Submit the default phone number.", "Observe only a generic error banner."],
    expectedBehavior: "The phone field should display the server validation message."
  },
  {
    slug: "job-assignment",
    category: "frontend",
    title: "Stale assignment payload",
    summary: "Changing department or employment type updates the screen, but submit sends the previous values.",
    reproduction: ["Open Job Assignment.", "Change department or employment type.", "Submit and compare the review panel."],
    expectedBehavior: "The submitted and saved values should match the latest visible selections."
  },
  {
    slug: "payroll-setup",
    category: "frontend",
    title: "Leading zero stripped from bank account",
    summary: "The client removes leading zeroes before submit.",
    reproduction: ["Open Payroll Setup.", "Submit the prepared account number.", "Compare the visible input to the request review."],
    expectedBehavior: "The submitted account number should match the visible field exactly."
  },
  {
    slug: "benefits-enrollment",
    category: "frontend",
    title: "Dependents dropped for family coverage",
    summary: "The client clears dependent data even when family coverage is selected.",
    reproduction: ["Open Benefits Enrollment.", "Keep family coverage selected and submit.", "Observe missing dependent data."],
    expectedBehavior: "Family coverage should preserve and submit dependent data."
  },
  {
    slug: "system-access-request",
    category: "backend",
    title: "Saved access request is incomplete",
    summary: "The backend acknowledges success but drops one or more requested systems from the saved result.",
    reproduction: ["Open System Access Request.", "Submit the prepared data.", "Compare selected systems to the saved result."],
    expectedBehavior: "The saved request should keep every selected system."
  }
];

const publicSummaries: PublicFormSummary[] = scenarios.map(({ slug, title, description, progressLabel }) => ({
  slug,
  title,
  description,
  progressLabel
}));

const scenarioMap = new Map<FormSlug, FormScenario>(scenarios.map((scenario) => [scenario.slug, scenario]));
const bugMap = new Map<FormSlug, BugSpec>(bugSpecs.map((bug) => [bug.slug, bug]));

export function listPublicForms(): PublicFormSummary[] {
  return publicSummaries;
}

export function getScenario(slug: string): FormScenario | null {
  return scenarioMap.get(slug as FormSlug) ?? null;
}

export function getBugSpec(slug: FormSlug): BugSpec {
  return bugMap.get(slug)!;
}

export const submitSchemas: Record<FormSlug, z.ZodType<Record<string, unknown>>> = {
  "personal-profile": z.object({
    employeeId: z.string().min(1),
    fullName: z.string().min(1),
    email: z.string().email(),
    title: z.string().min(1),
    startDate: z.string().min(1),
    office: z.string().min(1)
  }),
  "emergency-contact": z.object({
    contactName: z.string().min(1),
    relationship: z.string().min(1),
    phone: z.string().regex(serbianPhoneRegex, "Enter a valid Serbian mobile number."),
    email: z.string().email()
  }),
  "job-assignment": z.object({
    department: z.string().min(1),
    employmentType: z.string().min(1),
    manager: z.string().min(1),
    floor: z.string().min(1)
  }),
  "payroll-setup": z.object({
    bankName: z.string().min(1),
    bankAccountNumber: z.string().min(1),
    taxNumber: z.string().min(1),
    notes: z.string().optional().default("")
  }),
  "benefits-enrollment": z.object({
    coverageTier: z.string().min(1),
    coverageStart: z.string().min(1),
    dependents: z.string().optional().default("")
  }),
  "system-access-request": z.object({
    roleProfile: z.string().min(1),
    requestedSystems: z.array(z.string()).min(1),
    notes: z.string().optional().default("")
  })
};

export function validateSubmission(slug: FormSlug, values: Record<string, unknown>) {
  return submitSchemas[slug].safeParse(values);
}

export function buildValidationError(fieldErrors: Record<string, string[]>): ApiResponse<Record<string, string[]>> {
  return {
    success: false,
    status: 422,
    message: "Data validation failed.",
    data: fieldErrors
  };
}

export function buildNonFieldValidationError(message: string): ApiResponse<Record<string, string>> {
  return {
    success: false,
    status: 422,
    message: "Data validation failed.",
    data: {
      non_field_errors: message
    }
  };
}
