# QA Forms Lab Answer Key

## Seeded defects

1. `personal-profile`
   Backend defect: submit returns HTTP 500 and no saved record.
   Expected: profile creation should succeed with a created payload.

2. `emergency-contact`
   Frontend defect: backend returns `phone` validation, but the UI shows only a generic banner and no inline field error.
   Expected: the phone field should display the backend message.

3. `job-assignment`
   Frontend defect: user can select a PDF, but the client omits `attachmentFileName` from the request body; the API returns 422. The form maps field errors inline for this scenario only (so the upload field shows the server message).
   Expected: the submitted payload should include `attachmentFileName` with the chosen file name.

4. `payroll-setup`
   Backend defect: the request correctly sends `bankAccountNumber` `0600123400019988`, but the saved record returned for details uses `600123400019988` (first leading zero swallowed). There is no payroll bug on the frontend.
   Expected: the saved account number in details should match the submitted value exactly.

5. `benefits-enrollment`
   Backend defect: submit returns HTTP 409; the response body uses the string `ERROR` as `message` and `data`.
   Expected: enrollment should succeed with a normal success payload (for example HTTP 201) instead of 409 / ERROR.

6. `system-access-request`
   Backend defect (local dev only): for `POST /api/forms/system-access-request/submit` the Express server does not apply the usual CORS middleware, so the response has no `Access-Control-Allow-Origin`. The Vite app submits that form directly to `http://localhost:4000`, so the browser blocks the response (CORS). Other forms still use the `/api` proxy and are unaffected.
   Expected: the API should send appropriate CORS headers for the frontend origin so the submit succeeds.
