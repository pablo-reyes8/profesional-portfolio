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

    const scene = new AntigravityScene({
      container: containerRef.current,
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

    let isVisible = true;
    let animationFrameId: number | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (entry.isIntersecting) {
          scene.resume();
        } else {
          scene.stop();
        }
      },
      { threshold: 0 }
    );

    observer.observe(containerRef.current);

    const animate = (): void => {
      animationFrameId = window.requestAnimationFrame(animate);
      if (isVisible) {
        scene.render();
      }
    };

    animate();

    return () => {
      observer.disconnect();
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      scene.kill();
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
