import glsl from "glslify";

export const rand = glsl`float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}`;

export const texelCoord = glsl`ivec2 texelCoord(vec4 coord) {
    return ivec2(coord.x, coord.y);
}`;

export const setTexel = glsl`vec4 setTexel(ivec2 coord, vec4 color) {
    if(coord == texelCoord(gl_FragCoord)) {
        return color;
    } else {
        return vec4(0.0);
    }
}`;

export const getScreenTexel = glsl`vec4 getScreenTexel(vec4 coord) {
    return texelFetch(u_texture, texelCoord(coord), 0);
}`;

export const get = glsl`vec4 get(int index) {
    return texelFetch(u_texture, ivec2(index, 0), 0);
}`;

export const set = glsl`vec4 set(int index, vec4 value) {
    return setTexel(ivec2(index, 0), value);
}`;

export const setP = glsl`vec4 setP(int index, ivec2 value) {
    return setTexel(ivec2(index, 0), vec4(float(value.x) / float(textureSize(u_texture, 0)), float(value.y) / float(textureSize(u_texture, 0)), 0.0, 1.0));
}`;

export const getP = glsl`ivec2 getP(int index) {
    return ivec2(get(index).x * float(textureSize(u_texture, 0).x), get(index).y * float(textureSize(u_texture, 0).y));
}`;

export const debugColor = glsl`vec4 debugColor(int index, vec4 value) {
    float findex = float(index) * 8.0;
    return gl_FragCoord.x >= findex && gl_FragCoord.x < findex + 8.0 ? value : vec4(0.0);
}`;
