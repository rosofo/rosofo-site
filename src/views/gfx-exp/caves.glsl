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
    vec4 tX = setTexel(ivec2(0, 0), texelFetch(u_texture, ivec2(0, 0), 0) + vec4(0.00001f));
    ivec2 current = ivec2(gl_FragCoord.x / 3.0f, gl_FragCoord.y / 2.4f);
    gl_FragColor = tX + (vec4(1.0, 0.0, 0.0, 1.0) - texelFetch(u_texture, ivec2(0, 0), 0)) * float(!texelActive(ivec2(0, 0)));
}