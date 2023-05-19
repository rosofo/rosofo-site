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
    
    vec4 a = setTexel(ivec2(100, 100), vec4(1.0));
    vec4 b = setTexel(ivec2(101, 100), vec4(0.9));
    vec4 c = setTexel(ivec2(100, 102), vec4(0.8));
    vec4 d = setTexel(ivec2(101, 101), vec4(0.7));
    gl_FragColor = color + a + b + c + d;
}