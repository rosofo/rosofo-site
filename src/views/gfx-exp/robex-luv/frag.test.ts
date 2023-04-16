import { expect, test } from "vitest";
import { runFrag } from "../../../test-utils/frag";
import glsl from "glslify";
import frag from "./frag.glsl?url";

test("isBlock can be used to set a single value", () => {
  const result = glsl`
  #pragma glslify: isBlock = require('${frag}')
  `;
  expect(result);
});
