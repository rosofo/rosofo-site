uniform sampler2D u_texture;
uniform vec4 u_a;
uniform vec4 u_b;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

bool texelActive(ivec2 coord) {
    ivec2 c = ivec2(gl_FragCoord.x / 3.0f, gl_FragCoord.y / 2.4f);
    return coord == c;
}

vec4 setTexel(ivec2 coord, vec4 color) {
    return color * float(texelActive(coord));
}

vec4 getTexel(vec4 coord) {
    return texelFetch(u_texture, ivec2(coord.x / 3.0f, coord.y / 2.4f), 0);
}

void main() {
    gl_FragColor = u_a;
}