import { extractGlslFunction } from "../../../test-utils/frag.ts";
import frag from "./frag.glsl?raw";

export const getIsBlock = async () => extractGlslFunction(frag, "isBlock");
