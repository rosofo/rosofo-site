uniform sampler2D u_texture;
uniform float u_time;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

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

vec4 getVar(int index) {
    return texelFetch(u_texture, ivec2(index, 0), 0);
}

vec4 cond(bool p, vec4 v) {
    return float(p) * v;
}

bool varActive() {
    ivec2 c = ivec2(gl_FragCoord.x / 3.0f, gl_FragCoord.y / 2.4f);
    return c.y == 0;
}

void main() {
    bool isStart = getVar(0).w == 1.0;
    vec4 newIsStart = vec4(0.0);
    
    vec4 randomColorStart = cond(!varActive(), cond(isStart, vec4(vec3(rand(gl_FragCoord.xy)), 1.0)));
    
    gl_FragColor = (newIsStart + randomColorStart) * cond(getVar(0).w < 1.0 && getVar(0).w > 0.0, 0.0);
}