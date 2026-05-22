import { useEffect, useRef } from "react";
import { AntigravityScene } from "../lib/antigravity/AntigravityScene";

interface AmbientParticleBackgroundProps {
  className?: string;
  variant?: "about" | "projects" | "projectsTall";
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
      ambientLayout:
        variant === "projectsTall"
          ? "project-tall-ribbons"
          : variant === "projects"
            ? "project-ribbons"
            : "field",
      interactive: false,
      density: variant === "projectsTall" ? 260 : variant === "projects" ? 195 : 165,
      particlesScale: variant === "projectsTall" ? 1.34 : variant === "projects" ? 1.24 : 0.87,
      alpha: variant === "projectsTall" ? 1.34 : variant === "projects" ? 1.26 : 1.3,
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
