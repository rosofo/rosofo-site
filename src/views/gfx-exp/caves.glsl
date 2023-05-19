uniform sampler2D u_texture;
uniform float u_time;

void main() {
    vec4 color = texelFetch(u_texture, ivec2(gl_FragCoord.xy), 0);
    gl_FragColor = color;
}