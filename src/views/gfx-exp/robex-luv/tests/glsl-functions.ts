import { extractGlslFunction } from "test-utils/frag";
import frag from "./frag.glsl?raw";

export const isBlock = extractGlslFunction(frag, "isBlock");
