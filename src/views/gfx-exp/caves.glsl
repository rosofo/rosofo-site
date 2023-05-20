precision highp float;

uniform sampler2D u_texture;
uniform float u_x;
uniform vec4 u_a;
uniform vec4 u_b;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

ivec2 texelCoord(vec4 coord) {
    return ivec2(coord.x, coord.y);
}

vec4 setTexel(ivec2 coord, vec4 color) {
    if(coord == texelCoord(gl_FragCoord)) {
        return color;
    } else {
        return vec4(0.0);
    }
}

vec4 getScreenTexel(vec4 coord) {
    return texelFetch(u_texture, texelCoord(coord), 0);
}

vec4 get(int index) {
    return texelFetch(u_texture, ivec2(index, 0), 0);
}

vec4 set(int index, vec4 value) {
    return setTexel(ivec2(index, 0), value);
}

vec4 debugColor(int index, vec4 value) {
    float findex = float(index) * 8.0;
    return gl_FragCoord.x >= findex && gl_FragCoord.x < findex + 8.0 ? value : vec4(0.0);
}

#define render(A, B, C) render(A, B, C) \
void render(vec4[A] colors, vec4[B] debugColors, vec4[C] newValues) { \
    vec4 color = vec4(0.0f); \
    for(int i = 0; i < colors.length(); i++) { \
        color += colors[i]; \
    } \
    vec4 debugColor = vec4(0.0); \
    for(int i = 0; i < debugColors.length(); i++) { \
        debugColor += debugColors[i]; \
    } \
    vec4 newValue = vec4(0.0); \
    for(int i = 0; i < newValues.length(); i++) { \
        newValue += newValues[i]; \
    } \
    if(texelCoord(gl_FragCoord).y > 10) { \
        gl_FragColor = color; \
    } else if(texelCoord(gl_FragCoord).y > 0) { \
        gl_FragColor = debugColor; \
    } else { \
        gl_FragColor = newValue; \
    } \
}

void main() {
    ivec2 size = textureSize(u_texture, 0);

    vec4 newX = set(200, vec4(u_x));
    vec4 x = get(200);

    vec4 started = get(201);
    vec4 newStart = started.w == 0.0 ? set(201, vec4(1.0)) : started;

    render(vec4[1](vec4(0.0)), vec4[2](debugColor(0, x), debugColor(1, started)), vec4[2](newX, newStart));
}