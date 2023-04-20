import { extractGlslFunction } from "../../../test-utils/frag.ts";
import { readFile } from "fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

export const isBlock = extractGlslFunction(
  await readFile(resolve(__dirname, "./frag.glsl"), { encoding: "utf-8" }),
  "isBlock"
);
