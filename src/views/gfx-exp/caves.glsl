uniform sampler2D u_texture;
uniform float u_time;

bool texelActive(ivec2 coord) {
    ivec2 c = ivec2(gl_FragCoord.x / 3.0f, gl_FragCoord.y / 2.4f);
    return coord == c;
}

vec4 setTexel(ivec2 coord, vec4 color) {
    return color * float(texelActive(coord));
}

void main() {
    ivec2 current = ivec2(gl_FragCoord.xy);
    gl_FragColor = current.x < 300 && current.y < 240 ? vec4(1.0, 0.0, 0.0, 1.0) : vec4(0.0);
}