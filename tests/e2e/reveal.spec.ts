import { expect, test } from "@playwright/test";

// Home sections below the first screen enter once (direction.md §Ruch); the hero is never hidden.
const pending = "[data-reveal-pending]";

test("below-the-fold sections rise in once and leave no inline transform", async ({ page }) => {
  await page.goto("/pl");
  // After hydration the off-screen items are hidden, ready to enter.
  await expect(page.locator(pending).first()).toBeAttached();
  await expect(page.locator(`#main > :first-child ${pending}`)).toHaveCount(0);

  const about = page.locator("section[aria-labelledby='about-title']");
  // The section's items (more than one: staggered) wait hidden; remember them to check after the entrance.
  const items = about.locator(pending);
  expect(await items.count()).toBeGreaterThan(1);
  await items.evaluateAll((els) => els.forEach((el) => el.setAttribute("data-e2e-item", "")));
  expect(await items.first().evaluate((el) => getComputedStyle(el).opacity)).toBe("0");

  await about.scrollIntoViewIfNeeded();
  await expect(about.locator(pending)).toHaveCount(0);
  const styles = await about.locator("[data-e2e-item]").evaluateAll((els) =>
    els.map((el) => ({
      opacity: getComputedStyle(el).opacity,
      transform: getComputedStyle(el).transform,
      inline: el.getAttribute("style") ?? "",
      animations: el.getAnimations().length,
    })),
  );
  for (const s of styles) expect(s).toEqual({ opacity: "1", transform: "none", inline: "", animations: 0 });
});

test("reduced motion: nothing is hidden or moved", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/pl");
  await page.waitForLoadState("networkidle");
  await expect(page.locator(pending)).toHaveCount(0);
});

test("print shows content that has not been revealed yet", async ({ page }) => {
  await page.goto("/pl");
  const item = page.locator(pending).first();
  await expect(item).toBeAttached();
  await page.emulateMedia({ media: "print" });
  expect(await item.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("all sections are visible as rendered", async ({ page }) => {
    await page.goto("/pl");
    await expect(page.locator(pending)).toHaveCount(0);
    await expect(page.locator("#cta-title")).toBeVisible();
  });
});

for (const url of ["/pl", "/pl/oferta/preparatyka-metalograficzna", "/pl/infrastruktura/quantum-espresso", "/pl/kontakt"]) {
  test(`${url}: scrolling through the page reveals every section`, async ({ page }) => {
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= height; y += 400) await page.mouse.wheel(0, 400);
    await expect(page.locator(pending)).toHaveCount(0);
  });
}
