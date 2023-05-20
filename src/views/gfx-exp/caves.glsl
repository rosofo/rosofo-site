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

vec4 getTexel(vec4 coord) {
    return texelFetch(u_texture, ivec2(coord.x / 3.0f, coord.y / 2.4f), 0);
}

vec4 getCurrentTexel() {
    return texelFetch(u_texture, ivec2(gl_FragCoord.x / 3.0f, gl_FragCoord.y / 2.4f), 0);
}

vec4 setVar(int index, vec4 color) {
    return setTexel(ivec2(index, 0), color);
}

vec4 getVar(int index) {
    return texelFetch(u_texture, ivec2(index, 0), 0);
}

#define _IF_TEMPLATE(type) \
    type _if(bool p, type v) { \
        return float(p) * v; \
    }

_IF_TEMPLATE(float)
_IF_TEMPLATE(vec4)

bool varActive() {
    ivec2 c = ivec2(gl_FragCoord.x / 3.0f, gl_FragCoord.y / 2.4f);
    return c.y == 0;
}

vec4 pickRandTexel() {
    return texelFetch(u_texture, ivec2(rand(gl_FragCoord.xy) * 200.0, rand(gl_FragCoord.xy) * 200.0), 0);
}

vec4 saveColor(vec4 color) {
    return _if(!varActive(), color);
}

void main() {
    vec4 a = getVar(100);
    vec4 b = getVar(102);
    
    gl_FragColor = setVar(100, vec4(1.0)) + saveColor(a + b);
}