uniform sampler2D u_texture;
uniform int u_x;
uniform vec4 u_a;
uniform vec4 u_b;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

ivec2 texelCoord(vec4 coord) {
    return ivec2(coord.x, coord.y);
}

vec4 setTexel(ivec2 coord, vec4 color) {
    if (coord == texelCoord(gl_FragCoord)) {
        return color;
    } else {
        return vec4(0.0);
    }
}

vec4 getScreenTexel(vec4 coord) {
    return texelFetch(u_texture, texelCoord(coord), 0);
}

ivec2 var(int index) {
    int texelIndex = index / 4;
    int componentIndex = mod(index, 4);
    return ivec2(texelIndex, componentIndex);
}

float get(ivec2 varI) {
    vec4 nibble = texelFetch(u_texture, ivec2(varI.x, 0), 0);
    return nibble[varI.y];
}

vec4 set(ivec2 varI, float value) {
    vec4 nibble = texelFetch(u_texture, ivec2(varI.x, 0), 0);
    nibble[varI.y] = value;
    return setTexel(ivec2(varI.x, 0), nibble);
}

void main() {
    ivec2 size = textureSize(u_texture, 0);
    ivec2 vA = var(u_x);
    gl_FragColor = newA + newB;
}