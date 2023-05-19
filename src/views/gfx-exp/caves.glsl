uniform sampler2D u_texture;
uniform float u_time;

ivec2 texelCoord(vec4 fragCoord) {
    return ivec2((int)(fragCoord.x / 3.0), (int)(fragCoord.y / 2.4));
}

bool texelActive(ivec2 coord) {
    return texelCoord(gl_FragCoord.xy) == coord;
}

vec4 setTexel(ivec2 coord, vec4 color) {
    return color * float(texelActive(coord));
}

void main() {
    ivec2 current = ivec2(gl_FragCoord.xy);
    gl_FragColor = current.x < 300 && current.y < 240 ? vec4(1.0, 0.0, 0.0, 1.0) : vec4(0.0);
}