import type { AntigravitySceneOptions } from "../../lib/antigravity/types";
import { simplexNoise } from "./noise.glsl";

export const ambientSimulationFragmentShader = (
  size: number,
  layout: NonNullable<AntigravitySceneOptions["ambientLayout"]> = "field"
) => {
  const isProjectRibbons = layout === "project-ribbons" || layout === "project-tall-ribbons";
  const timeScale = isProjectRibbons ? "0.052" : "0.055";
  const flowScale = isProjectRibbons ? "0.058" : "0.043";
  const fineScale = isProjectRibbons ? "0.017" : "0.009";
  const driftScale = isProjectRibbons ? "0.82" : "0.72";
  const settleRate = isProjectRibbons ? "0.023" : "0.026";
  const scaleNoise = isProjectRibbons ? "0.078" : "0.055";
  const projectFlow = isProjectRibbons
    ? `
  vec2 offCenterA = refPos - vec2(-0.28, 0.16);
  vec2 offCenterB = refPos - vec2(0.34, -0.22);
  vec2 vortexA = vec2(-offCenterA.y, offCenterA.x) * exp(-dot(offCenterA, offCenterA) * 2.2);
  vec2 vortexB = vec2(offCenterB.y, -offCenterB.x) * exp(-dot(offCenterB, offCenterB) * 2.8);
  float ribbonWave = sin(refPos.x * 8.0 + refPos.y * 3.4 + time * 1.4) * 0.018;
  float diagonalWave = cos((refPos.x - refPos.y) * 5.2 - time * 1.1) * 0.014;
  vec2 asymmetricLife = vortexA * 0.052 + vortexB * 0.038 + vec2(ribbonWave, diagonalWave);
`
    : "  vec2 asymmetricLife = vec2(0.0);";

  return `
precision highp float;

uniform sampler2D uPosition;
uniform sampler2D uPosRefs;
uniform float uTime;
uniform float uDeltaTime;
uniform float uMotionStrength;

${simplexNoise}

void main() {
  vec2 simTexCoords = gl_FragCoord.xy / vec2(${size.toFixed(1)}, ${size.toFixed(1)});
  vec4 pFrame = texture2D(uPosition, simTexCoords);
  vec2 refPos = texture2D(uPosRefs, simTexCoords).xy;

  vec2 pos = pFrame.xy;
  float scale = pFrame.z;
  float velocity = pFrame.w;
  float time = uTime * ${timeScale};

  vec2 flow = vec2(
    snoise(vec3(refPos * 1.35 + vec2(10.0, 20.0), time)),
    snoise(vec3(refPos * 1.35 + vec2(80.0, 30.0), time))
  );

  vec2 fineFlow = vec2(
    snoise(vec3(refPos * 5.0 + vec2(30.0, 11.0), time * 1.05)),
    snoise(vec3(refPos * 5.0 + vec2(12.0, 90.0), time * 1.05))
  );

  vec2 globalDrift = vec2(
    sin(time * 0.7 + refPos.y * 2.0),
    cos(time * 0.55 + refPos.x * 2.0)
  ) * 0.018;

${projectFlow}
  vec2 targetPos = refPos + (flow * ${flowScale} + fineFlow * ${fineScale} + globalDrift * ${driftScale} + asymmetricLife) * uMotionStrength;
  vec2 diff = targetPos - pos;
  pos += diff * ${settleRate};

  float energy = length(flow + fineFlow * 0.45);
  float targetScale = 0.32 + smoothstep(0.25, 1.25, energy) * 0.7;
  targetScale += snoise(vec3(refPos * 2.0 + vec2(74.664, 91.556), time * 0.55)) * ${scaleNoise};
  scale += (targetScale - scale) * 0.02;

  velocity *= 0.58;
  velocity += length(diff) * 7.0;

  gl_FragColor = vec4(pos, scale, velocity);
}
`;
};
