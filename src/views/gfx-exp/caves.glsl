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
    if (coord == texelCoord(gl_FragCoord)) {
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

vec4 render (vec4[] colors, vec4[] debugColors, vec4[] newValues) {
    vec4 color = vec4(0.0);
    for (int i = 0; i < colors.length(); i++) {
        color += colors[i];
    }
    
    vec4 debugColors = vec4(0.0);
    for (int i = 0; i < debugColors.length(); i++) {
        debugColors += debugColors[i];
    }
    
    vec4 newValues = vec4(0.0);
    for (int i = 0; i < newValues.length(); i++) {
        newValues += newValues[i];
    }
    
    if (texelCoord(gl_FragCoord).y > 10) {
        gl_FragColor = color;
    } else if (texelCoord(gl_FragCoord).y > 0) {
        gl_FragColor = debugColors;
    } else {
        gl_FragColor = newValues;
    }
}

void main() {
    ivec2 size = textureSize(u_texture, 0);
    
    vec4 newX = set(200, vec4(u_x));
    vec4 x = get(200);
    
    vec4 started = get(201);
    vec4 newStart = started.w == 0.0 ? set(201, vec4(1.0)) : started;
    
    gl_FragColor = render(
        vec4[20](vec4(0.0)),
        vec4[20](debugColor(0, x), debugColor(1, started)),
        vec4[20](newX, newStart)
    );
}