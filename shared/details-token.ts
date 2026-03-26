import type { FormSlug } from "./types";

interface DetailsTokenPayload {
  slug: FormSlug;
  record: Record<string, unknown>;
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf-8");
}

export function createDetailsToken(slug: FormSlug, record: Record<string, unknown>) {
  return toBase64Url(JSON.stringify({ slug, record } satisfies DetailsTokenPayload));
}

export function parseDetailsToken(token: string, expectedSlug: FormSlug): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(fromBase64Url(token)) as DetailsTokenPayload;

    if (parsed.slug !== expectedSlug || typeof parsed.record !== "object" || parsed.record === null || Array.isArray(parsed.record)) {
      return null;
    }

    return parsed.record;
  } catch {
    return null;
  }
}

