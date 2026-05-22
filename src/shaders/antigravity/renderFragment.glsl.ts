import { simplexNoise } from "./noise.glsl";

export const renderFragmentShader = `
precision highp float;

varying vec4 vSeeds;
varying vec2 vScreenPos;
varying vec2 vLocalPos;
varying float vScale;
varying float vVelocity;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uRingPos;
uniform vec2 uRez;
uniform float uAlpha;
uniform float uTime;
uniform float uColorFloor;
uniform int uColorScheme;

${simplexNoise}

#define PI 3.1415926535897932384626433832795

float sdRoundBox(in vec2 p, in vec2 b, in vec4 r) {
  r.xy = (p.x > 0.0) ? r.xy : r.zw;
  r.x = (p.y > 0.0) ? r.x : r.y;
  vec2 q = abs(p) - b + r.x;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
}

vec2 rotate(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, s, -s, c) * v;
}

void main() {
  float uBorderSize = 0.2;
  float ratio = uRez.x / uRez.y;

  float noiseAngle = snoise(vec3(vLocalPos * 10.0 + vec2(18.4924, 72.9744), uTime * 0.85));
  float noiseColor = snoise(vec3(vLocalPos * 2.0 + vec2(74.664, 91.556), uTime * 0.5));
  noiseColor = (noiseColor + 1.0) * 0.5;

  float angle = atan(vLocalPos.y - uRingPos.y, vLocalPos.x - uRingPos.x);

  vec2 uv = gl_PointCoord.xy;
  uv -= vec2(0.5);
  uv.y *= -1.0;
  uv = rotate(uv, -angle + (noiseAngle * 0.5));

  vec2 tuv = vScreenPos;
  tuv = rotate(tuv, uTime * 1.0);
  tuv.y *= 1.0 / ratio;
  tuv += 0.5;

  float h = 0.8;
  float progress = smoothstep(0.0, 0.75, pow(noiseColor, 2.0));
  progress = mix(progress, clamp(vVelocity, 0.0, 1.0), 0.58);

  vec3 col = mix(
    mix(uColor1, uColor2, progress / h),
    mix(uColor2, uColor3, (progress - h) / (1.0 - h)),
    step(h, progress)
  );
  vec3 color = col;

  float dist = sqrt(dot(uv, uv));
  float dr = 0.5;
  float t = smoothstep(dr + (uBorderSize + 0.0001), dr - uBorderSize, dist);
  t = clamp(t, 0.0, 1.0);

  float rounded = sdRoundBox(uv, vec2(0.5, 0.2), vec4(0.25));
  rounded = smoothstep(0.1, 0.0, rounded);

  float a = uAlpha * rounded * smoothstep(0.1, 0.2, vScale);

  if (a < 0.01) {
    discard;
  }

  color = clamp(color, 0.0, 1.0);
  float colorEnergy = max(clamp(vVelocity, 0.0, 1.0), uColorFloor * smoothstep(0.28, 1.0, noiseColor));
  color = mix(color, color * colorEnergy, float(uColorScheme));

  gl_FragColor = vec4(color, clamp(a, 0.0, 1.0));
}
`;
