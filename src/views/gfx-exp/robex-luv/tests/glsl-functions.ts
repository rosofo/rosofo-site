import { extractGlslFunction } from "../../../../test-utils/frag.ts";
import { readFile } from "fs/promises";
import { resolve } from "path";

const getFrag = () =>
  readFile(resolve(__dirname, "../frag.glsl"), { encoding: "utf-8" });

export const getIsBlock = async () =>
  extractGlslFunction(await getFrag(), "isBlock");
