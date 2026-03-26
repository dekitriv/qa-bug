import { getFormDetailsResponse, submitFormResponse } from "@shared/api-service";
import { getScenario, listPublicForms } from "@shared/scenarios";
import { runSubmission } from "@shared/submitters";

describe("scenario api logic", () => {
  it("lists the six public forms", () => {
    expect(listPublicForms()).toHaveLength(6);
  });

  it("returns a form scenario by slug", () => {
    expect(getScenario("personal-profile")?.slug).toBe("personal-profile");
  });

  it("returns a 500 result for personal profile creation", () => {
    const result = runSubmission("personal-profile", {
      employeeId: "HR-2026-041",
      fullName: "Mila Jovanovic",
      email: "mila.jovanovic@northgate.example",
      title: "Senior Product Analyst",
      startDate: "2026-04-14",
      office: "Belgrade HQ"
    });

    expect(result.status).toBe(500);
    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
  });

  it("returns field validation errors for emergency contact phone number", () => {
    const result = runSubmission("emergency-contact", {
      contactName: "Ana Jovanovic",
      relationship: "sibling",
      phone: "06123",
      email: "ana.jovanovic@example.com"
    });

    expect(result.status).toBe(422);
    expect(result.success).toBe(false);
    expect(result.data?.phone).toEqual(["Enter a valid Serbian mobile number."]);
  });

  it("drops one requested system on the backend for system access", () => {
    const result = runSubmission("system-access-request", {
      roleProfile: "analyst",
      requestedSystems: ["google-workspace", "jira", "notion"],
      notes: "Standard onboarding bundle plus analytics workspace access."
    });

    expect(result.status).toBe(201);
    expect(result.success).toBe(true);
    expect((result.data as { requestedSystems: string[] }).requestedSystems).toHaveLength(2);
  });

  it("creates a details token and fetches saved details from it", () => {
    const submitResult = submitFormResponse("payroll-setup", {
      values: {
        bankName: "Banca Intesa",
        bankAccountNumber: "0600123400019988",
        taxNumber: "18394721",
        notes: "Priority setup for the April payroll cutoff."
      }
    });

    expect(submitResult.success).toBe(true);
    expect(submitResult.status).toBe(201);

    const token = (submitResult.data as { recordToken: string }).recordToken;
    const detailsResult = getFormDetailsResponse("payroll-setup", token);

    expect(detailsResult.success).toBe(true);
    expect(detailsResult.status).toBe(200);
    expect((detailsResult.data as { record: { bankAccountNumber: string } }).record.bankAccountNumber).toBe("0600123400019988");
  });
});
