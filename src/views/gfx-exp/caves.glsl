uniform sampler2D u_texture;
uniform float u_time;

bool isTexel(ivec2 coord) {
    return ivec2(gl_FragCoord.xy) == coord;
}

vec4 setTexel(ivec2 coord, vec4 color) {
    return color * float(isTexel(coord));
}

void main() {
    ivec2 current = ivec2(gl_FragCoord.xy);
    gl_FragColor = current.x < 100 && current.y < 100 ? vec4(1.0, 0.0, 0.0, 1.0) : vec4(0.0);
}