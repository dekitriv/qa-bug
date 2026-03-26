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
    description: "",
    progressLabel: "Step 1 of 6",
    overview: "",
    submitLabel: "Create employee profile",
    expectedOutcome: "",
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
    title: "Kontakt u hitnim slučajevima",
    description: "",
    progressLabel: "Korak 2 od 6",
    overview: "",
    submitLabel: "Sačuvaj kontakt u hitnim slučajevima",
    expectedOutcome: "",
    fields: [
      { name: "contactName", label: "Ime kontakta", type: "text", required: true, halfWidth: true },
      {
        name: "relationship",
        label: "Srodstvo / odnos",
        type: "select",
        required: true,
        halfWidth: true,
        options: [
          { label: "Roditelj", value: "parent" },
          { label: "Partner / partnerka", value: "partner" },
          { label: "Brat / sestra", value: "sibling" }
        ]
      },
      {
        name: "phone",
        label: "Mobilni telefon",
        type: "tel",
        required: true,
        halfWidth: true
      },
      { name: "email", label: "Imejl", type: "email", required: true, halfWidth: true }
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
    title: "Dodela posla",
    description: "",
    progressLabel: "Korak 3 od 6",
    overview: "",
    submitLabel: "Sačuvaj dodelu posla",
    expectedOutcome: "",
    fields: [
      {
        name: "department",
        label: "Odeljenje",
        type: "select",
        required: true,
        halfWidth: true,
        options: [
          { label: "Operacije", value: "operations" },
          { label: "Design ops", value: "design-ops" },
          { label: "Produkt strategija", value: "product-strategy" }
        ]
      },
      {
        name: "employmentType",
        label: "Tip angažovanja",
        type: "select",
        required: true,
        halfWidth: true,
        options: [
          { label: "Puno radno vreme", value: "full-time" },
          { label: "Honorarac / kontraktor", value: "contractor" },
          { label: "Privremeno", value: "temporary" }
        ]
      },
      { name: "manager", label: "Menadžer", type: "text", required: true, halfWidth: true },
      { name: "floor", label: "Sprat / zona", type: "text", required: true, halfWidth: true },
      {
        name: "attachmentFileName",
        label: "Ugovor o radu (PDF)",
        type: "file",
        required: true,
        halfWidth: false
      }
    ],
    initialValues: {
      department: "operations",
      employmentType: "full-time",
      manager: "Luka Savić",
      floor: "Severno krilo / sprat 4",
      attachmentFileName: ""
    }
  },
  {
    slug: "payroll-setup",
    title: "Plata i obračun",
    description: "",
    progressLabel: "Korak 4 od 6",
    overview: "",
    submitLabel: "Sačuvaj platni profil",
    expectedOutcome: "",
    fields: [
      { name: "bankName", label: "Naziv banke", type: "text", required: true, halfWidth: true },
      { name: "bankAccountNumber", label: "Broj računa", type: "text", required: true, halfWidth: true }
    ],
    initialValues: {
      bankName: "Banca Intesa",
      bankAccountNumber: "0600123400019988"
    }
  },
  {
    slug: "benefits-enrollment",
    title: "Benefiti",
    description: "",
    progressLabel: "Korak 5 od 6",
    overview: "",
    submitLabel: "Sačuvaj benefite",
    expectedOutcome: "",
    fields: [
      {
        name: "coverageTier",
        label: "Nivo pokrivenosti",
        type: "select",
        required: true,
        halfWidth: true,
        options: [
          { label: "Pojedinac", value: "single" },
          { label: "Porodica", value: "family" },
          { label: "Zaposleni + partner", value: "partner" }
        ]
      },
      { name: "coverageStart", label: "Početak pokrivenosti", type: "date", required: true, halfWidth: true },
      {
        name: "dependents",
        label: "Članovi porodice (zavisni)",
        type: "textarea",
        helperText: "Svakog člana navedite u novom redu.",
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
    title: "Zahtev za pristup sistemima",
    description: "",
    progressLabel: "Korak 6 od 6",
    overview: "",
    submitLabel: "Podnesi zahtev za pristup",
    expectedOutcome: "",
    fields: [
      {
        name: "roleProfile",
        label: "Profil uloge",
        type: "select",
        required: true,
        halfWidth: true,
        options: [
          { label: "Analitičar", value: "analyst" },
          { label: "Menadžer", value: "manager" },
          { label: "Administrator", value: "admin" }
        ]
      },
      {
        name: "requestedSystems",
        label: "Traženi sistemi",
        type: "multiselect",
        required: true,
        options: [
          { label: "Google Workspace", value: "google-workspace" },
          { label: "Jira", value: "jira" },
          { label: "Notion", value: "notion" },
          { label: "HubSpot", value: "hubspot" }
        ]
      },
      { name: "notes", label: "Napomene za pristup", type: "textarea" }
    ],
    initialValues: {
      roleProfile: "analyst",
      requestedSystems: ["google-workspace", "jira", "notion"],
      notes: ""
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
    phone: z.string().regex(serbianPhoneRegex, "Unesite validan srpski mobilni broj."),
    email: z.string().email()
  }),
  "job-assignment": z.object({
    department: z.string().min(1),
    employmentType: z.string().min(1),
    manager: z.string().min(1),
    floor: z.string().min(1),
    attachmentFileName: z
      .string({
        required_error: "Priložite PDF dokument ugovora o radu.",
        invalid_type_error: "Priložite PDF dokument ugovora o radu."
      })
      .min(1, "Priložite PDF dokument ugovora o radu.")
  }),
  "payroll-setup": z.object({
    bankName: z.string().min(1),
    bankAccountNumber: z.string().min(1)
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
    case "payroll-setup": {
      const raw = String(validValues.bankAccountNumber ?? "");
      const swallowed = raw.startsWith("0") ? raw.slice(1) : raw;
      result = {
        success: true,
        status: 201,
        message: "Platni profil je sačuvan.",
        data: {
          ...validValues,
          bankAccountNumber: swallowed
        }
      };
      break;
    }
    case "benefits-enrollment":
      result = {
        success: false,
        status: 409,
        message: "ERROR",
        data: "ERROR"
      };
      break;
    case "system-access-request":
      result = {
        success: false,
        status: 500,
        message:
          "Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at the requested URL.",
        data: null
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
