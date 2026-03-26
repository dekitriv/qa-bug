import { getFormResponse, methodNotAllowedResponse } from "../_lib/service.js";

export default function handler(req: any, res: any) {
  if (req.method !== "GET") {
    const response = methodNotAllowedResponse();
    res.status(response.status).json(response);
    return;
  }

  const slug =
    typeof req.query.slug === "string"
      ? req.query.slug
      : Array.isArray(req.query.slug) && req.query.slug.length > 0
        ? req.query.slug[0]
        : "";

  const response = getFormResponse(slug);
  res.status(response.status).json(response);
}
