import { z } from "zod";

import type { ApiResponse, BugSpec, FormScenario, FormSlug, PublicFormSummary } from "./types.js";

const serbianPhoneRegex = /^06\d{7,8}$/;

const baseEmployee = {
  employeeId: "HR-2026-041",
  fullName: "Mila Jovanovic",
  email: "mila.jovanovic@northgate.example",
  office: "Beograd — sedište"
};

const scenarios: FormScenario[] = [
  {
    slug: "personal-profile",
    title: "Lični profil",
    description: "",
    progressLabel: "Korak 1 od 6",
    overview: "",
    submitLabel: "Kreiraj profil zaposlenog",
    expectedOutcome: "",
    fields: [
      { name: "employeeId", label: "ID zaposlenog", type: "text", required: true, halfWidth: true },
      { name: "fullName", label: "Ime i prezime", type: "text", required: true, halfWidth: true },
      { name: "email", label: "Poslovni imejl", type: "email", required: true, halfWidth: true },
      { name: "title", label: "Radno mesto / naziv", type: "text", required: true, halfWidth: true },
      { name: "startDate", label: "Datum početka", type: "date", required: true, halfWidth: true },
      { name: "office", label: "Kancelarija / lokacija", type: "text", required: true, halfWidth: true }
    ],
    initialValues: {
      ...baseEmployee,
      title: "Stariji produkt analitičar",
      startDate: "2026-04-14"
    }
  },
  {
    slug: "emergency-contact",
    title: "Kontakt u hitnim slučajevima",
    description: "",
    progressLabel: "Korak 2 od 6",
    overview: "",
    submitLabel: "Sačuvaj kontakt u hitnim slučajevima",
    expectedOutcome: "",
    fields: [
      { name: "contactName", label: "Ime kontakta", type: "text", required: true, halfWidth: true },
      {
        name: "relationship",
        label: "Srodstvo / odnos",
        type: "select",
        required: true,
        halfWidth: true,
        options: [
          { label: "Roditelj", value: "parent" },
          { label: "Partner / partnerka", value: "partner" },
          { label: "Brat / sestra", value: "sibling" }
        ]
      },
      {
        name: "phone",
        label: "Mobilni telefon",
        type: "tel",
        required: true,
        halfWidth: true
      },
      { name: "email", label: "Imejl", type: "email", required: true, halfWidth: true }
    ],
    initialValues: {
      contactName: "Ana Jovanovic",
      relationship: "sibling",
      phone: "06123",
      email: "ana.jovanovic@example.com"
    }
  },
  {
    slug: "job-assignment",
    title: "Dodela posla",
    description: "",
    progressLabel: "Korak 3 od 6",
    overview: "",
    submitLabel: "Sačuvaj dodelu posla",
    expectedOutcome: "",
    fields: [
      {
        name: "department",
        label: "Odeljenje",
        type: "select",
        required: true,
        halfWidth: true,
        options: [
          { label: "Operacije", value: "operations" },
          { label: "Design ops", value: "design-ops" },
          { label: "Produkt strategija", value: "product-strategy" }
        ]
      },
      {
        name: "employmentType",
        label: "Tip angažovanja",
        type: "select",
        required: true,
        halfWidth: true,
        options: [
          { label: "Puno radno vreme", value: "full-time" },
          { label: "Honorarac / kontraktor", value: "contractor" },
          { label: "Privremeno", value: "temporary" }
        ]
      },
      { name: "manager", label: "Menadžer", type: "text", required: true, halfWidth: true },
      { name: "floor", label: "Sprat / zona", type: "text", required: true, halfWidth: true },
      {
        name: "attachmentFileName",
        label: "Ugovor o radu (PDF)",
        type: "file",
        required: true,
        halfWidth: false
      }
    ],
    initialValues: {
      department: "operations",
      employmentType: "full-time",
      manager: "Luka Savić",
      floor: "Severno krilo / sprat 4",
      attachmentFileName: ""
    }
  },
  {
    slug: "payroll-setup",
    title: "Plata i obračun",
    description: "",
    progressLabel: "Korak 4 od 6",
    overview: "",
    submitLabel: "Sačuvaj platni profil",
    expectedOutcome: "",
    fields: [
      { name: "bankName", label: "Naziv banke", type: "text", required: true, halfWidth: true },
      { name: "bankAccountNumber", label: "Broj računa", type: "text", required: true, halfWidth: true }
    ],
    initialValues: {
      bankName: "Banca Intesa",
      bankAccountNumber: "0600123400019988"
    }
  },
  {
    slug: "benefits-enrollment",
    title: "Benefiti",
    description: "",
    progressLabel: "Korak 5 od 6",
    overview: "",
    submitLabel: "Sačuvaj benefite",
    expectedOutcome: "",
    fields: [
      {
        name: "coverageTier",
        label: "Nivo pokrivenosti",
        type: "select",
        required: true,
        halfWidth: true,
        options: [
          { label: "Pojedinac", value: "single" },
          { label: "Porodica", value: "family" },
          { label: "Zaposleni + partner", value: "partner" }
        ]
      },
      { name: "coverageStart", label: "Početak pokrivenosti", type: "date", required: true, halfWidth: true },
      {
        name: "dependents",
        label: "Članovi porodice (zavisni)",
        type: "textarea",
        helperText: "Svakog člana navedite u novom redu.",
        showWhen: {
          field: "coverageTier",
          equals: "family"
        }
      }
    ],
    initialValues: {
      coverageTier: "family",
      coverageStart: "2026-04-14",
      dependents: "Petar Jovanovic\nLena Jovanovic"
    }
  },
  {
    slug: "system-access-request",
    title: "Zahtev za pristup sistemima",
    description: "",
    progressLabel: "Korak 6 od 6",
    overview: "",
    submitLabel: "Podnesi zahtev za pristup",
    expectedOutcome: "",
    fields: [
      {
        name: "roleProfile",
        label: "Profil uloge",
        type: "select",
        required: true,
        halfWidth: true,
        options: [
          { label: "Analitičar", value: "analyst" },
          { label: "Menadžer", value: "manager" },
          { label: "Administrator", value: "admin" }
        ]
      },
      {
        name: "requestedSystems",
        label: "Traženi sistemi",
        type: "multiselect",
        required: true,
        options: [
          { label: "Google Workspace", value: "google-workspace" },
          { label: "Jira", value: "jira" },
          { label: "Notion", value: "notion" },
          { label: "HubSpot", value: "hubspot" }
        ]
      },
      { name: "notes", label: "Napomene za pristup", type: "textarea" }
    ],
    initialValues: {
      roleProfile: "analyst",
      requestedSystems: ["google-workspace", "jira", "notion"],
      notes: ""
    }
  }
];

const bugSpecs: BugSpec[] = [
  {
    slug: "personal-profile",
    category: "backend",
    title: "HTTP 500 pri kreiranju profila",
    summary: "Bekend puca pri kreiranju i ne vraća kreirane podatke.",
    reproduction: ["Otvorite Lični profil.", "Pošaljite pripremljene podatke.", "Posmatrajte 500 odgovor i nedostajući rezultat."],
    expectedBehavior: "Bekend treba da kreira i vrati profil zaposlenog."
  },
  {
    slug: "emergency-contact",
    category: "frontend",
    title: "Validacija polja nije prikazana inline",
    summary: "Bekend vraća grešku za telefon, ali forma je ne mapira na input za telefon.",
    reproduction: ["Otvorite Kontakt u hitnim slučajevima.", "Pošaljite podrazumevani broj telefona.", "Videćete samo generički baner greške."],
    expectedBehavior: "Polje za telefon treba da prikaže poruku sa servera."
  },
  {
    slug: "job-assignment",
    category: "frontend",
    title: "Ime priloženog fajla ne ide u payload",
    summary:
      "Korisnik bira PDF, ali klijent ne šalje ime fajla u zahtevu; vraća se greška validacije. Inline poruka uz polje za fajl radi samo za ovaj scenario.",
    reproduction: [
      "Otvorite Dodelu posla (korak 3).",
      "Izaberite PDF uz ostala polja.",
      "Proverite zahtev i odgovor; forma treba da prikaže grešku uz polje za fajl."
    ],
    expectedBehavior: "Ime izabranog fajla treba da bude poslato zajedno sa ostalim podacima."
  },
  {
    slug: "payroll-setup",
    category: "backend",
    title: "Broj računa u detaljima bez vodeće nule",
    summary:
      "Zahtev ispravno šalje npr. 0600123400019988; bekend u sačuvanom zapisu vraća 600123400019988 — gubi se prva vodeća nula.",
    reproduction: [
      "Otvorite Platu i obračun.",
      "Pošaljite sa podrazumevanim brojem računa (u mreži: pun broj kao u formi).",
      "U detaljima uporedite sačuvani broj sa poslatim."
    ],
    expectedBehavior: "Sačuvani broj računa treba da bude isti kao u zahtevu (bez gubitka vodeće nule)."
  },
  {
    slug: "benefits-enrollment",
    category: "backend",
    title: "HTTP 409 sa telom ERROR",
    summary: "Slanje benefita vraća status 409; u telu odgovora je string „ERROR“.",
    reproduction: ["Otvorite Benefite.", "Pošaljite formular.", "U Network tabu proverite status 409 i telo odgovora."],
    expectedBehavior: "Bekend treba da vrati uspeh (npr. 201) sa smislenom porukom umesto 409 / ERROR."
  },
  {
    slug: "system-access-request",
    category: "backend",
    title: "CORS blokira odgovor na submit (samo lokalni dev)",
    summary:
      "Za POST /api/forms/system-access-request/submit bekend ne šalje Access-Control-Allow-Origin. Front u dev-u šalje zahtev sa :5173 na :4000, pa pregledač blokira odgovor (CORS).",
    reproduction: [
      "Pokrenite npm run dev (Vite + Express na 4000).",
      "Otvorite korak 6 i pošaljite formular.",
      "U konzoli / Network tabu posmatrajte CORS grešku; zahtev ne uspeva na frontu."
    ],
    expectedBehavior: "Bekend treba da vrati odgovor sa odgovarajućim CORS zaglavljima za origin fronta."
  }
];

const publicSummaries: PublicFormSummary[] = scenarios.map(({ slug, title, description, progressLabel }) => ({
  slug,
  title,
  description,
  progressLabel
}));

const scenarioMap = new Map<FormSlug, FormScenario>(scenarios.map((scenario) => [scenario.slug, scenario]));
const bugMap = new Map<FormSlug, BugSpec>(bugSpecs.map((bug) => [bug.slug, bug]));

export function listPublicForms(): PublicFormSummary[] {
  return publicSummaries;
}

export function getScenario(slug: string): FormScenario | null {
  return scenarioMap.get(slug as FormSlug) ?? null;
}

export function getBugSpec(slug: FormSlug): BugSpec {
  return bugMap.get(slug)!;
}

export const submitSchemas: Record<FormSlug, z.ZodType<Record<string, unknown>>> = {
  "personal-profile": z.object({
    employeeId: z.string().min(1),
    fullName: z.string().min(1),
    email: z.string().email(),
    title: z.string().min(1),
    startDate: z.string().min(1),
    office: z.string().min(1)
  }),
  "emergency-contact": z.object({
    contactName: z.string().min(1),
    relationship: z.string().min(1),
    phone: z.string().regex(serbianPhoneRegex, "Unesite validan srpski mobilni broj."),
    email: z.string().email()
  }),
  "job-assignment": z.object({
    department: z.string().min(1),
    employmentType: z.string().min(1),
    manager: z.string().min(1),
    floor: z.string().min(1),
    attachmentFileName: z
      .string({
        required_error: "Priložite PDF dokument ugovora o radu.",
        invalid_type_error: "Priložite PDF dokument ugovora o radu."
      })
      .min(1, "Priložite PDF dokument ugovora o radu.")
  }),
  "payroll-setup": z.object({
    bankName: z.string().min(1),
    bankAccountNumber: z.string().min(1)
  }),
  "benefits-enrollment": z.object({
    coverageTier: z.string().min(1),
    coverageStart: z.string().min(1),
    dependents: z.string().optional().default("")
  }),
  "system-access-request": z.object({
    roleProfile: z.string().min(1),
    requestedSystems: z.array(z.string()).min(1),
    notes: z.string().optional().default("")
  })
};

export function validateSubmission(slug: FormSlug, values: Record<string, unknown>) {
  return submitSchemas[slug].safeParse(values);
}

export function buildValidationError(fieldErrors: Record<string, string[]>): ApiResponse<Record<string, string[]>> {
  return {
    success: false,
    status: 422,
    message: "Validacija podataka nije uspela.",
    data: fieldErrors
  };
}

export function buildNonFieldValidationError(message: string): ApiResponse<Record<string, string>> {
  return {
    success: false,
    status: 422,
    message: "Validacija podataka nije uspela.",
    data: {
      non_field_errors: message
    }
  };
}
