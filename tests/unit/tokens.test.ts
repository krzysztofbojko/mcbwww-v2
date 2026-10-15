import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contrast } from "@/lib/contrast";

const css = readFileSync(path.resolve(__dirname, "../../app/globals.css"), "utf8");

function token(name: string): string {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`missing token --color-${name}`);
  return m[1];
}

describe("design tokens", () => {
  it("match the approved palette (docs/design/mockups/tokens.css)", () => {
    expect(token("paper").toUpperCase()).toBe("#F4F1EB");
    expect(token("paper-deep").toUpperCase()).toBe("#E9E4DA");
    expect(token("ink").toUpperCase()).toBe("#1B1917");
    expect(token("ink-muted").toUpperCase()).toBe("#5A544C");
    expect(token("rule").toUpperCase()).toBe("#CFC8BB");
    expect(token("burgundy").toUpperCase()).toBe("#7C1E2D");
    expect(token("burgundy-deep").toUpperCase()).toBe("#5C1420");
    expect(token("burgundy-tint").toUpperCase()).toBe("#E9CFD2");
    expect(token("steel").toUpperCase()).toBe("#4F5B66");
    expect(token("steel-wash").toUpperCase()).toBe("#DFE3E6");
  });

  // Every text pair used by the primitives and mockups.
  const pairs: Array<[fg: string, bg: string]> = [
    ["ink", "paper"],
    ["ink", "paper-deep"],
    ["ink", "steel-wash"],
    ["ink-muted", "paper"],
    ["ink-muted", "paper-deep"],
    ["ink-muted", "steel-wash"],
    ["burgundy", "paper"],
    ["burgundy", "paper-deep"],
    ["burgundy", "steel-wash"],
    ["burgundy-deep", "paper"],
    ["steel", "paper"],
    ["steel", "paper-deep"],
    ["steel", "steel-wash"],
    ["paper", "burgundy"],
    ["paper", "burgundy-deep"],
    ["burgundy-tint", "burgundy"],
    ["paper", "ink"],
    ["ink-subtle", "ink"],
    ["steel-light", "ink"],
  ];
  it.each(pairs)("%s on %s is at least 4.5:1", (fg, bg) => {
    expect(contrast(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });
});
