export const renderVertexShader = `
precision highp float;

attribute vec4 seeds;

uniform sampler2D uPosition;
uniform float uTime;
uniform float uParticleScale;
uniform float uPixelRatio;
uniform int uColorScheme;

varying vec4 vSeeds;
varying float vVelocity;
varying vec2 vLocalPos;
varying vec2 vScreenPos;
varying float vScale;

void main() {
  vec4 pos = texture2D(uPosition, uv);
  vSeeds = seeds;
  vVelocity = pos.w;
  vScale = pos.z;
  vLocalPos = pos.xy;

  vec4 viewSpace = modelViewMatrix * vec4(vec3(pos.xy, 0.0), 1.0);
  gl_Position = projectionMatrix * viewSpace;
  vScreenPos = gl_Position.xy;

  float minScale = 0.25;
  minScale += float(uColorScheme) * 0.75;
  gl_PointSize = ((vScale * 7.0) * (uPixelRatio * 0.5) * uParticleScale) + (minScale * uPixelRatio);
}
`;
