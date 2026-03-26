import { Buffer } from "node:buffer";
import { z } from "zod";

const serbianPhoneRegex = /^06\d{7,8}$/;

const baseEmployee = {
  employeeId: "HR-2026-041",
  fullName: "Mila Jovanovic",
  email: "mila.jovanovic@northgate.example",
  office: "Belgrade HQ"
};

const scenarios = [
  {
    slug: "personal-profile",
    title: "Personal Profile",
    description: "Basic employee profile",
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
    description: "Emergency contact details",
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
    description: "Department and manager setup",
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
    description: "Banking and payroll setup",
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
    description: "Coverage and dependents",
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
    description: "Tool and permission request",
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

const scenarioMap = new Map(scenarios.map((scenario) => [scenario.slug, scenario]));

const submitSchemas = {
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

function toBase64Url(value) {
  return Buffer.from(value, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf-8");
}

function createDetailsToken(slug, record) {
  return toBase64Url(JSON.stringify({ slug, record }));
}

function parseDetailsToken(token, expectedSlug) {
  try {
    const parsed = JSON.parse(fromBase64Url(token));
    if (parsed.slug !== expectedSlug || typeof parsed.record !== "object" || parsed.record === null || Array.isArray(parsed.record)) {
      return null;
    }
    return parsed.record;
  } catch {
    return null;
  }
}

function collectFieldErrors(error) {
  if (typeof error !== "object" || error === null || !("issues" in error)) {
    return {};
  }

  return error.issues.reduce((acc, issue) => {
    const key = String(issue.path[0] ?? "form");
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(issue.message);
    return acc;
  }, {});
}

function validationError(fieldErrors) {
  return {
    success: false,
    status: 422,
    message: "Data validation failed.",
    data: fieldErrors
  };
}

function nonFieldValidationError(message) {
  return {
    success: false,
    status: 422,
    message: "Data validation failed.",
    data: {
      non_field_errors: message
    }
  };
}

function notFound() {
  return {
    success: false,
    status: 404,
    message: "Resource not found.",
    data: null
  };
}

function methodNotAllowed() {
  return {
    success: false,
    status: 405,
    message: "Method not allowed.",
    data: null
  };
}

export function getFormsResponse() {
  return {
    success: true,
    status: 200,
    message: "Forms fetched successfully.",
    data: {
      forms: scenarios.map(({ slug, title, description, progressLabel }) => ({
        slug,
        title,
        description,
        progressLabel
      }))
    }
  };
}

export function getFormResponse(slug) {
  const scenario = scenarioMap.get(slug);
  if (!scenario) {
    return notFound();
  }

  return {
    success: true,
    status: 200,
    message: "Form fetched successfully.",
    data: {
      form: scenario
    }
  };
}

export function submitFormResponse(slug, payload) {
  const scenario = scenarioMap.get(slug);
  if (!scenario) {
    return notFound();
  }

  const safePayload = typeof payload === "object" && payload !== null && "values" in payload ? payload : { values: {} };
  const validation = submitSchemas[slug].safeParse(safePayload.values ?? {});

  if (!validation.success) {
    return validationError(collectFieldErrors(validation.error));
  }

  const validValues = validation.data;
  let result;

  switch (slug) {
    case "personal-profile":
      result = {
        success: false,
        status: 500,
        message: "Internal server error.",
        data: null
      };
      break;
    case "system-access-request":
      result = {
        success: true,
        status: 201,
        message: "Access request submitted.",
        data: {
          ...validValues,
          requestedSystems: Array.isArray(validValues.requestedSystems)
            ? validValues.requestedSystems.slice(0, Math.max(validValues.requestedSystems.length - 1, 1))
            : validValues.requestedSystems
        }
      };
      break;
    default:
      result = {
        success: true,
        status: 201,
        message:
          slug === "emergency-contact"
            ? "Emergency contact saved."
            : slug === "job-assignment"
              ? "Job assignment saved."
              : slug === "payroll-setup"
                ? "Payroll profile saved."
                : "Benefits enrollment saved.",
        data: validValues
      };
      break;
  }

  if (result.success && result.data && typeof result.data === "object" && !Array.isArray(result.data)) {
    return {
      success: true,
      status: result.status,
      message: result.message,
      data: {
        record: result.data,
        recordToken: createDetailsToken(slug, result.data)
      }
    };
  }

  return result;
}

export function getFormDetailsResponse(slug, token) {
  const scenario = scenarioMap.get(slug);
  if (!scenario) {
    return notFound();
  }

  if (!token) {
    return nonFieldValidationError("Saved details token is missing.");
  }

  const record = parseDetailsToken(token, slug);
  if (!record) {
    return nonFieldValidationError("Saved details token is invalid.");
  }

  return {
    success: true,
    status: 200,
    message: "Details fetched successfully.",
    data: {
      record
    }
  };
}

export function methodNotAllowedResponse() {
  return methodNotAllowed();
}
