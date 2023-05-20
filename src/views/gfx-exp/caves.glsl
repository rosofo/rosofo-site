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

void main() {
    ivec2 size = textureSize(u_texture, 0);
    vec4 newA = setTexel(ivec2(u_x, size.y / 2, u_a);
    vec4 newB = setTexel(ivec2(u_x + 3, size.y / 2, texelFetch(u_texture, ivec2(u_x, size.y / 2, 0));
    gl_FragColor = newA + newB;
}