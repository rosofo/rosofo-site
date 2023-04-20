import { extractGlslFunction } from "test-utils/frag";
import { readFile } from "fs/promises";

const frag = await readFile("../frag.glsl", { encoding: "utf-8" });

export const isBlock = extractGlslFunction(frag, "isBlock");
