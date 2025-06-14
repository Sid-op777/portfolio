precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform float uBlobCount;
uniform float uBlobs[20]; // max 10 blobs (10 * 2 floats)

float metaball(vec2 uv, vec2 center) {
  float r = 0.15;
  float d = length(uv - center);
  return r * r / (d * d + 0.01);
}

void main() {
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) * 2.0 - 1.0;
  uv.x *= iResolution.x / iResolution.y;

  float field = 0.0;
  for (int i = 0; i < 10; i++) {
    if (i >= int(uBlobCount)) break;
    vec2 pos = vec2(uBlobs[i * 2], uBlobs[i * 2 + 1]);
    field += metaball(uv, pos);
  }

  float threshold = 1.0;
  float edge = 0.05;
  float alpha = smoothstep(threshold - edge, threshold + edge, field);

  vec3 color = mix(vec3(0.0), vec3(0.2, 0.8, 1.0), alpha);
  gl_FragColor = vec4(color, alpha);
}
