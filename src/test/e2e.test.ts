import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { createServer, type ViteDevServer } from "vite";
import playwright, { type Browser, type Page } from "playwright";

describe("basic", async () => {
  let server: ViteDevServer;
  let browser: Browser;
  let page: Page;
  let address: string;

  beforeAll(async () => {
    server = await createServer();
    await server.listen();
    const addresses = server.httpServer?.address();

    if (!addresses || typeof addresses === "string") {
      throw new Error("Could not find address");
    }

    address = `${addresses.address}:${addresses.port}`;

    browser = await playwright.chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    await server.close();
  });

  test("should have the correct title", async () => {
    await page.goto(address);

    const home = await page.locator(".home", { hasText: "Home" });
    expect(await home.textContent()).to.include("Lorem ipsum");
  });
});
