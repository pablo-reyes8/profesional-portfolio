import type { AntigravitySceneOptions } from "../../lib/antigravity/types";
import { simplexNoise } from "./noise.glsl";

export const ambientSimulationFragmentShader = (
  size: number,
  layout: NonNullable<AntigravitySceneOptions["ambientLayout"]> = "field"
) => {
  const isProjectRibbons = layout === "project-ribbons" || layout === "project-tall-ribbons";
  const isContact = layout === "contact-field";
  const isExperience = layout === "experience-stream";
  const isFormation = layout === "formation-bands";
  const timeScale = isContact ? "0.044" : isFormation ? "0.045" : isExperience ? "0.047" : isProjectRibbons ? "0.052" : "0.055";
  const flowScale = isContact ? "0.052" : isFormation ? "0.051" : isExperience ? "0.049" : isProjectRibbons ? "0.058" : "0.043";
  const fineScale = isContact ? "0.012" : isFormation ? "0.013" : isExperience ? "0.014" : isProjectRibbons ? "0.017" : "0.009";
  const driftScale = isContact ? "0.95" : isFormation ? "0.86" : isExperience ? "0.88" : isProjectRibbons ? "0.82" : "0.72";
  const settleRate = isContact ? "0.019" : isFormation ? "0.02" : isExperience ? "0.021" : isProjectRibbons ? "0.023" : "0.026";
  const scaleNoise = isContact ? "0.066" : isFormation ? "0.074" : isExperience ? "0.07" : isProjectRibbons ? "0.078" : "0.055";
  const layoutFlow = isContact
    ? `
  vec2 upperCurrent = refPos - vec2(-0.12, 0.34);
  vec2 lowerCurrent = refPos - vec2(0.26, -0.38);
  vec2 verticalCurlA = vec2(upperCurrent.y * 0.42, -upperCurrent.x) * exp(-dot(upperCurrent, upperCurrent) * 2.6);
  vec2 verticalCurlB = vec2(-lowerCurrent.y * 0.36, lowerCurrent.x) * exp(-dot(lowerCurrent, lowerCurrent) * 2.1);
  float softColumn = sin(refPos.y * 9.0 + time * 1.2) * 0.015;
  float sideBreath = cos(refPos.x * 5.6 - time * 0.9) * 0.017;
  vec2 asymmetricLife = verticalCurlA * 0.048 + verticalCurlB * 0.042 + vec2(softColumn, sideBreath);
`
    : isFormation
    ? `
  vec2 bandA = refPos - vec2(-0.34, 0.18);
  vec2 bandB = refPos - vec2(0.38, -0.2);
  vec2 longArcA = vec2(-bandA.y * 0.34, bandA.x) * exp(-dot(bandA, bandA) * 2.0);
  vec2 longArcB = vec2(bandB.y * 0.3, -bandB.x) * exp(-dot(bandB, bandB) * 2.45);
  float horizontalBand = sin(refPos.x * 10.2 + time * 1.05) * 0.018;
  float studyPulse = cos((refPos.x + refPos.y * 1.7) * 5.5 - time * 0.9) * 0.014;
  vec2 asymmetricLife = longArcA * 0.042 + longArcB * 0.036 + vec2(studyPulse, horizontalBand);
`
    : isExperience
    ? `
  vec2 timelinePull = refPos - vec2(-0.08, 0.02);
  vec2 upperArc = refPos - vec2(-0.38, 0.32);
  vec2 lowerArc = refPos - vec2(0.34, -0.28);
  vec2 arcA = vec2(-upperArc.y * 0.44, upperArc.x) * exp(-dot(upperArc, upperArc) * 2.4);
  vec2 arcB = vec2(lowerArc.y * 0.36, -lowerArc.x) * exp(-dot(lowerArc, lowerArc) * 2.2);
  float careerWave = sin((refPos.x * 4.4 + refPos.y * 7.2) + time * 1.15) * 0.016;
  float verticalBreath = cos(timelinePull.y * 5.8 - time * 0.82) * 0.015;
  vec2 asymmetricLife = arcA * 0.046 + arcB * 0.04 + vec2(careerWave, verticalBreath);
`
    : isProjectRibbons
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

${layoutFlow}
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
