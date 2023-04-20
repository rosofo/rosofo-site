import { extractGlslFunction } from "../../../test-utils/frag.ts";
import { readFile } from "fs/promises";
import { resolve } from "path";

export const isBlock = extractGlslFunction(
  await readFile(resolve(__dirname, "./frag.glsl"), { encoding: "utf-8" }),
  "isBlock"
);
