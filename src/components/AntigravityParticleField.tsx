import { useEffect, useRef } from "react";
import { AntigravityScene } from "../lib/antigravity/AntigravityScene";

export interface AntigravityParticleFieldProps {
  theme?: "light" | "dark";
  ringWidth?: number;
  ringWidth2?: number;
  ringDisplacement?: number;
  density?: number;
  particlesScale?: number;
  className?: string;
}

function AntigravityParticleField({
  theme = "light",
  ringWidth = 0.15,
  ringWidth2 = 0.05,
  ringDisplacement = 0.15,
  density = 200,
  particlesScale = 0.75,
  className
}: AntigravityParticleFieldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const container = containerRef.current;
    let scene: AntigravityScene | null = null;
    let isVisible = true;
    let animationFrameId: number | null = null;
    let observer: IntersectionObserver | null = null;
    let isDisposed = false;

    const animate = (): void => {
      animationFrameId = window.requestAnimationFrame(animate);
      if (isVisible && scene) {
        scene.render();
      }
    };

    // Deferring setup to a microtask prevents React Strict Mode from creating and
    // destroying the WebGL scene twice during development.
    queueMicrotask(() => {
      if (isDisposed) {
        return;
      }

      scene = new AntigravityScene({
        container,
        theme,
        particlesScale,
        density,
        interactive: true,
        gui: false,
        verbose: false,
        ringWidth,
        ringWidth2,
        ringDisplacement
      });

      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (entry.isIntersecting) {
            scene?.resume();
          } else {
            scene?.stop();
          }
        },
        { threshold: 0 }
      );

      observer.observe(container);
      animate();
    });

    return () => {
      isDisposed = true;
      observer?.disconnect();
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      scene?.kill();
    };
  }, [theme, ringWidth, ringWidth2, ringDisplacement, density, particlesScale]);

  return (
    <div
      ref={containerRef}
      className={["antigravity-particle-field", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    />
  );
}

export default AntigravityParticleField;
