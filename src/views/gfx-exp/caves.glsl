uniform sampler2D u_texture;
uniform float u_time;

bool isTexel(ivec2 coord) {
    return ivec2(gl_FragCoord.xy) == coord;
}

vec4 setTexel(ivec2 coord, vec4 color) {
    return color * float(isTexel(coord));
}

void main() {
    gl_FragColor = setTexel(ivec2(0, 0), vec4(1.0, 0.0, 0.0, 1.0));
}