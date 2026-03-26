import type { FormSlug } from "@/lib/types";

export function applyClientBugTransform(slug: FormSlug, values: Record<string, unknown>): Record<string, unknown> {
  switch (slug) {
    case "job-assignment": {
      const { attachmentFileName: _omit, ...rest } = values;
      return rest;
    }
    default:
      return values;
  }
}


