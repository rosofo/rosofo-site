uniform sampler2D u_texture;
uniform float u_time;

bool isTexel(ivec2 coord) {
    return ivec2(gl_FragCoord.xy) == coord;
}

vec4 setTexel(ivec2 coord, vec4 color) {
    return color * isTexel(coord);
}

void main() {
    vec4 color = texelFetch(u_texture, ivec2(gl_FragCoord.xy), 0);
    gl_FragColor = color;
}