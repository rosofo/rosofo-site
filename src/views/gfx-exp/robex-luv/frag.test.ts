import { test, expect } from "vitest";
import { runInBrowser } from "../../../test-utils/browser";
import { resolve } from "path";

test("foo", async () => {
  await runInBrowser(resolve(__dirname, "main.fragtest.ts"));
});
