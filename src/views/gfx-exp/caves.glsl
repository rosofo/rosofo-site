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

void main() {
    ivec2 size = textureSize(u_texture, 0);
    
    vec4 newX = set(200, vec4(u_x));
    vec4 x = get(0);
    
    if (texelCoord(gl_FragCoord).y > 10) {
        gl_FragColor = vec4(x.xyz, 1.0);
    } else {
        gl_FragColor = newX;
    }
}