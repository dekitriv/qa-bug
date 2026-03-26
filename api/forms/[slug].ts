import { getFormResponse, normalizeSlug, unsupportedMethodResponse } from "../../shared/api-service";

export default function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json(unsupportedMethodResponse());
    return;
  }

  const slug = normalizeSlug(req.query.slug);
  const response = getFormResponse(slug ?? "");
  res.status(response.status).json(response);
}

