import { expect, test } from "@playwright/test";

// The e2e server runs without RESEND_API_KEY (see playwright.config.ts), so a valid enquiry ends in „not_configured”.
test("contact form: a valid enquiry with a solved captcha reports the unconfigured mailer", async ({ page }) => {
  await page.goto("/pl/kontakt");
  const form = page.getByRole("form", { name: "Formularz zapytania" });
  await expect(form).toHaveAttribute("method", "post");

  const question = form.getByText(/Ile wynosi \d+ \+ \d+\?/);
  await expect(question).toBeVisible();
  const [, a, b] = (await question.innerText()).match(/(\d+) \+ (\d+)/)!;

  await form.getByLabel("Co chcesz zbadać lub wytworzyć?").fill("Test e2e: analiza składu fazowego próbki stali.");
  await form.getByLabel("Imię i nazwisko").fill("Jan Testowy");
  await form.getByLabel("E-mail", { exact: true }).fill("jan.testowy@example.com");
  await form.getByLabel(/Pytanie kontrolne/).fill(String(Number(a) + Number(b)));
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "Wyślij zapytanie" }).click();

  await expect(form.getByRole("status")).toContainText("Formularz jest chwilowo niedostępny.");
  // Never a native GET submit with personal data in the URL.
  expect(page.url()).not.toContain("email=");
});
