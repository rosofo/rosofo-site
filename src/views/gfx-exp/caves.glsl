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
    vec4 curr_tX = texelFetch(u_texture, ivec2(0, 0), 0);
    vec4 new_tX = setTexel(ivec2(0, 0), vec4((curr_tX.x + 0.001) % 1.0));
    vec4 current =  (vec4(1.0, 0.0, 0.0, 1.0) - curr_tX) * float(!texelActive(ivec2(0, 0)));
    gl_FragColor = new_tX + current;
}