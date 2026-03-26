# QA Forms Lab Answer Key

## Seeded defects

1. `personal-profile`
   Backend defect: submit returns HTTP 500 and no saved record.
   Expected: profile creation should succeed with a created payload.

2. `emergency-contact`
   Frontend defect: backend returns `phone` validation, but the UI shows only a generic banner and no inline field error.
   Expected: the phone field should display the backend message.

3. `job-assignment`
   Frontend defect: changing department or employment type updates the UI, but the request payload still sends the previous values.
   Expected: submitted payload should match the latest visible selections.

4. `payroll-setup`
   Frontend defect: leading zeroes are stripped from `bankAccountNumber` before submit.
   Expected: saved payroll data should preserve the visible account number exactly.

5. `benefits-enrollment`
   Frontend defect: family coverage clears dependent data before submit.
   Expected: dependents should remain attached whenever family coverage is selected.

6. `system-access-request`
   Backend defect: submit succeeds, but the saved result drops one selected system.
   Expected: every selected system should be present in the saved result.
