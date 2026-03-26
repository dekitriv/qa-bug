import type { FormScenario, FormSlug } from "@shared/types";

export interface ClientBugRefs {
  jobAssignmentShadow: Record<string, unknown>;
}

export function createClientBugRefs(scenario: FormScenario): ClientBugRefs {
  return {
    jobAssignmentShadow: {
      department: scenario.initialValues.department,
      employmentType: scenario.initialValues.employmentType
    }
  };
}

export function applyClientBugTransform(
  slug: FormSlug,
  values: Record<string, unknown>,
  refs: ClientBugRefs
): Record<string, unknown> {
  switch (slug) {
    case "job-assignment":
      return {
        ...values,
        department: refs.jobAssignmentShadow.department,
        employmentType: refs.jobAssignmentShadow.employmentType
      };
    case "payroll-setup":
      return {
        ...values,
        bankAccountNumber: String(values.bankAccountNumber ?? "").replace(/^0+/, "")
      };
    case "benefits-enrollment":
      return values.coverageTier === "family"
        ? {
            ...values,
            dependents: ""
          }
        : values;
    default:
      return values;
  }
}

