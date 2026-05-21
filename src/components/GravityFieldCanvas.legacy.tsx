import { useEffect, useRef } from "react";
 
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseAngle: number;
  baseRadius: number;
  orbitSpeed: number;
  // Angular noise (2 freq) → orbitas no circulares, orgánicas
  af1: number; aa1: number; ap1: number;
  af2: number; aa2: number; ap2: number;
  // Radial noise (2 freq) → respiración irregular
  rf1: number; ra1: number; rp1: number;
  rf2: number; ra2: number; rp2: number;
  phase: number;
  length: number;
  width: number;
  alpha: number;
  color: string;
  angle: number;
  layer: number;
  mouseScale: number;
  damping: number;
}
 
interface MouseState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  active: boolean;
}
 
interface FieldCenter {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}
 
interface CanvasSize {
  width: number;
  height: number;
  dpr: number;
}
 
const COLORS = [
  "#2563eb", "#2563eb",
  "#4f46e5", "#7c3aed", "#7c3aed",
  "#db2777", "#ef4444",
  "#f97316", "#facc15",
  "#22c55e",
];
 
// Tres capas: lejos / medio / cerca
const LAYER_CONFIGS = [
  { share: 0.30, speedMult: 0.55, alphaScale: 0.52, sizeScale: 0.78, mouseScale: 0.55, radiusScale: 1.12, damping: 0.90 },
  { share: 0.44, speedMult: 1.00, alphaScale: 0.76, sizeScale: 1.00, mouseScale: 0.80, radiusScale: 1.00, damping: 0.87 },
  { share: 0.26, speedMult: 1.60, alphaScale: 0.98, sizeScale: 1.26, mouseScale: 1.00, radiusScale: 0.90, damping: 0.84 },
];
 
const TWO_PI = Math.PI * 2;
const VERTICAL_SCALE = 0.66;
 
function rnd(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
 
function getParticleCount(width: number): number {
  if (width < 640) return Math.round(rnd(280, 380));
  if (width < 1100) return Math.round(rnd(560, 740));
  return Math.round(rnd(700, 940));
}
 
function sampleRadius(maxR: number, angle: number, phase: number): number {
  const u = Math.random();
  let base: number;
  if (u < 0.18)      base = rnd(0.06, 0.32);  // núcleo interior
  else if (u < 0.60) base = rnd(0.38, 0.76);  // anillo principal
  else               base = rnd(0.78, 1.20);   // anillo exterior + bordes
 
  // Ruido angular grande → la distribución no es circular
  const noise =
    Math.sin(angle * 2 + phase) * 42 +
    Math.sin(angle * 5 + phase * 1.7) * 22 +
    Math.cos(angle * 9 + phase * 0.9) * 11;
 
  return Math.max(24, base * maxR + noise);
}
 
function createParticles(size: CanvasSize): Particle[] {
  const { width, height } = size;
  const total = getParticleCount(width);
  const maxR = Math.max(width, height) * 0.60;
  const cx = width * 0.5;
  const cy = height * 0.5;
  const particles: Particle[] = [];
 
  LAYER_CONFIGS.forEach((cfg, li) => {
    const count =
      li === LAYER_CONFIGS.length - 1
        ? total - particles.length
        : Math.floor(total * cfg.share);
 
    for (let i = 0; i < count; i++) {
      const phase = rnd(0, TWO_PI);
      const baseAngle = rnd(0, TWO_PI);
      const baseRadius = sampleRadius(maxR * cfg.radiusScale, baseAngle, phase);
      const depth = Math.min(1, baseRadius / maxR);
      const px = cx + Math.cos(baseAngle) * baseRadius;
      const py = cy + Math.sin(baseAngle) * baseRadius * VERTICAL_SCALE;
      const inText =
        px > width * 0.20 && px < width * 0.80 &&
        py > height * 0.20 && py < height * 0.80;
      const alpha = rnd(0.44, 0.94) * cfg.alphaScale * (inText ? 0.26 : 1.0);
      const dir = Math.random() > 0.5 ? 1 : -1;
 
      particles.push({
        x: px,
        y: py,
        vx: 0,
        vy: 0,
        baseAngle,
        baseRadius,
        orbitSpeed: rnd(0.40, 1.45) * cfg.speedMult * dir,
        // Angular noise: frecuencia baja (lenta, gran amplitud) + alta (rápida, suave)
        af1: rnd(0.18, 0.80),
        aa1: rnd(0.45, 2.20) * (0.28 + depth * 0.9),
        ap1: rnd(0, TWO_PI),
        af2: rnd(1.40, 3.80),
        aa2: rnd(0.08, 0.55),
        ap2: rnd(0, TWO_PI),
        // Radial noise: respiración lenta + temblor rápido
        rf1: rnd(0.40, 1.60),
        ra1: rnd(18, 62) * (0.45 + depth * 0.85),
        rp1: rnd(0, TWO_PI),
        rf2: rnd(2.20, 5.00),
        ra2: rnd(5, 22),
        rp2: rnd(0, TWO_PI),
        phase,
        length: rnd(3.4, 9.8) * cfg.sizeScale,
        width: rnd(1.0, 2.7) * cfg.sizeScale,
        alpha,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        angle: baseAngle + Math.PI / 2,
        layer: li,
        mouseScale: cfg.mouseScale,
        damping: cfg.damping,
      });
    }
  });
 
  return particles;
}
 
function setupCanvas(canvas: HTMLCanvasElement): CanvasSize {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, rect.width || window.innerWidth);
  const height = Math.max(480, rect.height || window.innerHeight);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height, dpr };
}
 
function drawParticle(
  ctx: CanvasRenderingContext2D,
  p: Particle,
  alpha: number
): void {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = p.color;
  ctx.lineWidth = p.width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-p.length / 2, 0);
  ctx.lineTo(p.length / 2, 0);
  ctx.stroke();
  ctx.restore();
}
 
function renderFrame(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  mouse: MouseState,
  center: FieldCenter,
  size: CanvasSize,
  timestamp: number,
  reducedMotion: boolean
): void {
  const { width, height } = size;
  const time = timestamp * 0.001;
 
  ctx.clearRect(0, 0, width, height);
 
  // --- Suavizado del mouse + velocidad ---
  const prevMX = mouse.x;
  const prevMY = mouse.y;
  mouse.x += (mouse.targetX - mouse.x) * 0.16;
  mouse.y += (mouse.targetY - mouse.y) * 0.16;
  mouse.vx = mouse.x - prevMX;
  mouse.vy = mouse.y - prevMY;
 
  // --- Centro del campo: sigue el mouse suavemente + deriva ambiental ---
  const baseCX = width * 0.5 + Math.sin(time * 0.11) * width * 0.024;
  const baseCY = height * 0.5 + Math.cos(time * 0.09) * height * 0.022;
  center.targetX = mouse.active
    ? baseCX + (mouse.x - width * 0.5) * 0.13
    : baseCX;
  center.targetY = mouse.active
    ? baseCY + (mouse.y - height * 0.5) * 0.10
    : baseCY;
  center.x += (center.targetX - center.x) * 0.040;
  center.y += (center.targetY - center.y) * 0.040;
 
  const isMobile = width < 700;
  const influenceRadius = isMobile ? 320 : 500;
  const repelStrength = isMobile ? 9.5 : 14.0; // aplicado a velocidad
  const textRx = Math.min(width * 0.36, 540);
  const textRy = Math.min(height * 0.24, 200);
 
  for (const p of particles) {
    // ===== Modo reducido: render estático =====
    if (reducedMotion) {
      const ex = (p.x - width * 0.5) / textRx;
      const ey = (p.y - height * 0.52) / textRy;
      const tf = ex * ex + ey * ey < 1 ? 0.22 : 1;
      drawParticle(ctx, p, Math.min(0.9, p.alpha * tf));
      continue;
    }
 
    // ===== Órbita orgánica con ruido multi-frecuencia =====
    // Angular: base + rotación + perturbación de 2 frecuencias → shape de "slime"
    const angNoise =
      Math.sin(time * p.af1 + p.ap1) * p.aa1 +
      Math.cos(time * p.af2 + p.ap2) * p.aa2;
    const orbitAngle = p.baseAngle + time * p.orbitSpeed + angNoise;
 
    // Radial: respiración lenta + temblor rápido
    const radNoise =
      Math.sin(time * p.rf1 + p.rp1) * p.ra1 +
      Math.cos(time * p.rf2 + p.rp2) * p.ra2;
    const radius = Math.max(18, p.baseRadius + radNoise);
 
    // Posición objetivo (reposo en órbita)
    const targetX = center.x + Math.cos(orbitAngle) * radius;
    const targetY = center.y + Math.sin(orbitAngle) * radius * VERTICAL_SCALE;
 
    // ===== Resorte suave hacia órbita =====
    const springK = 0.028 + p.layer * 0.009;
    p.vx += (targetX - p.x) * springK;
    p.vy += (targetY - p.y) * springK;
 
    // ===== Repulsión del mouse (efecto antigravity) =====
    if (mouse.active) {
      const dx = p.x - mouse.x; // vector DESDE mouse → partícula (repulsión)
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
 
      if (dist < influenceRadius && dist > 1) {
        const influence = Math.max(0, 1 - dist / influenceRadius);
        const inf2 = influence * influence;
 
        // Repulsión radial
        const radialForce = inf2 * repelStrength * p.mouseScale;
        p.vx += (dx / dist) * radialForce;
        p.vy += (dy / dist) * radialForce;
 
        // Efecto "throw": el movimiento del mouse lanza partículas
        const mouseSpeed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
        const throwStrength = Math.min(mouseSpeed * 0.35, 6) * influence * p.mouseScale;
        p.vx += mouse.vx * throwStrength * 0.18;
        p.vy += mouse.vy * throwStrength * 0.18;
 
        // Remolino tangencial alrededor del cursor
        const tx = -dy / dist;
        const ty = dx / dist;
        const swirlForce = influence * 3.8 * p.mouseScale;
        p.vx += tx * swirlForce;
        p.vy += ty * swirlForce;
      }
    }
 
    // ===== Amortiguación y posición =====
    p.vx *= p.damping;
    p.vy *= p.damping;
    p.x += p.vx;
    p.y += p.vy;
 
    // ===== Ángulo: tangente a la órbita + bias de velocidad + wobble =====
    const orbitTangent = orbitAngle + Math.PI / 2;
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
 
    let finalAngle = orbitTangent;
    if (speed > 1.2) {
      // Cuando hay velocidad significativa, el trazo se alinea con el movimiento
      const motionAngle = Math.atan2(p.vy, p.vx);
      // Interpolación con wrapping correcto
      let diff = motionAngle - orbitTangent;
      if (diff > Math.PI) diff -= TWO_PI;
      if (diff < -Math.PI) diff += TWO_PI;
      finalAngle = orbitTangent + diff * Math.min(0.75, speed * 0.05);
    }
 
    p.angle = finalAngle + Math.sin(time * 1.7 + p.phase) * 0.09;
 
    // ===== Alpha: desvanece en zona de texto =====
    const ex = (p.x - width * 0.5) / textRx;
    const ey = (p.y - height * 0.52) / textRy;
    const textFade = ex * ex + ey * ey < 1 ? 0.22 : 1;
    const pulse = 0.88 + Math.sin(time * 1.15 + p.phase) * 0.12;
    const finalAlpha = Math.min(0.92, p.alpha * textFade * pulse);
 
    drawParticle(ctx, p, finalAlpha);
  }
}
 
function GravityFieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const sizeRef = useRef<CanvasSize>({ width: 0, height: 0, dpr: 1 });
  const mouseRef = useRef<MouseState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    vx: 0,
    vy: 0,
    active: false,
  });
  const centerRef = useRef<FieldCenter>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });
 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
 
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;
 
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reducedMotionQuery.matches;
 
    const paint = (time: number): void => {
      renderFrame(
        ctx,
        particlesRef.current,
        mouseRef.current,
        centerRef.current,
        sizeRef.current,
        time,
        reducedMotion
      );
    };
 
    const resize = (): void => {
      sizeRef.current = setupCanvas(canvas);
      particlesRef.current = createParticles(sizeRef.current);
      const { width, height } = sizeRef.current;
      mouseRef.current.x = width * 0.5;
      mouseRef.current.y = height * 0.5;
      mouseRef.current.targetX = mouseRef.current.x;
      mouseRef.current.targetY = mouseRef.current.y;
      centerRef.current.x = width * 0.5;
      centerRef.current.y = height * 0.5;
      centerRef.current.targetX = centerRef.current.x;
      centerRef.current.targetY = centerRef.current.y;
      paint(performance.now());
    };
 
    const animate = (time: number): void => {
      paint(time);
      if (!reducedMotion) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      }
    };
 
    const onPointerMove = (event: PointerEvent): void => {
      mouseRef.current.targetX = event.clientX;
      mouseRef.current.targetY = event.clientY;
      mouseRef.current.active = true;
      if (reducedMotion) paint(performance.now());
    };
 
    const onPointerLeave = (): void => {
      mouseRef.current.active = false;
    };
 
    const onMotionChange = (event: MediaQueryListEvent): void => {
      reducedMotion = event.matches;
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (!reducedMotion) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      } else {
        paint(performance.now());
      }
    };
 
    resize();
    if (!reducedMotion) {
      animationFrameRef.current = window.requestAnimationFrame(animate);
    }
 
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);
    reducedMotionQuery.addEventListener("change", onMotionChange);
 
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      reducedMotionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);
 
  return (
    <canvas
      ref={canvasRef}
      className="gravity-field-canvas"
      aria-hidden="true"
    />
  );
}
 
export default GravityFieldCanvas;
