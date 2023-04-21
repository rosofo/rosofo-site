import { extractGlslFunction } from "../src/test-utils/frag.ts";
import { readFile } from "fs/promises";

export const getIsBlock = async () =>
  extractGlslFunction(
    await readFile("./src/views/gfx-exp/robex-luv/frag.glsl", {
      encoding: "utf-8",
    }),
    "isBlock"
  );
