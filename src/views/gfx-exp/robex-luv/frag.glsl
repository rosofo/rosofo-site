uniform sampler2D u_texture;
uniform int u_width;
uniform int u_height;

float blockSize = 1.0f;

bool isBlock(vec2 coord, int index) {
    float min = blockSize * float(index);
    float max = blockSize * (float(index) + 1.0f);
    return coord.x >= min && coord.x <= max && coord.y <= 1.0f;
}

void main() {
    vec4 data = texture2D(u_texture, gl_FragCoord.xy);
    bool is_a = isBlock(gl_FragCoord.xy, 0);
    
    vec4 new_a = float(is_a) * (data + 0.01f);
    vec4 curr_a = texture2D(u_texture, vec2(0.0f, 0.0f));
    
    float love = curr_a.x * 100.0f;
    vec4 new_rest = float(!is_a) * vec4(curr_a.x, 0.0f, 0.0f, 1.0f);

    gl_FragColor = new_a + new_rest;
}