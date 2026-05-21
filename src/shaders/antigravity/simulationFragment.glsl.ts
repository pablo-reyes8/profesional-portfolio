import { simplexNoise } from "./noise.glsl";

export const simulationFragmentShader = (size: number) => `
precision highp float;

uniform sampler2D uPosition;
uniform sampler2D uPosRefs;
uniform vec2 uRingPos;
uniform float uTime;
uniform float uDeltaTime;
uniform float uRingRadius;
uniform float uRingWidth;
uniform float uRingWidth2;
uniform float uRingDisplacement;

${simplexNoise}

void main() {
  vec2 simTexCoords = gl_FragCoord.xy / vec2(${size.toFixed(1)}, ${size.toFixed(1)});
  vec4 pFrame = texture2D(uPosition, simTexCoords);

  float scale = pFrame.z;
  float velocity = pFrame.w;
  vec2 refPos = texture2D(uPosRefs, simTexCoords).xy;

  float time = uTime * 0.5;
  vec2 curentPos = refPos;
  vec2 pos = pFrame.xy;
  pos *= 0.8;

  float dist = distance(curentPos.xy, uRingPos);
  float noise0 = snoise(vec3(curentPos.xy * 0.2 + vec2(18.4924, 72.9744), time * 0.5));
  float dist1 = distance(curentPos.xy + (noise0 * 0.005), uRingPos);

  float t = smoothstep(uRingRadius - (uRingWidth * 2.0), uRingRadius, dist)
    - smoothstep(uRingRadius, uRingRadius + uRingWidth, dist1);
  float t2 = smoothstep(uRingRadius - (uRingWidth2 * 2.0), uRingRadius, dist)
    - smoothstep(uRingRadius, uRingRadius + uRingWidth2, dist1);
  float t3 = smoothstep(uRingRadius + uRingWidth2, uRingRadius, dist);

  t = pow(max(t, 0.0), 2.0);
  t2 = pow(max(t2, 0.0), 3.0);

  t += t2 * 3.0;
  t += t3 * 0.4;
  t += snoise(vec3(curentPos.xy * 30.0 + vec2(11.4924, 12.9744), time * 0.5)) * t3 * 0.5;

  float nS = snoise(vec3(curentPos.xy * 2.0 + vec2(18.4924, 72.9744), time * 0.5));
  t += pow((nS + 1.5) * 0.5, 2.0) * 0.6;

  float noise1 = snoise(vec3(curentPos.xy * 4.0 + vec2(88.494, 32.4397), time * 0.35));
  float noise2 = snoise(vec3(curentPos.xy * 4.0 + vec2(50.904, 120.947), time * 0.35));
  float noise3 = snoise(vec3(curentPos.xy * 20.0 + vec2(18.4924, 72.9744), time * 0.5));
  float noise4 = snoise(vec3(curentPos.xy * 20.0 + vec2(50.904, 120.947), time * 0.5));

  vec2 disp = vec2(noise1, noise2) * 0.03;
  disp += vec2(noise3, noise4) * 0.005;

  disp.x += sin((refPos.x * 20.0) + (time * 4.0)) * 0.02 * clamp(dist, 0.0, 1.0);
  disp.y += cos((refPos.y * 20.0) + (time * 3.0)) * 0.02 * clamp(dist, 0.0, 1.0);

  pos -= (uRingPos - (curentPos + disp)) * pow(t2, 0.75) * uRingDisplacement;

  float scaleDiff = t - scale;
  scaleDiff *= 0.2;
  scale += scaleDiff;

  vec2 finalPos = curentPos + disp + (pos * 0.25);

  velocity *= 0.5;
  velocity += scale * 0.25;

  gl_FragColor = vec4(finalPos, scale, velocity);
}
`;
