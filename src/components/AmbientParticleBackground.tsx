import { useEffect, useRef } from "react";
import { AntigravityScene } from "../lib/antigravity/AntigravityScene";

interface AmbientParticleBackgroundProps {
  className?: string;
  variant?: "about" | "projects";
}

function AmbientParticleBackground({ className, variant = "about" }: AmbientParticleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const scene = new AntigravityScene({
      container: containerRef.current,
      theme: "light",
      mode: "ambient",
      ambientLayout: variant === "projects" ? "project-ribbons" : "field",
      interactive: false,
      density: variant === "projects" ? 150 : 165,
      particlesScale: variant === "projects" ? 0.82 : 0.87,
      alpha: variant === "projects" ? 0.92 : 1.3,
      ringDisplacement: 0
    });

    let isVisible = true;
    let frameId: number | null = null;

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
      frameId = window.requestAnimationFrame(animate);
      if (isVisible) {
        scene.render();
      }
    };

    animate();

    return () => {
      observer.disconnect();
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      scene.kill();
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
