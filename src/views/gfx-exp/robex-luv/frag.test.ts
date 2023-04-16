import { expect, test } from "vitest";
import { runFrag } from "../../../test-utils/frag";
import glsl from "glslify";

test("isBlock can be used to set a single value", async () => {
  const frag = (await import("./frag.glsl?url")).default;
  const result = glsl`
  #pragma glslify: isBlock = require('${frag}')
  `;
  expect(result);
});
