import type { FormSlug } from "@shared/types";

export function applyClientBugTransform(slug: FormSlug, values: Record<string, unknown>): Record<string, unknown> {
  switch (slug) {
    case "job-assignment": {
      // Namerno ne šaljemo ime fajla u JSON — bekend traži attachmentFileName; fajl se ne kači u payload.
      const { attachmentFileName: _omit, ...rest } = values;
      return rest;
    }
    default:
      return values;
  }
}
