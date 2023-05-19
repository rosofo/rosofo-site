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
    ivec2 texCoord = ivec2(gl_FragCoord.x / 3.0f, gl_FragCoord.y / 2.4f);
    vec4 color = vec4(length(vec2(texCoord)) / 600.0);
    color.w = 1.0;
    
    gl_FragColor = color + setTexel(ivec2(100, 101), vec4(1.0));
}