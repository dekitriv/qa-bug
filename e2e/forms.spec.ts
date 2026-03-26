import { expect, test } from "@playwright/test";

test("dashboard shows all six forms", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Six prefilled forms. Six deliberate defects." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Personal Profile/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /System Access Request/i })).toBeVisible();
});

test("emergency contact shows only a generic error banner after submit", async ({ page }) => {
  await page.goto("/forms/emergency-contact");
  await page.getByRole("button", { name: "Save emergency contact" }).click();

  await expect(page.getByRole("alert")).toContainText("Validation failed.");
  await expect(page.getByText("Enter a valid Serbian mobile number.")).toHaveCount(0);
});

test("payroll setup strips the leading zero from the submitted payload", async ({ page }) => {
  await page.goto("/forms/payroll-setup");
  await expect(page.getByLabel("Account number")).toHaveValue("0600123400019988");
  await page.getByRole("button", { name: "Save payroll profile" }).click();

  await expect(page.getByText('"bankAccountNumber": "600123400019988"')).toBeVisible();
});

test("system access request loses one selected system in the saved result", async ({ page }) => {
  await page.goto("/forms/system-access-request");
  await page.getByRole("button", { name: "Provision access" }).click();

  await expect(page.getByText('"requestedSystems": [')).toHaveCount(2);
  await expect(page.getByText('"notion"')).toHaveCount(1);
});

