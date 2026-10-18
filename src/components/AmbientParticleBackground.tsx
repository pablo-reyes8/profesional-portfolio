import { useEffect, useRef } from "react";
import { AntigravityScene } from "../lib/antigravity/AntigravityScene";

interface AmbientParticleBackgroundProps {
  className?: string;
  variant?: AmbientVariant;
}

type AmbientVariant = "about" | "projects" | "projectsTall" | "experience" | "experienceLight" | "formation" | "contact";

// Click shapes, indices matching the ambient shader:
const SHAPE = {
  rings: 0,
  card: 1,
  bell: 2,
  spark: 3,
  atom: 4,
  regression: 5,
  network: 6,
  histogram: 7
} as const;

// One shared pool. Each crowding level has its own odds: open space favours the richer,
// larger shapes; crowded spots favour compact ones that read in a small gap.
const poolByCrowding: Record<"open" | "medium" | "crowded", number[]> = {
  //       rings card bell spark atom regr. network hist.
  open: [0.4, 0.4, 2.5, 1.0, 3.0, 2.5, 3.0, 1.5],
  medium: [1.0, 1.5, 2.0, 2.5, 1.5, 1.5, 1.0, 3.0],
  crowded: [3.0, 3.0, 0.3, 2.0, 1.0, 0.3, 0.2, 0.6]
};

// Where on screen: the left third leans structured, the center leans toward networks and
// curves, the right leans organic.
const poolByColumn: number[][] = [
  [1.0, 1.4, 1.0, 0.8, 0.8, 1.3, 1.0, 1.4],
  [0.9, 0.9, 1.3, 1.0, 1.0, 1.0, 1.4, 1.0],
  [1.4, 0.8, 0.9, 1.3, 1.4, 0.9, 0.9, 0.8]
];

// Each section keeps a mild preference for its own shapes, so it still feels like itself.
const sectionAffinity: Record<AmbientVariant, number[]> = {
  about: [SHAPE.atom, SHAPE.rings],
  projects: [SHAPE.network, SHAPE.card],
  projectsTall: [SHAPE.network, SHAPE.card],
  experience: [SHAPE.regression, SHAPE.rings],
  experienceLight: [SHAPE.regression, SHAPE.rings],
  formation: [SHAPE.bell, SHAPE.histogram],
  contact: [SHAPE.spark, SHAPE.atom]
};

// Shared across sections: the last two shapes are left out of the next draw, so repeated
// clicks never give the same shape twice in a row anywhere on the page.
const recentShapes: number[] = [];

function pickClickShape(variant: AmbientVariant, density: number, clientX: number): { shape: number; scale: number } {
  const crowding = density < 0.2 ? "open" : density < 0.5 ? "medium" : "crowded";
  const column = Math.min(2, Math.max(0, Math.floor((clientX / window.innerWidth) * 3)));
  const affinity = sectionAffinity[variant];

  const weights = poolByCrowding[crowding].map((weight, shape) => {
    if (recentShapes.includes(shape)) {
      return 0;
    }
    return weight * poolByColumn[column][shape] * (affinity.includes(shape) ? 1.6 : 1);
  });

  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = Math.random() * total;
  let shape = weights.findIndex((weight) => (roll -= weight) <= 0);
  if (shape < 0) {
    shape = weights.findIndex((weight) => weight > 0);
  }

  recentShapes.push(shape);
  if (recentShapes.length > 2) {
    recentShapes.shift();
  }

  return { shape, scale: crowding === "open" ? 1.2 : crowding === "medium" ? 1 : 0.82 };
}

// What counts as content when judging how crowded a spot is.
const CONTENT_SELECTOR =
  "h1, h2, h3, h4, p, li, dd, dt, a, button, img, input, textarea, label, .pcard, .edu-record, .edu-row, .stack-panel, .cert-row";

/** Share (0 to 1) of points within ~110px of the pointer that land on content. */
function measureDensity(clientX: number, clientY: number): number {
  let hits = 0;
  let samples = 0;
  for (let ring = 1; ring <= 2; ring += 1) {
    for (let step = 0; step < 8; step += 1) {
      const angle = (step / 8) * Math.PI * 2 + ring * 0.4;
      const x = clientX + Math.cos(angle) * ring * 55;
      const y = clientY + Math.sin(angle) * ring * 55;
      if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) {
        continue;
      }
      samples += 1;
      if (document.elementFromPoint(x, y)?.closest(CONTENT_SELECTOR)) {
        hits += 1;
      }
    }
  }
  return samples > 0 ? hits / samples : 0;
}

function AmbientParticleBackground({ className, variant = "about" }: AmbientParticleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const container = containerRef.current;
    let scene: AntigravityScene | null = null;
    let isVisible = false;
    let frameId: number | null = null;
    let resizeFrameId: number | null = null;

    const animate = (): void => {
      if (!isVisible || !scene) {
        frameId = null;
        return;
      }

      scene.render();
      frameId = window.requestAnimationFrame(animate);
    };

    const startAnimation = (): void => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const createScene = (): AntigravityScene =>
      new AntigravityScene({
        container,
        theme: "light",
        mode: "ambient",
        ambientLayout:
          variant === "contact"
            ? "contact-field"
            : variant === "formation"
            ? "formation-bands"
            : variant === "experience" || variant === "experienceLight"
            ? "experience-stream"
            : variant === "projectsTall"
            ? "project-tall-ribbons"
            : variant === "projects"
              ? "project-ribbons"
              : "field",
        interactive: false,
        density: variant === "contact" ? 190 : variant === "formation" ? 205 : variant === "experience" ? 265 : variant === "experienceLight" ? 215 : variant === "projectsTall" ? 275 : variant === "projects" ? 195 : 215,
        particlesScale: variant === "contact" ? 1.32 : variant === "formation" ? 0.9 : variant === "experience" ? 0.9 : variant === "experienceLight" ? 0.84 : variant === "projectsTall" ? 1.31 : variant === "projects" ? 1.24 : 1.02,
        alpha: variant === "contact" ? 1.28 : variant === "formation" ? 1.5 : variant === "experience" ? 1.84 : variant === "experienceLight" ? 1.66 : variant === "projectsTall" ? 1.42 : variant === "projects" ? 1.26 : 1.3,
        colorFloor: variant === "contact" ? 0.44 : variant === "formation" ? 0.42 : variant === "experience" ? 0.88 : variant === "experienceLight" ? 0.82 : variant === "projectsTall" ? 0.34 : variant === "projects" ? 0.3 : 0,
        pixelRatio: variant === "experienceLight" ? 1.5 : undefined,
        colors:
          variant === "formation"
            ? {
                color1: "#4d1423",
                color2: "#bd162c",
                color3: "#ffb21c"
              }
            : variant === "experience" || variant === "experienceLight"
            ? {
                color1: "#9b1230",
                color2: "#ef3c2d",
                color3: "#ffb21c"
              }
            : variant === "projects" || variant === "projectsTall" || variant === "contact"
            ? {
                color1: "#2a0d16",
                color2: "#bd162c",
                color3: "#ffb21c"
              }
            : undefined,
        ringDisplacement: 0
      });

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;

        if (entry.isIntersecting) {
          if (!scene) {
            scene = createScene();
            scene.resize();
            measureAnchors();
          }
          scene.resume();
          startAnimation();
        } else {
          scene?.stop();
          if (frameId !== null) {
            window.cancelAnimationFrame(frameId);
            frameId = null;
          }
        }
      },
      { threshold: 0 }
    );

    observer.observe(container);

    // A click anywhere in the section pulls nearby particles into a shape drawn from the
    // shared pool, weighted by how crowded the spot is and where it sits on screen.
    const host = container.parentElement;
    const handlePointerDown = (event: PointerEvent): void => {
      if (!scene || event.button !== 0) {
        return;
      }

      const density = measureDensity(event.clientX, event.clientY);
      const { shape, scale } = pickClickShape(variant, density, event.clientX);
      const rect = container.getBoundingClientRect();
      scene.triggerClick(event.clientX - rect.left, event.clientY - rect.top, shape, scale);
    };
    host?.addEventListener("pointerdown", handlePointerDown);

    // Elements marked data-field-anchor (the Experience roles) become points the background
    // grows toward: y from [data-anchor-y], x from [data-anchor-x].
    const measureAnchors = (): void => {
      if (!scene || !host) {
        return;
      }

      const origin = container.getBoundingClientRect();
      const anchors = Array.from(host.querySelectorAll<HTMLElement>("[data-field-anchor]"))
        .slice(0, 8)
        .map((element) => {
          const yRect = (element.querySelector("[data-anchor-y]") ?? element).getBoundingClientRect();
          const xRect = (element.querySelector("[data-anchor-x]") ?? element).getBoundingClientRect();
          return {
            x: xRect.left - origin.left,
            y: yRect.top + yRect.height / 2 - origin.top,
            z: 0
          };
        });
      scene.setAnchors(anchors);
    };
    const anchorTimer = window.setInterval(() => {
      if (isVisible) {
        measureAnchors();
      }
    }, 1200);

    const resizeObserver = new ResizeObserver(() => {
      if (!scene) {
        return;
      }

      if (resizeFrameId !== null) {
        window.cancelAnimationFrame(resizeFrameId);
      }

      resizeFrameId = window.requestAnimationFrame(() => {
        scene?.resize();
        measureAnchors();
      });
    });

    resizeObserver.observe(container);

    return () => {
      host?.removeEventListener("pointerdown", handlePointerDown);
      window.clearInterval(anchorTimer);
      observer.disconnect();
      resizeObserver.disconnect();
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      if (resizeFrameId !== null) {
        window.cancelAnimationFrame(resizeFrameId);
      }
      scene?.kill();
    };
  }, [variant]);

  return (
    <div
      ref={containerRef}
      className={["ambient-particle-background", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    />
  );
}

export default AmbientParticleBackground;
