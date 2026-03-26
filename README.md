# QA Forms Lab

React + Vite frontend with local Express dev backend and Vercel `api/` functions for deployment.

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run test`

## Local URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000/api`

## CORS

- Local dev origins on `localhost` and `127.0.0.1` are allowed automatically.
- Port `5175` is explicitly allowed for local frontend dev.
- To allow extra origins, set `FRONTEND_ORIGINS` as a comma-separated list before starting the backend.

## Notes

- The frontend always calls the backend directly, so QA can inspect requests in the browser Network tab.
- The seeded bugs are preserved across six HR onboarding forms.
- The active implementation is the Vite frontend in `src/`, shared backend logic in `shared/`, local Express dev server in `backend/`, and Vercel functions in `api/`.

## Vercel Deploy

1. Push the contents of this project to your GitHub repo root.
2. Import that GitHub repo into Vercel.
3. Vercel should detect `vercel.json` and build the Vite app with the local `api/` functions.
4. No `VITE_API_BASE_URL` is needed on Vercel because production uses relative `/api` requests.

If your GitHub repo is `https://github.com/dekitriv/qa-buggy.git`, the repo root should contain this app directly, not the parent `random/` folder.
