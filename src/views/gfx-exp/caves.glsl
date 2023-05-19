uniform sampler2D u_texture;
uniform float u_time;

bool texelActive(ivec2 coord) {
    ivec2 c = ivec2(gl_FragCoord.x / 3.0f, gl_FragCoord.y / 2.4f);
    return coord == c;
}

vec4 setTexel(ivec2 coord, vec4 color) {
    return color * float(texelActive(coord));
}

vec4 setVar(int index, vec4 color) {
    return setTexel(ivec2(index, 0), color);
}

void main() {
    ivec2 texCoord = ivec2(gl_FragCoord.x / 3.0f, gl_FragCoord.y / 2.4f);
    vec4 color = vec4(length(vec2(texCoord)) / 600.0);
    color.w = 1.0;
    
    vec4 a = setVar(0, vec4(1.0));
    vec4 b = setVar(1, vec4(0.9));
    vec4 c = setVar(2, vec4(0.8));
    vec4 d = setVar(3, vec4(0.7));
    gl_FragColor = color + a + b + c + d;
}