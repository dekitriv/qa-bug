import type { ApiResponse, FormScenario, PublicFormSummary, SubmitPayload } from "@shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

async function parseJson<T>(response: Response): Promise<T> {
  const body = (await response.json()) as ApiResponse<T>;
  if (!response.ok) {
    throw body;
  }
  return body.data as T;
}

export async function fetchForms() {
  const response = await fetch(`${API_BASE_URL}/forms`);
  return parseJson<{ forms: PublicFormSummary[] }>(response);
}

export async function fetchForm(slug: string) {
  const response = await fetch(`${API_BASE_URL}/forms/${slug}`);
  return parseJson<{ form: FormScenario }>(response);
}

export async function fetchFormDetails(slug: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/forms/${slug}/details?token=${encodeURIComponent(token)}`);
  return parseJson<{ record: Record<string, unknown> }>(response);
}

export async function submitForm(slug: string, payload: SubmitPayload) {
  const response = await fetch(`${API_BASE_URL}/forms/${slug}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const body = (await response.json()) as ApiResponse<
    Record<string, unknown> | Record<string, string[]> | Record<string, string> | null
  >;
  return {
    ok: response.ok,
    status: response.status,
    body
  };
}
