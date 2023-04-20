uniform sampler2D u_texture;
uniform int u_width;
uniform int u_height;

float blockSize = 1.0f;
int blocks = 1;

bool isBlock(vec2 coord, int index) {
    float min = blockSize * float(index);
    float max = blockSize * (float(index) + 1.0f);
    return coord.x >= min && coord.x <= max && coord.y <= 1.0f;
}

vec4 getBlock(int index) {
    float x = blockSize * float(index) + (blockSize * 0.5f);
    return texture2D(u_texture, vec2(x, blockSize * 0.5f));
}

vec4 getA() {
    return getBlock(0);
}

float getLove() {
    vec4 a = getA();
    return floor(a.x * 3.0f);
}

vec4 setBlock(int index, vec4 value) {
    return float(isBlock(gl_FragCoord.xy, index)) * value;
}

vec4 setPixel(vec4 value) {
    return float(gl_FragCoord.y > 1.0f || gl_FragCoord.x > float(blocks) * blockSize) * value;
}

void main() {
    vec4 data = texture2D(u_texture, gl_FragCoord.xy);
    gl_FragColor = data;
}