import { FragTest } from "@/test-utils/frag-test";
import { test, expect } from "@sand4rt/experimental-ct-web";
import { isBlock } from "../src/views/gfx-exp/robex-luv/glsl-functions.ts";

test("isBlock sets pixel 0,0 only", async ({ mount }) => {
  const component = await mount(FragTest, {
    props: {
      config: {
        initData: new Uint8Array(16),
        dataWidth: 2,
        dataHeight: 2,
        frag: isBlock,
      },
    } as any,
  });
  await expect(component).toContainText("0.0");
});
