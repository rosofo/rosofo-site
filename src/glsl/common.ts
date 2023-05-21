import glsl from "glslify";
import { defineFuncs } from "./shader-funcs";

export default defineFuncs({
  rand: {
    definition: glsl`float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}`,
    caller: (co: string) => `rand(${co})`,
  },

  texelCoord: {
    definition: glsl`ivec2 texelCoord(vec4 coord) {
    return ivec2(coord.x, coord.y);
}`,
    caller: (coord: string) => `texelCoord(${coord})`,
  },

  setTexel: {
    definition: glsl`vec4 setTexel(ivec2 coord, vec4 color) {
    if(coord == texelCoord(gl_FragCoord)) {
        return color;
    } else {
        return vec4(0.0);
    }
}`,
    caller: (coord: string, color: string) => `setTexel(${coord}, ${color})`,
  },

  getScreenTexel: {
    definition: glsl`vec4 getScreenTexel(vec4 coord) {
    return texelFetch(u_texture, texelCoord(coord), 0);
}`,
    caller: (coord: string) => `getScreenTexel(${coord})`,
  },

  get: {
    definition: glsl`vec4 get(int index) {
    return texelFetch(u_texture, ivec2(index, 0), 0);
}`,
    caller: (index: string) => `get(${index})`,
  },

  set: {
    definition: glsl`vec4 set(int index, vec4 value) {
    return setTexel(ivec2(index, 0), value);
}`,
    caller: (index: string, value: string) => `set(${index}, ${value})`,
  },

  setP: {
    definition: glsl`vec4 setP(int index, ivec2 value) {
    return setTexel(ivec2(index, 0), vec4(float(value.x) / float(textureSize(u_texture, 0)), float(value.y) / float(textureSize(u_texture, 0)), 0.0, 1.0));
}`,
    caller: (index: string, value: string) => `setP(${index}, ${value})`,
  },

  getP: {
    definition: glsl`ivec2 getP(int index) {
    return ivec2(get(index).x * float(textureSize(u_texture, 0).x), get(index).y * float(textureSize(u_texture, 0).y));
}`,
    caller: (index: string) => `getP(${index})`,
  },

  debugColor: {
    definition: glsl`vec4 debugColor(int index, vec4 value) {
    float findex = float(index) * 8.0;
    return gl_FragCoord.x >= findex && gl_FragCoord.x < findex + 8.0 ? value : vec4(0.0);
}`,
    caller: (index: string, value: string) => `debugColor(${index}, ${value})`,
  },

  render: {
    caller: (subs: {
      colors: string[];
      debugColors: string[];
      vars: string[];
    }) => glsl`
if(texelCoord(gl_FragCoord).y > 10) {
    gl_FragColor = ${subs.colors.join(" + ")};
} else if(texelCoord(gl_FragCoord).y > 0) {
    gl_FragColor = ${subs.debugColors.join(" + ")};
} else {
    gl_FragColor = ${subs.vars.join(" + ")};
}`,
    definition: glsl``,
  },
});
