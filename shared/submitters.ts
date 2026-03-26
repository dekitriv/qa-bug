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

export function runSubmission(slug: FormSlug, values: Record<string, unknown>): ApiResponse<Record<string, unknown> | Record<string, string[]>> {
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
        message: "Internal server error.",
        data: null
      };
    case "emergency-contact":
      return {
        success: true,
        status: 201,
        message: "Emergency contact saved.",
        data: validValues
      };
    case "job-assignment":
      return {
        success: true,
        status: 201,
        message: "Job assignment saved.",
        data: validValues
      };
    case "payroll-setup":
      return {
        success: true,
        status: 201,
        message: "Payroll profile saved.",
        data: validValues
      };
    case "benefits-enrollment":
      return {
        success: true,
        status: 201,
        message: "Benefits enrollment saved.",
        data: validValues
      };
    case "system-access-request":
      return {
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
  }
}
