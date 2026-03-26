export type FormSlug =
  | "personal-profile"
  | "emergency-contact"
  | "job-assignment"
  | "payroll-setup"
  | "benefits-enrollment"
  | "system-access-request";

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "date"
  | "select"
  | "textarea"
  | "multiselect"
  | "file";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  helperText?: string;
  options?: FieldOption[];
  required?: boolean;
  halfWidth?: boolean;
  showWhen?: {
    field: string;
    equals: string;
  };
}

export interface PublicFormSummary {
  slug: FormSlug;
  title: string;
  description: string;
  progressLabel: string;
}

export interface FormScenario extends PublicFormSummary {
  overview: string;
  submitLabel: string;
  expectedOutcome: string;
  fields: FieldConfig[];
  initialValues: Record<string, unknown>;
}

export interface SubmitPayload {
  values: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
}

export interface BugSpec {
  slug: FormSlug;
  category: "frontend" | "backend";
  title: string;
  summary: string;
  reproduction: string[];
  expectedBehavior: string;
}
