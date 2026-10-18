import type { AntigravitySceneOptions } from "../../lib/antigravity/types";
import { simplexNoise } from "./noise.glsl";

/*
 * Section backgrounds. Every section keeps a quiet field of particles and gathers a share of
 * them into one slow, defined shape. Clicking pulls the nearby particles into a small shape
 * around the pointer for a moment and tints it blue; which shape depends on the section and
 * on how crowded the clicked spot is (AmbientParticleBackground picks uClickVariant).
 *
 *   section      background shape
 *   ----------   -------------------------------------------------------------
 *   About        differential orbit with spiral arms
 *   Projects     four flowing ribbons drifting right
 *   Experience   a double helix with rungs that swells at each role
 *   Education    a breathing normal distribution
 *   Contact      dashed elliptical orbits around the form
 *
 * Units: the canvas is 2 * HALF_H tall in simulation units. Positive y points down the screen
 * (the mesh is mirrored). uUnitsPerPx converts CSS pixels to units, so sizes hold across
 * sections of very different heights.
 */
export const ambientSimulationFragmentShader = (
  size: number,
  layout: NonNullable<AntigravitySceneOptions["ambientLayout"]> = "field"
) => {
  const isProjects = layout === "project-ribbons" || layout === "project-tall-ribbons";
  const isContact = layout === "contact-field";
  const isExperience = layout === "experience-stream";
  const isFormation = layout === "formation-bands";
  const isAbout = !isProjects && !isContact && !isExperience && !isFormation;

  const shape = isProjects
    ? `
  // Four ribbons drifting slowly to the right; each wraps off-screen.
  float onShape = step(h1, 0.35);
  float lane = floor(h2 * 4.0);
  float along = fract(h3 + uTime * 0.012 * (0.8 + lane * 0.15)) * 2.6 - 1.3;
  float crest = -0.56 + lane * 0.37 + 0.14 * sin(along * 2.4 + lane * 1.9 + uTime * 0.12);
  float thickness = (h4 - 0.5) * 0.06 * (1.0 + 0.6 * sin(along * 3.0 + lane));
  vec2 shapePos = frac2units(vec2(along, crest + thickness));
  float shapeFade = 1.05 * smoothstep(1.3, 1.12, abs(along));
`
    : isExperience
    ? `
  // A double helix down the gutter between dates and roles. It swells where each role sits
  // (the anchors), so its shape follows the timeline and moves when a role expands.
  float onShape = step(h1, 0.14);

  float gutter = uAspect > 1.1 ? -0.19 : 0.82;
  float gutterX = frac2units(vec2(gutter, 0.0)).x;

  float strand = step(0.5, h2) * 2.0 - 1.0;
  float down = fract(h3 + uTime * 0.01) * 2.4 - 1.2;
  float isRung = step(h4, 0.3);
  float rungDown = (floor(down * 11.0) + 0.5) / 11.0;
  float spine = mix(down, rungDown, isRung);
  float spineY = spine * HALF_H;

  // Swell near each role: a smooth bump per anchor, wider than the role's date line.
  float swell = 0.0;
  for (int index = 0; index < 8; index++) {
    if (float(index) < uAnchorCount) {
      float gap = (spineY - uAnchors[index].y) / (70.0 * uUnitsPerPx);
      swell += exp(-gap * gap);
    }
  }
  swell = min(swell, 1.0);

  float amplitude = (30.0 + swell * 30.0) * uUnitsPerPx;
  float twist = sin(spine * 7.0 + uTime * 0.18);
  float across = mix(strand, h5 * 2.0 - 1.0, isRung);
  vec2 shapePos = vec2(gutterX + across * amplitude * twist + (h6 - 0.5) * 6.0 * uUnitsPerPx, spineY);

  // Strands fade where they pass behind each other; rungs and swells read a little stronger.
  float depthFade = 0.7 + 0.45 * strand * cos(down * 7.0 + uTime * 0.18);
  float shapeFade = mix(depthFade, 0.75 + swell * 0.35, isRung) * (1.0 + swell * 0.2) * smoothstep(1.2, 1.05, abs(down));
`
    : isFormation
    ? `
  // Samples settled into a normal distribution along the bottom; it breathes slowly.
  float onShape = step(h1, 0.14);
  float g = clamp(sqrt(-2.0 * log(max(h2, 0.0001))) * cos(6.2831853 * h3), -3.2, 3.2);
  float pdf = exp(-0.5 * g * g);
  float halfW = HALF_H * uAspect;
  float sigma = min(halfW * 0.22, 140.0 * uUnitsPerPx);
  float tall = 210.0 * uUnitsPerPx * (0.94 + 0.06 * sin(uTime * 0.15));
  vec2 shapePos = vec2(halfW * 0.15 + g * sigma, HALF_H - 18.0 * uUnitsPerPx - h4 * pdf * tall);
  float shapeFade = 1.1;
`
    : isContact
    ? `
  // Dashed elliptical orbits around the form, alternate rings turning opposite ways.
  float onShape = step(h1, 0.3);
  float ring = floor(h2 * 5.0);
  float direction = mod(ring, 2.0) * 2.0 - 1.0;
  float radius = (120.0 + ring * 70.0) * uUnitsPerPx;
  float angle = h3 * 6.2831853 + uTime * 0.012 * direction * (1.0 - ring * 0.1);
  vec2 center = frac2units(vec2(uAspect > 1.1 ? 0.38 : 0.0, 0.05));
  vec2 shapePos = center + vec2(cos(angle) * 1.3, sin(angle)) * radius + (h4 - 0.5) * 6.0 * uUnitsPerPx;
  float shapeFade = 1.05 * smoothstep(-0.35, 0.35, sin(angle * 3.0 + ring * 1.3));
`
    : `
  // Differential orbit: inner rings turn faster, shearing the field into slow spiral arms.
  float onShape = 1.0;
  vec2 orbitCenter = vec2(0.13, -0.03);
  vec2 offset = refPos - orbitCenter;
  float radius = length(offset);
  float angle = uTime * 0.005 / max(radius, 0.05);
  vec2 shapePos = orbitCenter + rotate2(offset, angle) * vec2(1.0, 0.9);
  float band = sin(radius * 70.0 - atan(offset.y, offset.x) * 2.0 + uTime * 0.03);
  float shapeFade = 0.18 + 1.15 * smoothstep(-0.1, 0.95, band);
`;

  // Click shapes (uClickVariant): 0 rings, 1 card outline, 2 bell curve, 3 spark, 4 atom,
  // 5 regression scatter, 6 neural network, 7 histogram.
  const clickShape = `
  vec2 shapeOffset = vec2(0.0);
  float variant = uClickVariant;
  float s = shapeSize;

  if (variant < 0.5) {
    float ringIndex = floor(h5 * 3.0);
    float spin = aroundClick + uTime * 0.25 * (ringIndex - 1.0);
    shapeOffset = vec2(cos(spin), sin(spin)) * s * (0.45 + ringIndex * 0.3);
  } else if (variant < 1.5) {
    float layer = step(0.5, h5);
    float squircle = 1.0 / pow(pow(abs(cos(aroundClick)), 4.0) + pow(abs(sin(aroundClick)), 4.0), 0.25);
    shapeOffset = vec2(cos(aroundClick), sin(aroundClick)) * squircle * s * mix(1.0, 0.58, layer);
  } else if (variant < 2.5) {
    float onAxis = step(0.62, h5);
    float x = (aroundClick / 3.14159265) * s * 1.4;
    float curve = s * 0.45 - s * 1.1 * exp(-(x * x) / (2.0 * pow(s * 0.38, 2.0)));
    shapeOffset = mix(vec2(x, curve), vec2((h6 * 2.0 - 1.0) * s * 1.5, s * 0.5), onAxis);
  } else if (variant < 3.5) {
    float inner = step(0.65, h5);
    float spark = 0.62 + 0.38 * cos(5.0 * (aroundClick + uTime * 0.15));
    shapeOffset = vec2(cos(aroundClick), sin(aroundClick)) * s * spark * mix(1.0, 0.55, inner);
  } else if (variant < 4.5) {
    // Atom: three tilted orbits and a small nucleus.
    float orbit = floor(h5 * 3.0);
    float t = aroundClick + uTime * 0.6;
    vec2 local = vec2(cos(t) * s * 1.15, sin(t) * s * 0.36);
    shapeOffset = rotate2(local, orbit * 1.0471976);
    shapeOffset = mix(shapeOffset, vec2(cos(aroundClick), sin(aroundClick)) * s * 0.14 * sqrt(h4), step(h6, 0.1));
  } else if (variant < 5.5) {
    // Regression: a fitted line through a cloud of observations.
    float x = (h6 * 2.0 - 1.0) * s * 1.35;
    float noise = sqrt(-2.0 * log(max(h4, 0.0001))) * cos(6.2831853 * h3) * s * 0.2;
    shapeOffset = vec2(x, -0.55 * x + noise * step(0.35, h5));
  } else if (variant < 6.5) {
    // Neural network: layers of 3, 4 and 2 nodes and the edges between them.
    float node = floor(h6 * 9.0);
    float layerOf = node < 3.0 ? 0.0 : node < 7.0 ? 1.0 : 2.0;
    float rowOf = node < 3.0 ? node : node < 7.0 ? node - 3.0 : node - 7.0;
    float rowsIn = layerOf < 0.5 ? 3.0 : layerOf < 1.5 ? 4.0 : 2.0;
    vec2 nodePoint = vec2((layerOf - 1.0) * s * 1.1, (rowOf - (rowsIn - 1.0) * 0.5) * s * 0.55);
    vec2 onNode = nodePoint + vec2(cos(aroundClick), sin(aroundClick)) * s * 0.13;

    float edge = floor(h4 * 20.0);
    float firstHalf = step(edge, 11.5);
    float fromRow = firstHalf > 0.5 ? floor(edge / 4.0) : floor((edge - 12.0) / 2.0);
    float toRow = firstHalf > 0.5 ? mod(edge, 4.0) : mod(edge - 12.0, 2.0);
    float fromRows = firstHalf > 0.5 ? 3.0 : 4.0;
    float toRows = firstHalf > 0.5 ? 4.0 : 2.0;
    float fromLayer = firstHalf > 0.5 ? 0.0 : 1.0;
    vec2 edgeFrom = vec2((fromLayer - 1.0) * s * 1.1, (fromRow - (fromRows - 1.0) * 0.5) * s * 0.55);
    vec2 edgeTo = vec2(fromLayer * s * 1.1, (toRow - (toRows - 1.0) * 0.5) * s * 0.55);
    vec2 onEdge = mix(edgeFrom, edgeTo, h3);
    shapeOffset = mix(onEdge, onNode, step(h5, 0.5));
  } else {
    // Histogram: five filled bars on a shared baseline.
    float bar = floor(h6 * 5.0);
    float barHeight = bar < 0.5 ? 0.4 : bar < 1.5 ? 0.85 : bar < 2.5 ? 1.2 : bar < 3.5 ? 0.75 : 0.35;
    float barX = (bar - 2.0) * s * 0.42 + (h4 - 0.5) * s * 0.3;
    shapeOffset = vec2(barX, s * 0.65 - h3 * barHeight * s);
  }

  vec2 clickPos = uClick + shapeOffset;
`;

  return `
precision highp float;

uniform sampler2D uPosition;
uniform sampler2D uPosRefs;
uniform float uTime;
uniform float uDeltaTime;
uniform float uMotionStrength;
uniform float uAspect;
uniform float uUnitsPerPx;
uniform vec2 uClick;
uniform float uClickAmount;
uniform float uClickVariant;
uniform float uClickScale;
uniform vec3 uAnchors[8];
uniform float uAnchorCount;

#define HALF_H 0.22566

${simplexNoise}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec2 rotate2(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

// Fractions of the canvas (-1..1 on each axis) to simulation units.
vec2 frac2units(vec2 f) {
  return vec2(f.x * HALF_H * uAspect, f.y * HALF_H);
}

void main() {
  vec2 simTexCoords = gl_FragCoord.xy / vec2(${size.toFixed(1)}, ${size.toFixed(1)});
  vec4 pFrame = texture2D(uPosition, simTexCoords);
  vec2 refPos = texture2D(uPosRefs, simTexCoords).xy;

  vec2 pos = pFrame.xy;
  float scale = pFrame.z;
  // The velocity channel also carries the click level (level * 2 + velocity).
  float velocity = pFrame.w - floor(pFrame.w / 2.0) * 2.0;
  float snap = 0.0;
  float slowTime = uTime * 0.012;

  float h1 = hash(refPos * 1.7 + 0.3);
  float h2 = max(hash(refPos * 3.1 + 2.0), 0.0001);
  float h3 = hash(refPos * 5.3 + 4.0);
  float h4 = hash(refPos * 7.7 + 6.0);
  float h5 = hash(refPos * 9.1 + 8.0);
  float h6 = hash(refPos * 11.3 + 1.0);

  // The quiet field: particles barely drift around their home.
  vec2 drift = vec2(
    snoise(vec3(refPos * 1.6 + vec2(10.0, 20.0), slowTime)),
    snoise(vec3(refPos * 1.6 + vec2(80.0, 30.0), slowTime))
  ) * 0.009;
  vec2 fieldPos = refPos + drift * uMotionStrength;

${shape}
  vec2 base = mix(fieldPos, shapePos, onShape);
  float fade = mix(${isAbout ? "1.0" : "0.5"}, shapeFade, onShape);

  // Click: particles near the pointer gather into the section's shape, then let go.
  vec2 toPointer = base - uClick;
  float aroundClick = atan(toPointer.y, toPointer.x);
  float shapeSize = 78.0 * uUnitsPerPx * uClickScale;
  float reach = 250.0 * uUnitsPerPx * uClickScale;
  float influence = (1.0 - smoothstep(reach * 0.55, reach, length(toPointer))) * uClickAmount;
${clickShape}
  base = mix(base, clickPos, influence);
  fade = mix(fade, 1.55, influence);

  vec2 diff = base - pos;

  // Wrapping ribbons and helix strands jump across the canvas: follow them instantly
  // instead of streaking across the screen.
  if (length(diff) > 0.3 || snap > 0.5) {
    pos = base;
    diff = vec2(0.0);
    velocity = 0.0;
  } else {
    pos += diff * 0.045;
  }

  float grain = snoise(vec3(refPos * 37.0 + vec2(5.2, 8.7), 4.0)) * 0.5 + 0.5;
  float depth = mix(0.86, 1.16, grain);
  float twinkle = sin(uTime * 0.6 + grain * 6.2831853);

  float targetScale = 0.62 * depth;
  targetScale *= 1.0 + twinkle * 0.08 * grain;
  targetScale *= fade;
  scale += (targetScale - scale) * 0.05;

  velocity *= 0.6;
  velocity += length(diff) * 9.0;
  velocity += (twinkle * 0.5 + 0.5) * 0.03 * grain;

  float clickLevel = floor(clamp(influence, 0.0, 1.0) * 20.0 + 0.5);
  gl_FragColor = vec4(pos, scale, min(velocity, 1.9) + clickLevel * 2.0);
}
`;
};
