import { createServer } from "vite";
import { expect } from "vitest";
import { chromium } from "playwright";

export async function runInBrowser(filepath: string) {
  const browser = await chromium.launch();
  console.log(browser);
  const page = await browser.newPage();
  console.log(page);
  console.log(await page.title());
  await page.goto("http://localhost:5000");
}
