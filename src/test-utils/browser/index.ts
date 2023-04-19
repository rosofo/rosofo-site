import { createServer } from "vite";
import { expect } from "vitest";
import { chromium } from "playwright";

export async function runInBrowser(filepath: string) {
  process.env.VITE_BROWSER_SCRIPT = filepath;
  const server = await createServer({
    root: __dirname,
    server: {
      port: 5000,
    },
  });
  await server.listen();
  const browser = await chromium.launch();
  console.log(browser);
  const page = await browser.newPage();
  console.log(page);
  await page.goto("http://localhost:5000");
  expect(await page.title()).toEqual("foo");
}
