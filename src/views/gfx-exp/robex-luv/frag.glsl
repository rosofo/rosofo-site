uniform sampler2D u_texture;

void main() {
    vec4 color = texture2D(u_texture, gl_FragCoord.xy);
    vec4 prev_color = texture2D(u_texture, gl_FragCoord.xy - 0.1f);
    float new_pixel = 1.0f;
    vec4 new_pixel_color = new_pixel * vec4(0.1f, 0.0f, 0.0f, 1.0f);
    gl_FragColor = 2.0f * prev_color + new_pixel_color;
}