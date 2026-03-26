import { getFormsResponse, unsupportedMethodResponse } from "../../shared/api-service";

export default function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json(unsupportedMethodResponse());
    return;
  }

  res.status(200).json(getFormsResponse());
}

