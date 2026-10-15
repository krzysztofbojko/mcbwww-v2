import { expect, test, type Page } from "@playwright/test";

const staticRoutes = ["", "/oferta", "/infrastruktura", "/projekty", "/publikacje", "/galeria", "/kontakt"];
const serviceSlug = "projektowanie-materialow";
const equipmentSlug = "quantum-espresso";

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

for (const locale of ["pl", "en"]) {
  const paths = [...staticRoutes, `/oferta/${serviceSlug}`, `/infrastruktura/${equipmentSlug}`];
  for (const p of paths) {
    const url = `/${locale}${p}`;
    test(`${url} renders with 200, h1 and no console errors`, async ({ page }) => {
      const errors = collectConsoleErrors(page);
      const res = await page.goto(url);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1").first()).toBeVisible();
      await page.waitForLoadState("networkidle");
      expect(errors).toEqual([]);
    });
  }
}

test("/ redirects to /pl", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/pl\/?$/);
});

test("a dot in a page path does not bypass the locale redirect", async ({ request }) => {
  const res = await request.get("/oferta/v1.0", { maxRedirects: 0 });
  expect(res.status()).toBe(307);
  expect(res.headers()["location"]).toMatch(/\/pl\/oferta\/v1\.0$/);
});

for (const url of ["/pl/oferta/xyz", "/pl/infrastruktura/xyz", "/de"]) {
  test(`${url} returns 404`, async ({ page }) => {
    const res = await page.goto(url);
    expect(res?.status()).toBe(404);
    await expect(page.locator("h1").first()).toBeVisible();
  });
}

test("language switcher on /pl/oferta leads to /en/oferta", async ({ page }) => {
  await page.goto("/pl/oferta");
  await page.getByRole("banner").getByRole("link", { name: /English/i }).click();
  await expect(page).toHaveURL(/\/en\/oferta$/);
});

test("language switcher keeps query and hash", async ({ page }) => {
  await page.goto("/pl/infrastruktura?q=SEM#wyniki");
  await page.getByRole("banner").getByRole("link", { name: /English/i }).click();
  await expect(page).toHaveURL(/\/en\/infrastruktura\?q=SEM#wyniki$/);
});
