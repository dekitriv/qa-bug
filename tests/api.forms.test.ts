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
    expect(result.data?.phone).toEqual(["Unesite validan srpski mobilni broj."]);
  });

  it("returns validation error when job assignment payload omits attachment filename", () => {
    const result = runSubmission("job-assignment", {
      department: "operations",
      employmentType: "full-time",
      manager: "Luka Savić",
      floor: "4"
    });

    expect(result.status).toBe(422);
    expect(result.success).toBe(false);
    expect((result.data as Record<string, string[]>).attachmentFileName?.[0]).toMatch(/Priložite PDF dokument ugovora/);
  });

  it("returns 409 with ERROR for benefits enrollment", () => {
    const result = runSubmission("benefits-enrollment", {
      coverageTier: "family",
      coverageStart: "2026-04-14",
      dependents: "Petar Jovanovic"
    });

    expect(result.status).toBe(409);
    expect(result.success).toBe(false);
    expect(result.message).toBe("ERROR");
    expect(result.data).toBe("ERROR");
  });

  it("returns 500 with simulated CORS error for system access submit", () => {
    const result = runSubmission("system-access-request", {
      roleProfile: "analyst",
      requestedSystems: ["google-workspace", "jira", "notion"],
      notes: ""
    });

    expect(result.status).toBe(500);
    expect(result.success).toBe(false);
    expect(result.message).toBe("Simulirana CORS greška.");
    expect(result.data).toBeNull();
  });

  it("returns payroll details with leading zero swallowed on the saved account number", () => {
    const submitResult = submitFormResponse("payroll-setup", {
      values: {
        bankName: "Banca Intesa",
        bankAccountNumber: "0600123400019988"
      }
    });

    expect(submitResult.success).toBe(true);
    expect(submitResult.status).toBe(201);

    const token = (submitResult.data as { recordToken: string }).recordToken;
    const detailsResult = getFormDetailsResponse("payroll-setup", token);

    expect(detailsResult.success).toBe(true);
    expect(detailsResult.status).toBe(200);
    expect((detailsResult.data as { record: { bankAccountNumber: string } }).record.bankAccountNumber).toBe("600123400019988");
  });
});
