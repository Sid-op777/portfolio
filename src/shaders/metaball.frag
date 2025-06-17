#define MAX_BLOBS 500
#define BLOB_RADIUS 0.1
#define THRESHOLD 1.0
#define EDGE 0.01
#define MERGE_FACTOR 10.0 //lower will have affinity to merge
#define INFLUENCE 0.05

precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform float uBlobCount;
uniform float uBlobs[MAX_BLOBS*2];

float metaball(vec2 uv, vec2 center) {
  float d = length(uv - center);
  if(d>INFLUENCE) return 0.0;
  return BLOB_RADIUS * BLOB_RADIUS / (MERGE_FACTOR * d * d + 0.01);
}

void main() {
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) * 2.0 - 1.0;
  //uv.x *= iResolution.x / iResolution.y;

  float field = 0.0;
  for (int i = 0; i < int(uBlobCount); i++) {
    if (i >= MAX_BLOBS) break;
    vec2 pos = vec2(uBlobs[i * 2], uBlobs[i * 2 + 1]);
    field += metaball(uv, pos);
  }

  float alpha = smoothstep(THRESHOLD - EDGE, THRESHOLD + EDGE, field);
  /*
  smoothstep(min, max, value): This is a fantastic function.
  If field is below THRESHOLD - EDGE, it returns 0.0.
  If field is above THRESHOLD + EDGE, it returns 1.0.
  If field is between the two, it returns a smoothly interpolated value from 0.0 to 1.0.
  This is what creates the soft, anti-aliased edge. The EDGE constant controls how wide this transition is. The result is stored in alpha.
  */

  vec3 color = mix(vec3(1.0), vec3(0.0), alpha); 
  gl_FragColor = vec4(color, alpha);
}
