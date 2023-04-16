import { expect, test } from "vitest";
import { extractGlslFunction, runFrag } from "../../../test-utils/frag";
import frag from "./frag.glsl?raw";

test("isBlock can be used to set a single value", async () => {
  const isBlock = extractGlslFunction(frag, "isBlock");
  expect(isBlock);
});
