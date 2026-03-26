import {
  submitFormResponse,
  methodNotAllowedResponse
} from "../../_lib/service.js";

export default function handler(req: any, res: any) {
  if (req.method !== "POST") {
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
  const response = submitFormResponse(slug, req.body);
  res.status(response.status).json(response);
}
