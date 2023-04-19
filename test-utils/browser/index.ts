import { createServer } from "vite";
import { expect } from "vitest";
import { chromium } from "playwright";
import { exec } from "child_process";
import { resolve } from "path";

async function serve(filepath: string) {
  const process = exec(`npx vite ${resolve(__dirname, "index.html")}`);
}

export async function runInBrowser(filepath: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:5000");
}
