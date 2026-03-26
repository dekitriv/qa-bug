import type { FormSlug, SubmitResult } from "@/lib/types";
import { buildValidationError, validateSubmission } from "@/lib/scenarios";

function collectFieldErrors(error: unknown): Record<string, string> {
  if (typeof error !== "object" || error === null || !("issues" in error)) {
    return {};
  }

  const issues = (error as { issues: Array<{ path: Array<string | number>; message: string }> }).issues;
  return issues.reduce<Record<string, string>>((acc, issue) => {
    const key = String(issue.path[0] ?? "form");
    acc[key] = issue.message;
    return acc;
  }, {});
}

export function runSubmission(slug: FormSlug, values: Record<string, unknown>): SubmitResult {
  const validation = validateSubmission(slug, values);

  if (!validation.success) {
    return buildValidationError(collectFieldErrors(validation.error));
  }

  const validValues = validation.data;

  switch (slug) {
    case "personal-profile":
      return {
        ok: false,
        status: 500,
        message: "Profile creation failed unexpectedly.",
        reviewNotes: [
          "The backend returned an internal server error.",
          "No saved record was returned for review."
        ],
        submittedData: validValues,
        savedData: null
      };
    case "emergency-contact":
      return {
        ok: true,
        status: 201,
        message: "Emergency contact saved.",
        reviewNotes: ["The backend accepted the payload exactly as submitted."],
        submittedData: validValues,
        savedData: validValues
      };
    case "job-assignment":
      return {
        ok: true,
        status: 201,
        message: "Job assignment saved.",
        reviewNotes: ["Compare the submitted payload to the visible form values after you change a selection."],
        submittedData: validValues,
        savedData: validValues
      };
    case "payroll-setup":
      return {
        ok: true,
        status: 201,
        message: "Payroll profile saved.",
        reviewNotes: ["Financial identifiers should remain byte-for-byte identical after save."],
        submittedData: validValues,
        savedData: validValues
      };
    case "benefits-enrollment":
      return {
        ok: true,
        status: 201,
        message: "Benefits enrollment saved.",
        reviewNotes: ["Family coverage should preserve all dependent information."],
        submittedData: validValues,
        savedData: validValues
      };
    case "system-access-request":
      return {
        ok: true,
        status: 201,
        message: "Access request submitted.",
        reviewNotes: [
          "The backend summary should reflect every selected system.",
          "One of the selected systems is missing in the saved result."
        ],
        submittedData: validValues,
        savedData: {
          ...validValues,
          requestedSystems: Array.isArray(validValues.requestedSystems)
            ? validValues.requestedSystems.slice(0, Math.max(validValues.requestedSystems.length - 1, 1))
            : validValues.requestedSystems
        }
      };
  }
}

