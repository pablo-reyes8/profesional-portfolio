import { useEffect, useRef } from "react";
import { AntigravityScene } from "../lib/antigravity/AntigravityScene";

interface AmbientParticleBackgroundProps {
  className?: string;
  variant?: "about" | "projects" | "projectsTall" | "contact";
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
        variant === "contact"
          ? "contact-field"
          : variant === "projectsTall"
          ? "project-tall-ribbons"
          : variant === "projects"
            ? "project-ribbons"
            : "field",
      interactive: false,
      density: variant === "contact" ? 190 : variant === "projectsTall" ? 275 : variant === "projects" ? 195 : 165,
      particlesScale: variant === "contact" ? 1.08 : variant === "projectsTall" ? 1.42 : variant === "projects" ? 1.24 : 0.87,
      alpha: variant === "contact" ? 1.18 : variant === "projectsTall" ? 1.42 : variant === "projects" ? 1.26 : 1.3,
      ringDisplacement: 0
    });

    let isVisible = true;
    let frameId: number | null = null;
    let resizeFrameId: number | null = null;

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

    const resizeObserver = new ResizeObserver(() => {
      if (resizeFrameId !== null) {
        window.cancelAnimationFrame(resizeFrameId);
      }

      resizeFrameId = window.requestAnimationFrame(() => {
        scene.resize();
      });
    });

    resizeObserver.observe(containerRef.current);

    const animate = (): void => {
      frameId = window.requestAnimationFrame(animate);
      if (isVisible) {
        scene.render();
      }
    };

    animate();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      if (resizeFrameId !== null) {
        window.cancelAnimationFrame(resizeFrameId);
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
