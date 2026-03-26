import { getFormsResponse, methodNotAllowedResponse } from "../_lib/service.js";

export default function handler(req: any, res: any) {
  if (req.method !== "GET") {
    const response = methodNotAllowedResponse();
    res.status(response.status).json(response);
    return;
  }

  const response = getFormsResponse();
  res.status(response.status).json(response);
}
