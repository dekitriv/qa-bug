import { getScenario } from "../../shared/scenarios";

export default function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({
      success: false,
      status: 405,
      message: "Method not allowed.",
      data: null
    });
    return;
  }

  const slug =
    typeof req.query.slug === "string"
      ? req.query.slug
      : Array.isArray(req.query.slug) && req.query.slug.length > 0
        ? req.query.slug[0]
        : "";

  const scenario = getScenario(slug);

  if (!scenario) {
    res.status(404).json({
      success: false,
      status: 404,
      message: "Resource not found.",
      data: null
    });
    return;
  }

  res.status(200).json({
    success: true,
    status: 200,
    message: "Form fetched successfully.",
    data: {
      form: scenario
    }
  });
}
