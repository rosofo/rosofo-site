import { createServer } from "vite";
import { expect } from "vitest";
import { chromium } from "playwright";
import { spawn } from "child_process";
import { resolve } from "path";

async function serve(filepath: string) {
  process.env.VITE_BROWSER_SCRIPT = filepath;
  return spawn(`npx vite --port 5000 ${resolve(__dirname, "index.html")}`);
}

export async function runInBrowser(filepath: string) {
  serve(filepath);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:5000");
}
