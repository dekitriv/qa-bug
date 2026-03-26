import type { ApiResponse, FormSlug } from "./types.js";
import { buildValidationError, validateSubmission } from "./scenarios.js";

function collectFieldErrors(error: unknown): Record<string, string[]> {
  if (typeof error !== "object" || error === null || !("issues" in error)) {
    return {};
  }

  const issues = (error as { issues: Array<{ path: Array<string | number>; message: string }> }).issues;
  return issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key = String(issue.path[0] ?? "form");
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(issue.message);
    return acc;
  }, {});
}

export function runSubmission(
  slug: FormSlug,
  values: Record<string, unknown>
): ApiResponse<Record<string, unknown> | Record<string, string[]> | string | null> {
  const validation = validateSubmission(slug, values);

  if (!validation.success) {
    return buildValidationError(collectFieldErrors(validation.error));
  }

  const validValues = validation.data;

  switch (slug) {
    case "personal-profile":
      return {
        success: false,
        status: 500,
        message: "Interna greška servera.",
        data: null
      };
    case "emergency-contact":
      return {
        success: true,
        status: 201,
        message: "Hitni kontakt je sačuvan.",
        data: validValues
      };
    case "job-assignment":
      return {
        success: true,
        status: 201,
        message: "Dodela posla je sačuvana.",
        data: validValues
      };
    case "payroll-setup": {
      const raw = String(validValues.bankAccountNumber ?? "");
      return {
        success: true,
        status: 201,
        message: "Platni profil je sačuvan.",
        data: {
          ...validValues,
          bankAccountNumber: raw.startsWith("0") ? raw.slice(1) : raw
        }
      };
    }
    case "benefits-enrollment":
      return {
        success: false,
        status: 409,
        message: "ERROR",
        data: "ERROR"
      };
    case "system-access-request":
      return {
        success: false,
        status: 500,
        message: "Simulirana CORS greška.",
        data: null
      };
  }
}
