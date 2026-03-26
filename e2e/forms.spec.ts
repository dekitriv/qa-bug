import { expect, test } from "@playwright/test";

test("dashboard shows all six forms", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Šest unapred popunjenih formulara/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Lični profil/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Zahtev za pristup sistemima/i })).toBeVisible();
});

test("emergency contact shows only a generic error banner after submit", async ({ page }) => {
  await page.goto("/forms/emergency-contact");
  await page.getByRole("button", { name: "Sačuvaj kontakt u hitnim slučajevima" }).click();

  await expect(page.getByRole("alert")).toContainText("Validacija podataka nije uspela.");
  await expect(page.getByText("Unesite validan srpski mobilni broj.")).toHaveCount(0);
});

test("payroll setup shows swallowed leading zero in saved details", async ({ page }) => {
  await page.goto("/forms/payroll-setup");
  await expect(page.getByLabel("Broj računa")).toHaveValue("0600123400019988");
  await page.getByRole("button", { name: "Sačuvaj platni profil" }).click();

  await page.waitForURL(/\/forms\/payroll-setup\/details/);
  await expect(page.getByText("600123400019988")).toBeVisible();
});

test("system access submit stays on form when CORS blocks response in local dev", async ({ page }) => {
  await page.goto("/forms/system-access-request");
  await page.getByRole("button", { name: "Podnesi zahtev za pristup" }).click();

  await expect(page).toHaveURL(/\/forms\/system-access-request\/?$/);
});
