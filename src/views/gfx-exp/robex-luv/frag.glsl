uniform sampler2D u_texture;
uniform int u_width;
uniform int u_height;


void main() {
    vec4 data = texture2D(u_texture, gl_FragCoord.xy);
    bool is_a = gl_FragCoord.x / float(u_width) < 0.9f && gl_FragCoord.y / float(u_height) < 0.9f;
    
    vec4 new_a = float(is_a) * (data + 0.01f);
    vec4 curr_a = texture2D(u_texture, vec2(0.0f, 0.0f));
    vec4 new_rest = float(!is_a) * vec4(curr_a.x, 0.0f, 0.0f, 1.0f);

    gl_FragColor = new_a + new_rest;
}