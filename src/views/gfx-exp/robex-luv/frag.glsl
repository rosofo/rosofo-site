uniform sampler2D u_texture;
uniform int u_width;
uniform int u_height;

vec2 toIntCoord(vec2 fragCoord) {
    return int((fragCoord * float(u_width)) - 0.5f);
}

void main() {
    vec4 data = texture2D(u_texture, gl_FragCoord.xy);
    bool is_a = toIntCoord(gl_FragCoord.xy) == vec2(0, 0);
    
    vec4 new_a = float(is_a) * (data + 0.01f);
    
    gl_FragColor = float(!is_a) * texture2D(u_texture, vec2(0.0f, 0.0f)) + new_a;
}