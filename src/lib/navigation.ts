import type { PublicFormSummary } from "@shared/types";

export const adminNavigation: PublicFormSummary[] = [
  {
    slug: "personal-profile",
    title: "Lični profil",
    description: "Osnovni profil zaposlenog",
    progressLabel: "Korak 1 od 6"
  },
  {
    slug: "emergency-contact",
    title: "Kontakt u hitnim slučajevima",
    description: "Kontakt za hitne slučajeve",
    progressLabel: "Korak 2 od 6"
  },
  {
    slug: "job-assignment",
    title: "Dodela posla",
    description: "Odeljenje i menadžer",
    progressLabel: "Korak 3 od 6"
  },
  {
    slug: "payroll-setup",
    title: "Plata i obračun",
    description: "Banka i broj računa",
    progressLabel: "Korak 4 od 6"
  },
  {
    slug: "benefits-enrollment",
    title: "Benefiti",
    description: "Pokrivenost i članovi porodice",
    progressLabel: "Korak 5 od 6"
  },
  {
    slug: "system-access-request",
    title: "Zahtev za pristup sistemima",
    description: "Alati i dozvole",
    progressLabel: "Korak 6 od 6"
  }
];
