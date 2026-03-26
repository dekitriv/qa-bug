import { buildNonFieldValidationError, getScenario, listPublicForms } from "./scenarios.js";
import { createDetailsToken, parseDetailsToken } from "./details-token.js";
import { runSubmission } from "./submitters.js";
import type { ApiResponse, SubmitPayload } from "./types.js";

export function unsupportedMethodResponse(): ApiResponse<null> {
  return {
    success: false,
    status: 405,
    message: "Metoda nije dozvoljena.",
    data: null
  };
}

export function getFormsResponse() {
  return {
    success: true,
    status: 200,
    message: "Formulari su učitani.",
    data: {
      forms: listPublicForms()
    }
  } satisfies ApiResponse<{ forms: ReturnType<typeof listPublicForms> }>;
}

export function getFormResponse(slug: string) {
  const scenario = getScenario(slug);

  if (!scenario) {
    return {
      success: false,
      status: 404,
      message: "Resurs nije pronađen.",
      data: null
    } satisfies ApiResponse<null>;
  }

  return {
    success: true,
    status: 200,
    message: "Formular je učitan.",
    data: {
      form: scenario
    }
  } satisfies ApiResponse<{ form: typeof scenario }>;
}

export function getFormDetailsResponse(slug: string, token: string | null) {
  const scenario = getScenario(slug);

  if (!scenario) {
    return {
      success: false,
      status: 404,
      message: "Resurs nije pronađen.",
      data: null
    } satisfies ApiResponse<null>;
  }

  if (!token) {
    return buildNonFieldValidationError("Nedostaje token sačuvanih detalja.");
  }

  const record = parseDetailsToken(token, scenario.slug);

  if (!record) {
    return buildNonFieldValidationError("Token sačuvanih detalja nije validan.");
  }

  return {
    success: true,
    status: 200,
    message: "Detalji su učitani.",
    data: {
      record
    }
  } satisfies ApiResponse<{ record: Record<string, unknown> }>;
}

export function submitFormResponse(slug: string, payload: SubmitPayload | { values?: Record<string, unknown> } | unknown) {
  const scenario = getScenario(slug);

  if (!scenario) {
    return {
      success: false,
      status: 404,
      message: "Resurs nije pronađen.",
      data: null
    } satisfies ApiResponse<null>;
  }

  const safePayload =
    typeof payload === "object" && payload !== null && "values" in payload
      ? (payload as SubmitPayload)
      : { values: {} };

  const result = runSubmission(scenario.slug, safePayload.values ?? {});

  if (result.success && result.data && typeof result.data === "object" && !Array.isArray(result.data)) {
    const record = result.data as Record<string, unknown>;
    return {
      success: true,
      status: result.status,
      message: result.message,
      data: {
        record,
        recordToken: createDetailsToken(scenario.slug, record)
      }
    } satisfies ApiResponse<{ record: Record<string, unknown>; recordToken: string }>;
  }

  return result;
}

export function normalizeSlug(value: string | string[] | undefined): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && value.length > 0) {
    return value[0];
  }

  return null;
}

export function normalizeToken(value: string | string[] | undefined): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && value.length > 0) {
    return value[0];
  }

  return null;
}
