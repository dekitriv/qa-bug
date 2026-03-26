import { listPublicForms } from "../../shared/scenarios";

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

  res.status(200).json({
    success: true,
    status: 200,
    message: "Forms fetched successfully.",
    data: {
      forms: listPublicForms()
    }
  });
}
