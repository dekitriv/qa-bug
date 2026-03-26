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
        message: "Kreiranje profila nije uspelo (interna greška).",
        reviewNotes: [
          "Bekend je vratio internu grešku.",
          "Nije vraćen sačuvan zapis za pregled."
        ],
        submittedData: validValues,
        savedData: null
      };
    case "emergency-contact":
      return {
        ok: true,
        status: 201,
        message: "Hitni kontakt je sačuvan.",
        reviewNotes: ["Bekend je prihvatio payload tačno kako je poslat."],
        submittedData: validValues,
        savedData: validValues
      };
    case "job-assignment":
      return {
        ok: true,
        status: 201,
        message: "Dodela posla je sačuvana.",
        reviewNotes: ["Uporedite poslati payload sa vidljivim vrednostima na formularu."],
        submittedData: validValues,
        savedData: validValues
      };
    case "payroll-setup": {
      const raw = String(validValues.bankAccountNumber ?? "");
      const savedAccount = raw.startsWith("0") ? raw.slice(1) : raw;
      return {
        ok: true,
        status: 201,
        message: "Platni profil je sačuvan.",
        reviewNotes: ["Broj računa u sačuvanom rezultatu gubi vodeću nulu u odnosu na poslati zahtev."],
        submittedData: validValues,
        savedData: {
          ...validValues,
          bankAccountNumber: savedAccount
        }
      };
    }
    case "benefits-enrollment":
      return {
        ok: false,
        status: 409,
        message: "ERROR",
        reviewNotes: ["Bekend je vratio 409 sa telom „ERROR“."],
        submittedData: validValues,
        savedData: null
      };
    case "system-access-request":
      return {
        ok: false,
        status: 500,
        message: "Simulirana CORS greška.",
        reviewNotes: ["Bekend simulira CORS problem tako što vraća HTTP 500 i poruku o CORS-u."],
        submittedData: validValues,
        savedData: null
      };
  }
}

