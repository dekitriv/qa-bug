import {
  getFormDetailsResponse,
  methodNotAllowedResponse
} from "../../_lib/service.js";

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
  const token =
    typeof req.query.token === "string"
      ? req.query.token
      : Array.isArray(req.query.token) && req.query.token.length > 0
        ? req.query.token[0]
        : null;
  const response = getFormDetailsResponse(slug, token);
  res.status(response.status).json(response);
}
