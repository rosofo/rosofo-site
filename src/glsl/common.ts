import glsl from "glslify";

export const defs = glsl`
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
ivec2 texelCoord(vec4 coord) {
    return ivec2(coord.x, coord.y);
}
vec4 setTexel(ivec2 coord, vec4 color) {
    if(coord == texelCoord(gl_FragCoord)) {
        return color;
    } else {
        return vec4(0.0);
    }
}
vec4 getScreenTexel(vec4 coord) {
    return texelFetch(u_texture, texelCoord(coord), 0);
}

vec4 get(int index) {
    return texelFetch(u_texture, ivec2(index, 0), 0);
}

vec4 set(int index, vec4 value) {
    return setTexel(ivec2(index, 0), value);
}

vec4 setP(int index, ivec2 value) {
    return setTexel(ivec2(index, 0), vec4(float(value.x) / float(textureSize(u_texture, 0)), float(value.y) / float(textureSize(u_texture, 0)), 0.0, 1.0));
}

ivec2 getP(int index) {
    return ivec2(get(index).x * float(textureSize(u_texture, 0).x), get(index).y * float(textureSize(u_texture, 0).y));
}

vec4 debugColor(int index, vec4 value) {
    float findex = float(index) * 8.0;
    return gl_FragCoord.x >= findex && gl_FragCoord.x < findex + 8.0 ? value : vec4(0.0);
}
`;
export const rand = (co: string) => `rand(${co})`;
export const texelCoord = (coord: string) => `texelCoord(${coord})`;
export const setTexel = (coord: string, color: string) =>
  `setTexel(${coord}, ${color})`;
export const getScreenTexel = (coord: string) => `getScreenTexel(${coord})`;
export const get = (index: string) => `get(${index})`;
export const set = (index: string, value: string) => `set(${index}, ${value})`;
export const debugColor = (index: string, value: string) =>
  `debugColor(${index}, ${value})`;
export const setP = (index: string, value: string) =>
  `setP(${index}, ${value})`;
export const getP = (index: string) => `getP(${index})`;
export const render = (subs: {
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
}`;
