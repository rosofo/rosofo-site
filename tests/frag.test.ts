import { FragTest } from "@/test-utils/frag-test";
import { test, expect } from "@sand4rt/experimental-ct-web";
import { getIsBlock } from "./glsl-functions.ts";

test("isBlock sets pixel 0,0 only", async ({ mount }) => {
  const frag = `
  ${await getIsBlock()}
  
  void main() {
    gl_FragColor = vec4(1.0f) * float(isBlock(gl_FragCoord.xy, 0));
  }
  `;
  const component = await mount(FragTest, {
    props: {
      config: {
        initData: new Uint8Array(16),
        dataWidth: 2,
        dataHeight: 2,
        frag,
      },
    } as any,
  });
  const resultData = await component.evaluate<Uint8Array>(
    (elem) => elem.debugger.resultData
  );
  expect(resultData[0]).toEqual(255);
  expect(resultData[4]).toEqual(0);
});
