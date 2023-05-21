precision highp float;

uniform sampler2D u_texture;
uniform float u_x;
uniform float u_time;
uniform ivec2 u_p1;
uniform ivec2 u_p2;

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

void main() {
    ivec2 size = textureSize(u_texture, 0);

    vec4 newX = set(200, vec4(u_x));
    vec4 x = get(200);

    vec4 started = get(201);
    vec4 newStart = started.x == 0.0 ? set(201, vec4(1.0)) : set(201, started);

    ivec2 sc = texelCoord(gl_FragCoord);
    bool isOnLine = dot(vec2(sc - u_p1), vec2(u_p2 - u_p1)) == 0.0;
    vec4 lineColor = isOnLine ? vec4(0.5, 0.5, 1.0, 1.0) : vec4(0.0);

    if(texelCoord(gl_FragCoord).y > 10) {
        gl_FragColor = lineColor;
    } else if(texelCoord(gl_FragCoord).y > 0) {
        gl_FragColor = debugColor(0, x) + debugColor(1, started);
    } else {
        gl_FragColor = newX + newStart;
    }
}