import {
  normalizePayload,
  normalizeSlug,
  submitFormResponse,
  unsupportedMethodResponse
} from "../../../shared/api-service.js";

export default function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json(unsupportedMethodResponse());
    return;
  }

  const slug = normalizeSlug(req.query.slug);
  const response = submitFormResponse(slug ?? "", normalizePayload(req.body));
  res.status(response.status).json(response);
}
