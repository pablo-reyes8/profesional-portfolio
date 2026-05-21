export const antigravityVertexShader = `
precision highp float;

attribute vec3 aBasePosition;
attribute vec4 aSeed;
attribute float aColorSeed;

uniform float uTime;
uniform vec2 uRingPos;
uniform float uRingRadius;
uniform float uRingWidth;
uniform float uRingWidth2;
uniform float uRingDisplacement;
uniform float uParticleScale;
uniform float uPixelRatio;
uniform vec2 uSceneScale;
uniform float uReducedMotion;

varying vec4 vSeed;
varying float vColorSeed;
varying float vScale;
varying float vVelocity;
varying vec2 vLocalPos;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float centeredNoise(vec2 p) {
  return noise(p) * 2.0 - 1.0;
}

void main() {
  vec2 basePos = aBasePosition.xy;
  float time = uTime * (1.0 - uReducedMotion);
  float radial = length(basePos);
  float dist = distance(basePos, uRingPos);

  float ring = smoothstep(uRingRadius - (uRingWidth * 2.0), uRingRadius, dist)
    - smoothstep(uRingRadius, uRingRadius + uRingWidth, dist);
  float ringCore = smoothstep(uRingRadius - (uRingWidth2 * 2.0), uRingRadius, dist)
    - smoothstep(uRingRadius, uRingRadius + uRingWidth2, dist);
  float innerWell = smoothstep(uRingRadius + uRingWidth2, uRingRadius, dist);

  ring = pow(max(ring, 0.0), 2.0);
  ringCore = pow(max(ringCore, 0.0), 3.0);

  float midX = centeredNoise(basePos * 4.0 + vec2(88.494, 32.4397) + time * 0.16);
  float midY = centeredNoise(basePos * 4.0 + vec2(50.904, 120.947) - time * 0.13);
  float fineX = centeredNoise(basePos * 18.0 + vec2(18.4924, 72.9744) + time * 0.32);
  float fineY = centeredNoise(basePos * 18.0 + vec2(50.904, 120.947) - time * 0.28);
  float slow = centeredNoise(basePos * 1.3 + vec2(74.664, 91.556) + time * 0.06);

  vec2 disp = vec2(midX, midY) * 0.034;
  disp += vec2(fineX, fineY) * 0.007;
  disp += normalize(basePos + 0.0001) * slow * 0.018;
  disp.x += sin((basePos.x * 18.0) + (time * 3.7) + aSeed.x * 6.2831) * 0.021 * clamp(radial, 0.0, 1.0);
  disp.y += cos((basePos.y * 18.0) + (time * 2.9) + aSeed.y * 6.2831) * 0.021 * clamp(radial, 0.0, 1.0);

  float ringEnergy = ring + ringCore * 3.25 + innerWell * 0.22;
  vec2 pos = basePos;
  pos -= (uRingPos - (basePos + disp)) * pow(max(ringCore, 0.0), 0.75) * uRingDisplacement;
  pos += normalize((basePos + disp) - uRingPos + 0.0001) * ring * uRingDisplacement * 0.13;

  vec2 finalPos = basePos + disp + pos * 0.25;
  float textFade = 1.0 - smoothstep(0.58, 0.02, length(vec2(finalPos.x * 1.55, (finalPos.y - 0.04) * 2.15)));

  vSeed = aSeed;
  vColorSeed = aColorSeed;
  vVelocity = clamp(ringEnergy, 0.0, 1.0);
  vScale = clamp(0.34 + ringEnergy * 1.65 + radial * 0.32 + aSeed.z * 0.22, 0.2, 2.5);
  vScale *= mix(0.34, 1.0, textFade);
  vLocalPos = finalPos;

  vec4 viewSpace = modelViewMatrix * vec4(finalPos * uSceneScale, 0.0, 1.0);
  gl_Position = projectionMatrix * viewSpace;
  gl_PointSize = ((vScale * 7.4) * (uPixelRatio * 0.5) * uParticleScale) + (0.85 * uPixelRatio);
}
`;
