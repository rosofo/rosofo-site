uniform sampler2D u_texture;
uniform int u_width;
uniform int u_height;

vec2 toIntCoord(vec2 fragCoord) {
    vec2 intCoord = (fragCoord * vec2(float(u_width), float(u_height))) - 0.5f;
    return vec2(int(intCoord.x), int(intCoord.y));
}

void main() {
    vec4 data = texture2D(u_texture, gl_FragCoord.xy);
    bool is_a = toIntCoord(gl_FragCoord.xy) == vec2(0, 0);
    
    vec4 new_a = float(is_a) * (data + 0.01f);
    
    gl_FragColor = float(!is_a) * texture2D(u_texture, vec2(0.0f, 0.0f)) + new_a;
}