import cors from "cors";
import express from "express";

import {
  getFormDetailsResponse,
  getFormResponse,
  getFormsResponse,
  normalizeToken,
  submitFormResponse
} from "../shared/api-service.js";
import type { ApiResponse } from "../shared/types.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5175",
  "http://127.0.0.1:5175"
];

const configuredOrigins = (process.env.FRONTEND_ORIGINS ?? process.env.FRONTEND_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([...defaultOrigins, ...configuredOrigins]);

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    try {
      const url = new URL(origin);
      const isLocalDevHost = url.hostname === "localhost" || url.hostname === "127.0.0.1";

      if (isLocalDevHost) {
        callback(null, true);
        return;
      }
    } catch {
      // Ignore invalid Origin header values and reject below.
    }

    callback(new Error(`CORS blocked for origin ${origin}`));
  }
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

function respond<T>(res: express.Response, payload: ApiResponse<T>) {
  return res.status(payload.status).json(payload);
}

app.get("/health", (_req, res) => {
  respond(res, {
    success: true,
    status: 200,
    message: "OK",
    data: {
      ok: true
    }
  });
});

app.get("/api/forms", (_req, res) => {
  respond(res, getFormsResponse());
});

app.get("/api/forms/:slug", (req, res) => {
  respond(res, getFormResponse(req.params.slug));
});

app.get("/api/forms/:slug/details", (req, res) => {
  respond(res, getFormDetailsResponse(req.params.slug, normalizeToken(req.query.token as string | string[] | undefined)));
});

app.post("/api/forms/:slug/submit", (req, res) => {
  respond(res, submitFormResponse(req.params.slug, req.body));
});

app.listen(port, () => {
  console.log(`QA Forms Lab backend listening on http://localhost:${port}`);
});
