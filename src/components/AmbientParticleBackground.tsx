import { useEffect, useRef } from "react";
import { AntigravityScene } from "../lib/antigravity/AntigravityScene";

interface AmbientParticleBackgroundProps {
  className?: string;
  variant?: "about" | "projects" | "projectsTall" | "experience" | "formation" | "contact";
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
          : variant === "formation"
          ? "formation-bands"
          : variant === "experience"
          ? "experience-stream"
          : variant === "projectsTall"
          ? "project-tall-ribbons"
          : variant === "projects"
            ? "project-ribbons"
            : "field",
      interactive: false,
      density: variant === "contact" ? 190 : variant === "formation" ? 205 : variant === "experience" ? 265 : variant === "projectsTall" ? 275 : variant === "projects" ? 195 : 165,
      particlesScale: variant === "contact" ? 1.32 : variant === "formation" ? 0.9 : variant === "experience" ? 1.01 : variant === "projectsTall" ? 1.52 : variant === "projects" ? 1.24 : 0.87,
      alpha: variant === "contact" ? 1.28 : variant === "formation" ? 1.5 : variant === "experience" ? 1.84 : variant === "projectsTall" ? 1.42 : variant === "projects" ? 1.26 : 1.3,
      colorFloor: variant === "contact" ? 0.44 : variant === "formation" ? 0.42 : variant === "experience" ? 0.88 : variant === "projectsTall" ? 0.34 : variant === "projects" ? 0.3 : 0,
      colors:
        variant === "formation"
          ? {
              color1: "#4d1423",
              color2: "#bd162c",
              color3: "#ffb21c"
            }
          : variant === "experience"
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
