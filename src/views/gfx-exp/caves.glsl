precision highp float;

#define PI 3.1415926535897932384626433832795

uniform sampler2D u_texture;
uniform float u_x;
uniform float u_time;
uniform ivec2 u_p1;

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

vec4 setP(int index, ivec2 value) {
    return setTexel(ivec2(index, 0), vec4(float(value.x) / float(textureSize(u_texture, 0)), float(value.y) / float(textureSize(u_texture, 0)), 0.0, 1.0));
}

ivec2 getP(int index) {
    return ivec2(get(index).x * float(textureSize(u_texture, 0).x), get(index).y * float(textureSize(u_texture, 0).y));
}

vec4 debugColor(int index, vec4 value) {
    float findex = float(index) * 8.0;
    return gl_FragCoord.x >= findex && gl_FragCoord.x < findex + 8.0 ? value : vec4(0.0);
}

void main() {
    ivec2 size = textureSize(u_texture, 0);

    vec4 newX = set(200, vec4(u_x));
    vec4 x = get(200);

    vec4 started = get(201);
    vec4 newStart = started.x == 0.0 ? set(201, vec4(1.0)) : set(201, started);

    ivec2 p2 = getP(202);
    vec4 newP2 = setP(202, ivec2(cos(u_x * 2.0 * PI) * 100.0, sin(u_x * 2.0 * PI) * 100.0) + u_p1);

    ivec2 sc = texelCoord(gl_FragCoord);
    mat2 rot = mat2(cos(0.5 * PI), -sin(0.5 * PI), sin(0.5 * PI), cos(0.5 * PI));
    float dpM = dot(normalize(vec2(p2 - u_p1)), rot * normalize(vec2(sc - (u_p1 - p2) / 2)));

    vec4 fill = abs(vec4(vec3(dpM), 1.0)) - length(vec2(sc - u_p1)) * 0.003;

    if(texelCoord(gl_FragCoord).y > 10) {
        gl_FragColor = fill + setTexel(p2, vec4(0.09f, 0.06f, 0.78f, 1.0f));
    } else if(texelCoord(gl_FragCoord).y > 0) {
        gl_FragColor = debugColor(0, x) + debugColor(1, started) + debugColor(2, vec4(p2.x));
    } else {
        gl_FragColor = newX + newStart + newP2;
    }
}