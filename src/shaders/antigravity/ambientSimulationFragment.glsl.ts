import { simplexNoise } from "./noise.glsl";

export const ambientSimulationFragmentShader = (size: number) => `
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
  float time = uTime * 0.055;

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

  vec2 targetPos = refPos + (flow * 0.043 + fineFlow * 0.009 + globalDrift * 0.72) * uMotionStrength;
  vec2 diff = targetPos - pos;
  pos += diff * 0.026;

  float energy = length(flow + fineFlow * 0.45);
  float targetScale = 0.32 + smoothstep(0.25, 1.25, energy) * 0.7;
  targetScale += snoise(vec3(refPos * 2.0 + vec2(74.664, 91.556), time * 0.55)) * 0.055;
  scale += (targetScale - scale) * 0.02;

  velocity *= 0.58;
  velocity += length(diff) * 7.0;

  gl_FragColor = vec4(pos, scale, velocity);
}
`;
