import { expect, test } from "@playwright/test";

const rows = (page: import("@playwright/test").Page) => page.getByRole("list", { name: "Wyniki" }).getByRole("listitem");

test("search narrows the list and keeps ?q= in the URL", async ({ page }) => {
  await page.goto("/pl/infrastruktura");
  await expect(rows(page).first()).toBeVisible();
  const all = await rows(page).count();
  await page.getByRole("searchbox", { name: "Szukaj w katalogu aparatury" }).fill("AC922");
  await expect(page).toHaveURL(/[?&]q=AC922/);
  await expect.poll(() => rows(page).count()).toBeLessThan(all);
  expect(await rows(page).count()).toBeGreaterThan(0);
  await expect(rows(page).first()).toContainText("AC922");
});

test("no-match query shows the empty state and a clear button", async ({ page }) => {
  await page.goto("/pl/infrastruktura");
  await page.getByRole("searchbox", { name: "Szukaj w katalogu aparatury" }).fill("zzzzqqqq");
  await expect(page.getByText("Brak wyników spełniających wybrane kryteria.")).toBeVisible();
  const clear = page.getByRole("button", { name: "Wyczyść filtry" }).last();
  await expect(clear).toBeVisible();
  await clear.click();
  await expect(rows(page).first()).toBeVisible();
  await expect(page).not.toHaveURL(/q=/);
});

test("picking a cluster filters the cards", async ({ page }) => {
  await page.goto("/pl/infrastruktura");
  await expect(rows(page).first()).toBeVisible();
  const all = await rows(page).count();
  const cluster = page.locator('input[name="klaster"]:not([value=""])').first();
  await expect(cluster).toBeEnabled();
  await cluster.click({ force: true });
  await expect(page).toHaveURL(/[?&]klaster=/);
  await expect.poll(() => rows(page).count()).toBeLessThan(all);
  expect(await rows(page).count()).toBeGreaterThan(0);
});

test("unknown ?temat= preselects the topic „Inne”", async ({ page }) => {
  await page.goto("/pl/kontakt?temat=nieistniejacy");
  const select = page.getByLabel("Temat");
  await expect(select).toBeVisible();
  await expect(select.locator("option:checked")).toHaveText("Inne");
});
