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
    vec4 color = vec4(float(length(texCoord)));
    
    gl_FragColor = new_tX + debug;
}