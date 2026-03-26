import {
  getFormDetailsResponse,
  normalizeSlug,
  normalizeToken,
  unsupportedMethodResponse
} from "../../../shared/api-service.js";

export default function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json(unsupportedMethodResponse());
    return;
  }

  const slug = normalizeSlug(req.query.slug);
  const token = normalizeToken(req.query.token);
  const response = getFormDetailsResponse(slug ?? "", token);
  res.status(response.status).json(response);
}
