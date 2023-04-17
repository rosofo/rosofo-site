import * as THREE from "three";
import { expect, test } from "vitest";
import { extractGlslFunction, runFrag } from "../../../test-utils/frag";
import frag from "./frag.glsl?raw";

test("isBlock can be used to set a single value", async () => {
  const isBlock = extractGlslFunction(frag, "isBlock");
  const testFrag = `
  uniform sampler2D u_texture;
  
  ${isBlock}
  
  void main() {
    vec4 data = texture2D(u_texture, gl_FragCoord.xy);
    return float(isBlock(gl_FragCoord, 0)) * vec4(1.0f);
  }
  `;
  const data = new Uint8Array(8);
  const result = runFrag(testFrag, data, 2, 1);

  expect(result);
});
