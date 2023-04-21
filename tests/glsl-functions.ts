import frag from "../src/views/gfx-exp/robex-luv/frag.glsl?raw";
import { extractGlslFunction } from "../src/test-utils/frag.ts";

export const isBlock = extractGlslFunction(frag, "isBlock");
