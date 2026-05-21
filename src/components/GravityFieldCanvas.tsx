import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  angle: number;
  orbitRadius: number;
  angularVelocity: number;
  depth: number;
  color: string;
  alpha: number;
  phase: number;
  direction: number;
}

interface MouseState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  active: boolean;
}

interface CanvasSize {
  width: number;
  height: number;
  dpr: number;
}

const PARTICLE_COLORS = [
  "#4285F4",
  "#4285F4",
  "#4285F4",
  "#7E57C2",
  "#7E57C2",
  "#EA4335",
  "#EC407A",
  "#FBBC05",
  "#FBBC05",
  "#34A853"
];

const TWO_PI = Math.PI * 2;
const VERTICAL_SCALE = 0.78;

function random(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function sampleRadius(maxRadius: number): number {
  const ring = 0.24 + Math.pow(Math.random(), 0.58) * 0.86;
  return ring * maxRadius;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function getParticleCount(width: number, height: number): number {
  const area = width * height;
  const minCount = width < 640 ? 180 : 260;
  const maxCount = width < 640 ? 320 : 860;
  return Math.min(maxCount, Math.max(minCount, Math.floor(area / 2600)));
}

function createParticles(size: CanvasSize): Particle[] {
  const { width, height } = size;
  const count = getParticleCount(width, height);
  const maxRadius = Math.max(width, height) * (width < 700 ? 0.76 : 0.68);
  const cx = width * 0.52;
  const cy = height * 0.52;

  return Array.from({ length: count }, () => {
    const angle = random(0, TWO_PI);
    const orbitRadius = sampleRadius(maxRadius);
    const normalizedR = Math.min(1, orbitRadius / maxRadius);
    const depth = Math.pow(normalizedR, 2);
    const x = cx + Math.cos(angle) * orbitRadius;
    const y = cy + Math.sin(angle) * orbitRadius * VERTICAL_SCALE;
    const direction = Math.random() > 0.5 ? 1 : -1;

    return {
      x,
      y,
      vx: 0,
      vy: 0,
      radius: random(0.75, 1.25) + depth * 1.7,
      angle,
      orbitRadius,
      angularVelocity: random(0.00022, 0.00105) * (0.55 + depth) * direction,
      depth,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      alpha: 0.11 + depth * 0.58,
      phase: random(0, TWO_PI),
      direction
    };
  });
}

function setupCanvas(canvas: HTMLCanvasElement): CanvasSize {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, rect.width);
  const height = Math.max(480, rect.height);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  return { width, height, dpr };
}

function renderFrame(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  mouse: MouseState,
  size: CanvasSize,
  time: number,
  reducedMotion: boolean
): void {
  const { width, height } = size;
  const centerDriftX = reducedMotion ? 0 : Math.sin(time * 0.00012) * width * 0.05;
  const centerDriftY = reducedMotion ? 0 : Math.cos(time * 0.0001) * height * 0.04;
  const cx = width * 0.52 + centerDriftX;
  const cy = height * 0.52 + centerDriftY;
  const influenceRadius = Math.min(width, height) * (width < 640 ? 0.42 : 0.32);
  const textCx = width * 0.5;
  const textCy = height * 0.52;
  const textRx = Math.min(width * 0.36, 560);
  const textRy = Math.min(height * 0.23, 220);

  ctx.clearRect(0, 0, width, height);
  mouse.x += (mouse.targetX - mouse.x) * 0.08;
  mouse.y += (mouse.targetY - mouse.y) * 0.08;

  for (const particle of particles) {
    if (!reducedMotion) {
      particle.angle += particle.angularVelocity;
    }

    const breathing = reducedMotion
      ? 0
      : Math.sin(time * 0.00045 + particle.phase) * (5 + particle.depth * 7);
    const orbitR = particle.orbitRadius + breathing;
    const targetX = cx + Math.cos(particle.angle) * orbitR;
    const targetY = cy + Math.sin(particle.angle) * orbitR * VERTICAL_SCALE;
    const spring = 0.015 + particle.depth * 0.006;

    particle.vx += (targetX - particle.x) * spring;
    particle.vy += (targetY - particle.y) * spring;

    if (mouse.active && !reducedMotion) {
      const dx = mouse.x - particle.x;
      const dy = mouse.y - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / influenceRadius);

      if (influence > 0) {
        const nx = dx / (dist + 0.0001);
        const ny = dy / (dist + 0.0001);
        const force = influence * influence * (width < 640 ? 0.18 : 0.34);
        const swirl = influence * (width < 640 ? 0.08 : 0.16) * particle.direction;

        particle.vx += nx * force;
        particle.vy += ny * force;
        particle.vx += -ny * swirl;
        particle.vy += nx * swirl;
      }
    }

    particle.vx *= reducedMotion ? 0.78 : 0.88;
    particle.vy *= reducedMotion ? 0.78 : 0.88;
    particle.x += particle.vx;
    particle.y += particle.vy;

    const ex = (particle.x - textCx) / textRx;
    const ey = (particle.y - textCy) / textRy;
    const textFade = ex * ex + ey * ey < 1 ? 0.17 : 1;
    const edgeFade =
      particle.x < -90 ||
      particle.x > width + 90 ||
      particle.y < -90 ||
      particle.y > height + 90
        ? 0
        : 1;

    if (edgeFade === 0) {
      continue;
    }

    const pulse = reducedMotion
      ? 1
      : 0.88 + Math.sin(time * 0.001 + particle.phase) * 0.12;
    const renderAlpha = Math.min(0.82, particle.alpha * textFade * pulse);
    const dashLength = 2.2 + particle.depth * 6.8 + particle.radius * 0.8;
    const dashWidth = 1.1 + particle.depth * 1.65;
    const localAngle =
      particle.angle +
      Math.PI / 2 +
      (reducedMotion ? 0 : Math.sin(time * 0.001 + particle.phase) * 0.13);

    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(localAngle);
    ctx.globalAlpha = renderAlpha;
    ctx.fillStyle = particle.color;
    drawRoundedRect(
      ctx,
      -dashLength / 2,
      -dashWidth / 2,
      dashLength,
      dashWidth,
      dashWidth / 2
    );
    ctx.fill();
    ctx.restore();
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
    active: false
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reducedMotionQuery.matches;

    const resize = (): void => {
      sizeRef.current = setupCanvas(canvas);
      particlesRef.current = createParticles(sizeRef.current);
      mouseRef.current.x = sizeRef.current.width * 0.52;
      mouseRef.current.y = sizeRef.current.height * 0.52;
      mouseRef.current.targetX = mouseRef.current.x;
      mouseRef.current.targetY = mouseRef.current.y;
      renderFrame(
        ctx,
        particlesRef.current,
        mouseRef.current,
        sizeRef.current,
        performance.now(),
        reducedMotion
      );
    };

    const animate = (time: number): void => {
      renderFrame(
        ctx,
        particlesRef.current,
        mouseRef.current,
        sizeRef.current,
        time,
        reducedMotion
      );

      if (!reducedMotion) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const onPointerMove = (event: PointerEvent): void => {
      mouseRef.current.targetX = event.clientX;
      mouseRef.current.targetY = event.clientY;
      mouseRef.current.active = true;

      if (reducedMotion) {
        renderFrame(
          ctx,
          particlesRef.current,
          mouseRef.current,
          sizeRef.current,
          performance.now(),
          reducedMotion
        );
      }
    };

    const onPointerLeave = (): void => {
      mouseRef.current.active = false;
    };

    const onMotionPreferenceChange = (event: MediaQueryListEvent): void => {
      reducedMotion = event.matches;

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (reducedMotion) {
        renderFrame(
          ctx,
          particlesRef.current,
          mouseRef.current,
          sizeRef.current,
          performance.now(),
          true
        );
      } else {
        animationFrameRef.current = window.requestAnimationFrame(animate);
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
    reducedMotionQuery.addEventListener("change", onMotionPreferenceChange);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      reducedMotionQuery.removeEventListener("change", onMotionPreferenceChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="gravity-field-canvas" aria-hidden="true" />;
}

export default GravityFieldCanvas;
