uniform sampler2D u_texture;
uniform float u_time;

void main() {
    vec4 color = texture2D(u_texture, gl_FragCoord.xy);
    color.z = (2.0f + cos(gl_FragCoord.x * u_time) + sin(gl_FragCoord.y * (1.0f - u_time))) * 0.5f;
    color.x = (1.0f + sin(float((int(color.z * 100.0f) % 6)))) * 0.5f;
    color.z = pow(color.x, color.z);
    gl_FragColor = color;
}