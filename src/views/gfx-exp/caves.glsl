uniform sampler2D u_texture;
uniform int u_x;
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

float get(int index) {
    return texelFetch(u_texture, ivec2(index, 0), 0);
}

vec4 set(ivec2 varI, vec4 value) {
    return setTexel(ivec2(varI.x, 0), value);
}

void main() {
    ivec2 size = textureSize(u_texture, 0);
    
    vec4 newX = set(0, vec4(u_x));
    vec4 x = get(0);
    vec4 newA = setTexel(ivec2(x, size.y / 2), u_a);
    
    if (texelCoord(gl_FragCoord).y > 0) {
        gl_FragColor = x;
    } else {
        gl_FragColor = newX;
    }
}