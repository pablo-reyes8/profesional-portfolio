export const antigravityFragmentShader = `
precision highp float;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform float uAlpha;
uniform float uTime;
uniform vec2 uRingPos;

varying vec4 vSeed;
varying float vColorSeed;
varying float vScale;
varying float vVelocity;
varying vec2 vLocalPos;

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

vec2 rotate(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, s, -s, c) * v;
}

void main() {
  float angle = atan(vLocalPos.y - uRingPos.y, vLocalPos.x - uRingPos.x);
  float wobble = sin(uTime * 0.85 + vSeed.w * 6.2831) * 0.38;
  vec2 uv = gl_PointCoord.xy - 0.5;
  uv.y *= -1.0;
  uv = rotate(uv, -angle + wobble);

  float rounded = sdRoundBox(uv, vec2(0.48, 0.16), 0.17);
  float shape = smoothstep(0.08, 0.0, rounded);
  float soft = smoothstep(0.55, 0.04, length(uv * vec2(0.58, 1.78)));
  float alpha = uAlpha * shape * soft * smoothstep(0.08, 0.32, vScale);

  if (alpha < 0.01) {
    discard;
  }

  float progress = clamp(vColorSeed + sin(vSeed.x * 8.0 + uTime * 0.12) * 0.08, 0.0, 1.0);
  vec3 color = mix(uColor1, uColor2, smoothstep(0.05, 0.58, progress));
  color = mix(color, uColor3, smoothstep(0.45, 0.86, progress));
  color = mix(color, uColor4, smoothstep(0.88, 1.0, progress) * 0.55);
  color = mix(color, color * 0.72, vVelocity * 0.2);

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), clamp(alpha, 0.0, 1.0));
}
`;
